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
      name VARCHAR(255) NOT NULL,
      publisher_id UUID NOT NULL,
      budget INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `);

  const insertedCampaigns = await Promise.all(
    campaigns.map((campaign) =>
      client.query({
        text: "INSERT INTO campaigns (name, publisher_id, budget, status, date) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING",
        values: [
          campaign.name,
          campaign.publisher_id,
          campaign.budget,
          campaign.status,
          campaign.date,
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
