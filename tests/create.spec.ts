import { test, expect } from "@playwright/test";

test("should navigate to dashboard -> campaigns", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/dashboard");
  await expect(page.locator("h1")).toContainText("Dashboard");
  await page.click("text=Campaigns");

  await page.waitForURL("http://localhost:3000/dashboard/campaigns");
  await expect(page.locator("h1")).toContainText("Campaigns");
});

test("should navigate to dashboard -> campaigns -> create", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/dashboard");
  await page.click("text=Campaigns");
  await page.waitForURL("http://localhost:3000/dashboard/campaigns");
  await page.click("text=Create Campaign");

  await page.waitForURL("http://localhost:3000/dashboard/campaigns/create");
  await expect(page.getByTestId("create-campaign-button")).toContainText(
    "Create Campaign",
  );

  await page
    .getByPlaceholder("Enter Campaign Name")
    .fill("This Is a Test Name");
  await page.getByTestId("publisher-select").selectOption({
    label: "Code Book",
  });
  await page.getByPlaceholder("Enter USD Budget").fill("123");
  await page.getByTestId("create-campaign-button").click();

  await page.waitForURL("http://localhost:3000/dashboard/campaigns");
  const el = page.getByTestId("campaign-row-0");
  const campaignId = await el.getAttribute("data-id");
  const name = page.getByTestId(`campaign-name-${campaignId}`);
  const budget = page.getByTestId(`campaign-budget-${campaignId}`);
  await expect(name).toContainText("This Is a Test Name");
  await expect(budget).toContainText("$123.00");
});
