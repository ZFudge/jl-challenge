import { auth } from "@/auth";
import {
  CampaignForm,
  CampaignsTable,
  LatestCampaignRaw,
  PublisherField,
  PublishersTableType,
  Spend,
} from "./definitions";
import { formatCurrency } from "./utils";
import client from "@/app/lib/db";

export async function fetchSpend() {
  try {
    const data = await client.query<Spend>(`SELECT * FROM spend`);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch spend data.");
  }
}

export async function fetchLatestCampaigns() {
  const session = await auth();
  try {
    const data = await client.query<LatestCampaignRaw>({
      text: `
        SELECT
          campaigns.budget,
          publishers.name,
          publishers.image_url,
          publishers.email,
          campaigns.id,
          campaigns.devices,
          campaigns.geo,
          campaigns.gender,
          campaigns.age
        FROM
          campaigns
        JOIN
          publishers ON campaigns.publisher_id = publishers.id
        WHERE
          campaigns.owner_id = (SELECT id FROM users WHERE email = $1)
        ORDER BY
          campaigns.date DESC
        LIMIT 5
      `,
      values: [session?.user?.email],
    });

    const latestCampaigns = data.rows.map((campaign: LatestCampaignRaw) => ({
      ...campaign,
      budget: formatCurrency(campaign.budget),
    }));
    return latestCampaigns;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest campaigns.");
  }
}

export async function fetchCardData() {
  const session = await auth();
  try {
    const campaignCountPromise = client.query({
      text: `
        SELECT
          COUNT(*)
        FROM
          campaigns
        WHERE
          owner_id = (SELECT id FROM users WHERE email = $1)
        `,
      values: [session?.user?.email],
    });
    const publisherCountPromise = client.query(`SELECT COUNT(*) FROM publishers`);
    const campaignStatusPromise = client.query(`SELECT
         SUM(CASE WHEN status = 'paid' THEN budget ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN budget ELSE 0 END) AS "pending"
         FROM campaigns`);

    const data = await Promise.all([
      campaignCountPromise,
      publisherCountPromise,
      campaignStatusPromise,
    ]);

    const numberOfCampaigns = Number(data[0].rows[0].count ?? "0");
    const numberOfPublishers = Number(data[1].rows[0].count ?? "0");
    const totalPaidCampaigns = formatCurrency(data[2].rows[0].paid ?? "0");
    const totalPendingCampaigns = formatCurrency(data[2].rows[0].pending ?? "0");

    return {
      numberOfPublishers,
      numberOfCampaigns,
      totalPaidCampaigns,
      totalPendingCampaigns,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredCampaigns(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const session = await auth();

  try {
    const campaigns = await client.query<CampaignsTable>({
      text: `
      SELECT
        campaigns.id,
        campaigns.owner_id,
        campaigns.budget,
        campaigns.date,
        campaigns.status,
        campaigns.name as name,
        campaigns.gender,
        campaigns.age,
        campaigns.devices,
        campaigns.geo,
        publishers.name as publisherName,
        publishers.email,
        publishers.image_url
      FROM campaigns
      JOIN publishers ON campaigns.publisher_id = publishers.id
      JOIN users ON campaigns.owner_id = users.id
      WHERE (
        publishers.name ILIKE $1 OR
        publishers.email ILIKE $1 OR
        campaigns.budget::text ILIKE $1 OR
        campaigns.date::text ILIKE $1 OR
        campaigns.status ILIKE $1
      ) AND users.email = $4
      ORDER BY campaigns.date DESC
      LIMIT $2 OFFSET $3
    `,
      values: [`%${query}%`, ITEMS_PER_PAGE, offset, session?.user?.email],
    });

    return campaigns.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch campaigns.");
  }
}

export async function fetchCampaignsPages(query: string) {
  const session = await auth();
  try {
    const count = await client.query({
      text: `
        SELECT COUNT(*)
        FROM campaigns
        JOIN publishers ON campaigns.publisher_id = publishers.id
        WHERE (
          publishers.name ILIKE $1 OR
          publishers.email ILIKE $1 OR
          campaigns.budget::text ILIKE $1 OR
          campaigns.date::text ILIKE $1 OR
          campaigns.status ILIKE $1
        ) AND campaigns.owner_id = (SELECT id FROM users WHERE email = $2)
      `,
      values: [`%${query}%`, session?.user?.email],
    });

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of campaigns.");
  }
}

export async function fetchCampaignById(id: string) {
  const session = await auth();
  try {
    const data = await client.query<CampaignForm>({
      text: `
        SELECT
          campaigns.id,
          campaigns.publisher_id,
          campaigns.name,
          campaigns.budget,
          campaigns.status,
          campaigns.startDate as startDate,
          campaigns.endDate as endDate,
          campaigns.devices,
          campaigns.geo,
          campaigns.gender,
          campaigns.age
        FROM
          campaigns
        WHERE
          campaigns.id = $1
          AND campaigns.owner_id = (SELECT id FROM users WHERE email = $2)
      `,
      values: [id, session?.user?.email],
    });

    const campaign = data.rows.map((campaign: CampaignForm) => ({
      ...campaign,
      // Convert budget from cents to dollars
      budget: campaign.budget / 100,
    }));

    return campaign[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch campaign.");
  }
}

export async function fetchPublishers() {
  try {
    const data = await client.query<PublisherField>(`
      SELECT
        id,
        name
      FROM
        publishers
      ORDER BY
        name ASC;
    `);

    const publishers = data.rows;
    return publishers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all publishers.");
  }
}

export async function fetchFilteredPublishers(query: string) {
  try {
    const data = await client.query<PublishersTableType>({
      text: `
        SELECT
          publishers.id,
          publishers.name,
          publishers.email,
          publishers.image_url,
          COUNT(campaigns.id) AS total_campaigns,
          SUM(CASE WHEN campaigns.status = 'pending' THEN campaigns.budget ELSE 0 END) AS total_pending,
          SUM(CASE WHEN campaigns.status = 'paid' THEN campaigns.budget ELSE 0 END) AS total_paid
        FROM
          publishers
        LEFT JOIN
          campaigns ON publishers.id = campaigns.publisher_id
        WHERE
          publishers.name ILIKE $1 OR
          publishers.email ILIKE $1
        GROUP BY
          publishers.id,
          publishers.name,
          publishers.email,
          publishers.image_url
        ORDER BY
          publishers.name ASC;
      `,
      values: [`%${query}%`],
    });

    const publishers = data.rows.map((publisher: PublishersTableType) => ({
      ...publisher,
      total_pending: formatCurrency(publisher.total_pending),
      total_paid: formatCurrency(publisher.total_paid),
    }));

    return publishers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch publisher table.");
  }
}
