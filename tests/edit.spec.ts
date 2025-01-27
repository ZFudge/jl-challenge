import { test, expect } from "@playwright/test";

test("should navigate to dashboard -> campaigns -> edit", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)

  await page.goto("http://localhost:3000/dashboard");
  await page.click("text=Campaigns");
  await page.waitForURL("http://localhost:3000/dashboard/campaigns");
  const el = page.getByTestId("campaign-row-2");
  const campaignId = await el.getAttribute("data-id");
  await page.getByTestId(`update-campaign-button-${campaignId}`).last().click();

  await page.waitForURL(
    `http://localhost:3000/dashboard/campaigns/${campaignId}/edit`,
  );
  await expect(page.getByTestId("edit-campaign-button")).toBeVisible();
  await page.getByPlaceholder("Enter USD Budget").fill("777");
  await page.getByPlaceholder("Enter Campaign Name").fill("Chocolate Sauce");
  await page.getByTestId("edit-campaign-button").click();

  await page.waitForURL("http://localhost:3000/dashboard/campaigns");
  const name = page.getByTestId(`campaign-name-${campaignId}`);
  const budget = page.getByTestId(`campaign-budget-${campaignId}`);
  await expect(name).toContainText("Chocolate Sauce");
  await expect(budget).toContainText("$777.00");
});
