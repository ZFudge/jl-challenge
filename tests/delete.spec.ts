import { test, expect } from "@playwright/test";

test("should navigate to dashboard -> campaigns -> delete", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/dashboard");
  await page.click("text=Campaigns");
  await page.waitForURL("http://localhost:3000/dashboard/campaigns");

  const el = page.getByTestId("campaign-row-2");
  const campaignId = await el.getAttribute("data-id");
  await page.getByTestId(`delete-campaign-button-${campaignId}`).last().click();
  await page.waitForURL("http://localhost:3000/dashboard/campaigns");
  await expect(
    page.getByTestId(`campaign-row-${campaignId}`),
  ).not.toBeVisible();
});
