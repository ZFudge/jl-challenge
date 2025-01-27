import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("http://localhost:3000/dashboard");
  await page.waitForURL(
    "http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard",
  );
  await page.getByTestId("email-input").fill("testuser@test.com");
  await page.getByTestId("password-input").fill("pw12345");
  await page.getByTestId("login-button").click();
  // Wait until the page receives the cookies.
  await page.waitForResponse(
    "http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard",
  );
  // End of authentication steps.

  await page.context().storageState({ path: authFile });

  // await expect(page.getByTestId("sign-out")).toBeVisible();
});
