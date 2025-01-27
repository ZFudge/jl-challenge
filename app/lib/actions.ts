"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { deviceNameToIdMapping } from "@/app/lib/placeholder-data";
import client from "./db";
import { Geo } from "./definitions";

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  budget: z.coerce
    .number()
    .gt(0, { message: "Please enter an budget greater than $0." }),
  date: z.string(),
  // start/end dates use unix timestamps
  startDate: z.coerce.number(),
  endDate: z.coerce.number(),
  publisherId: z.string({
    invalid_type_error: "Please select a publisher.",
  }),
  devices: z.string().or(z.null()),
  gender: z.string().or(z.null()),
  age: z.string().or(z.null()),
  // geo
  country: z.string().or(z.null()),
  state: z.string().or(z.null()),
  city: z.string().or(z.null()),
  zipCode: z.string().or(z.null()),
});

const CreateCampaign = FormSchema.omit({ id: true, date: true });
const UpdateCampaign = FormSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    name?: string;
    publisherId?: string[];
    budget?: number;
    startDate?: string | null;
    endDate?: string | null;
    devices?: string | null;
    gender?: string | null;
    age?: string | null;
    country?: string | null;
    state?: string | null;
    city?: string | null;
    zipCode?: string | null;
    geo?: Geo | null;
  };
  message?: string | null;
};

export async function createCampaign(prevState: State, formData: FormData) {
  console.log(
    `actions.createCampaign prevState = ${JSON.stringify(prevState)}`,
  );
  console.log(`formData = ${JSON.stringify(formData)}`);
  // Validate form fields using Zod
  const validatedFields = CreateCampaign.safeParse({
    name: formData.get("name"),
    budget: formData.get("budget"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    // targeting
    publisherId: formData.get("publisherId"),
    devices: formData.get("devices"),
    gender: formData.get("gender"),
    age: formData.get("age"),
    // geo
    country: formData.get("country"),
    state: formData.get("state"),
    city: formData.get("city"),
    zipCode: formData.get("zipCode"),
  });
  console.log(`validatedFields = ${JSON.stringify(validatedFields)}`);
  const session = await auth();
  const email = session?.user?.email;

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Campaign.",
    };
  }
  const { country, state, city, zipCode } = validatedFields.data;
  let geo = {
    country,
    state,
    city,
    zipCode,
  };
  let { gender, age } = validatedFields.data;

  // set initial status based on start date
  let status = "pending";
  if (Number(validatedFields?.data?.startDate) < Date.now()) {
    status = "active";
  }

  let { name, publisherId, budget } = validatedFields.data;
  const budgetInCents = budget * 100;
  const date = new Date().toISOString().split("T")[0];
  let devices: string | undefined | null | Record<string, string> =
    validatedFields.data.devices;
  if (devices) {
    devices = Object.fromEntries(
      devices.split(",").map((name) => [deviceNameToIdMapping[name], name]),
    );
  } else {
    devices = null;
  }
  let startDate: number | undefined | string = validatedFields.data.startDate;
  if (startDate) {
    startDate = new Date(Number(startDate)).toUTCString();
  }
  let endDate: number | undefined | string = validatedFields.data.endDate;
  if (endDate) {
    endDate = new Date(Number(endDate)).toUTCString();
  }

  // Insert data into the database
  try {
    await client.query({
      text: `
        INSERT INTO campaigns (
          name,
          owner_id,
          publisher_id,
          budget,
          status,
          date,
          startDate,
          endDate,
          devices,
          geo,
          gender,
          age
        )
        VALUES ($1, (SELECT id FROM users WHERE email = $2), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `,
      values: [
        name,
        email,
        publisherId,
        budgetInCents,
        status,
        date,
        startDate,
        endDate,
        devices,
        geo,
        gender,
        age,
      ],
    });
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return {
      message: "Database Error: Failed to Create Campaign.",
    };
  }

  // Revalidate the cache for the campaigns page and redirect the user.
  revalidatePath("/dashboard/campaigns");
  redirect("/dashboard/campaigns");
}

export async function updateCampaign(
  id: string,
  prevState: State,
  formData: FormData,
) {
  console.log(`updateCampaign.formData = ${JSON.stringify(formData)}`);
  const validatedFields = UpdateCampaign.safeParse({
    publisherId: formData.get("publisherId"),
    name: formData.get("name"),
    budget: formData.get("budget"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    devices: formData.get("devices"),
    country: formData.get("country"),
    state: formData.get("state"),
    city: formData.get("city"),
    zipCode: formData.get("zipCode"),
    gender: formData.get("gender"),
    age: formData.get("age"),
  });
  console.log(`validatedFields = ${JSON.stringify(validatedFields)}`);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Campaign.",
    };
  }

  let status = "active";
  let { publisherId, budget, gender, age } = validatedFields.data;
  const budgetInCents = budget * 100;
  let devices: string | null | undefined | Record<string, string> =
    validatedFields.data.devices;
  if (devices) {
    devices = Object.fromEntries(
      devices.split(",").map((name) => [deviceNameToIdMapping[name], name]),
    );
  } else {
    devices = null;
  }
  let startDate: number | undefined | string = validatedFields.data.startDate;
  if (startDate) {
    startDate = new Date(Number(startDate)).toUTCString();
  }
  let endDate: number | undefined | string = validatedFields.data.endDate;
  if (endDate) {
    endDate = new Date(Number(endDate)).toUTCString();
  }
  const { country, state, city, zipCode } = validatedFields.data;
  let geo = {
    country,
    state,
    city,
    zipCode,
  };

  try {
    await client.query({
      text: `
        UPDATE
          campaigns
        SET
          publisher_id = $1,
          budget = $2,
          status = $3,
          startDate = $4,
          endDate = $5,
          devices = $6,
          geo = $7,
          gender = $8,
          age = $9
        WHERE
          id = $10
      `,
      values: [
        publisherId,
        budgetInCents,
        status,
        startDate,
        endDate,
        devices,
        geo,
        gender,
        age,
        id,
      ],
    });
  } catch (error) {
    console.error("Failed to update campaign:", error);
    return { message: "Database Error: Failed to Update Campaign." };
  }

  revalidatePath("/dashboard/campaigns");
  redirect("/dashboard/campaigns");
}

export async function deleteCampaign(id: string) {
  await client.query({
    text: `DELETE FROM campaigns WHERE id = $1`,
    values: [id],
  });
  revalidatePath("/dashboard/campaigns");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
