"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import client from "./db";

const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: "Please enter a campaign name, at least 3 characters." }),
  publisherId: z.string({
    invalid_type_error: "Please select a publisher.",
  }),
  budget: z.coerce
    .number()
    .gt(0, { message: "Please enter an budget greater than $0." }),
  date: z.string(),
});

const CreateCampaign = FormSchema.omit({ id: true, date: true });
const UpdateCampaign = FormSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    publisherId?: string[];
    budget?: string[];
    name?: string[];
  };
  message?: string | null;
};

export async function createCampaign(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateCampaign.safeParse({
    publisherId: formData.get("publisherId"),
    budget: formData.get("budget"),
    name: formData.get("name"),
  });
  console.log(`createCampaign validatedFields: ${JSON.stringify(validatedFields)}`);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Campaign.",
    };
  }

  // Prepare data for insertion into the database
  const { publisherId, budget, name } = validatedFields.data;
  const budgetInCents = budget * 100;
  const date = new Date().toISOString().split("T")[0];
  // TODO: set status dynamically depending on start/end date
  let status = "active";

  // Insert data into the database
  try {
    await client.query({
      text: `
        INSERT INTO campaigns (
          name,
          publisher_id,
          budget,
          status,
          date
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      values: [name, publisherId, budgetInCents, status, date],
    });
  } catch (error) {
    // If a database error occurs, return a more specific error.
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
  const validatedFields = UpdateCampaign.safeParse({
    publisherId: formData.get("publisherId"),
    budget: formData.get("budget"),
    name: formData.get("name"),
  });
  console.log(`updateCampaign validatedFields: ${JSON.stringify(validatedFields)}`);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Campaign.",
    };
  }
  // TODO: set status dynamically depending on start/end date
  let status = "active";

  const { publisherId, budget, name } = validatedFields.data;
  const budgetInCents = budget * 100;
  const date = new Date().toISOString().split("T")[0];
  try {
    await client.query({
      text: `
        UPDATE
          campaigns
        SET
          name = $1,
          publisher_id = $2,
          budget = $3,
          status = $4,
          date = $5
        WHERE id = $6
      `,
      values: [name, publisherId, budgetInCents, status, date, id],
    });
  } catch (error) {
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
