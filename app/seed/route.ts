import bcrypt from "bcrypt";
import { campaigns, publishers, spend, users } from "../lib/placeholder-data";

import client from "../lib/db";

async function seedUsers() {
  await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      console.log("user", user);
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.query({
        text: "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
        values: [user.id, user.name, user.email, hashedPassword],
      });
    }),
  );

  return insertedUsers;
}

async function seedCampaigns() {
  await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await client.query(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      owner_id UUID NOT NULL,
      name VARCHAR(255) NOT NULL,
      publisher_id UUID NOT NULL,
      budget INT NOT NULL,
      date DATE NOT NULL,
      status VARCHAR(255) NOT NULL,
      gender VARCHAR(255),
      age VARCHAR(255),
      devices JSONB,
      geo JSONB,
      startDate DATE,
      endDate DATE
    );
  `);

  const insertedCampaigns = await Promise.all(
    campaigns.map((campaign) =>
      client.query({
        text: "INSERT INTO campaigns (owner_id, name, publisher_id, budget, date, status, gender, age, devices, geo, startDate, endDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (id) DO NOTHING",
        values: [
          campaign.owner_id,
          campaign.name,
          campaign.publisher_id,
          campaign.budget,
          campaign.date,
          campaign.status,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      }),
    ),
  );

  return insertedCampaigns;
}

async function seedPublishers() {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS publishers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      domain VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `);

  const insertedPublishers = await Promise.all(
    publishers.map((publisher) =>
      client.query({
        text: "INSERT INTO publishers (id, name, email, domain, image_url) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING",
        values: [
          publisher.id,
          publisher.name,
          publisher.email,
          publisher.domain,
          publisher.image_url,
        ],
      }),
    ),
  );

  return insertedPublishers;
}

async function seedSpend() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS spend (
      month VARCHAR(4) NOT NULL UNIQUE,
      spend INT NOT NULL
    );
  `);

  const insertedSpend = await Promise.all(
    spend.map((rev) =>
      client.query({
        text: "INSERT INTO spend (month, spend) VALUES ($1, $2) ON CONFLICT (month) DO NOTHING",
        values: [rev.month, rev.spend],
      }),
    ),
  );

  return insertedSpend;
}

export async function GET() {
  try {
    await seedUsers();
    await seedPublishers();
    await seedCampaigns();
    await seedSpend();

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    return Response.json({ error }, { status: 500 });
  }
}
