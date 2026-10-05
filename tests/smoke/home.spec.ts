import { expect, test } from "@playwright/test";

test("home page loads with the app shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Exam Photo Tool" })).toBeVisible();
  await expect(page.getByTestId("privacy-line")).toHaveText(
    "Your photos never leave your device.",
  );
  await expect(page.getByRole("link", { name: "Privacy" })).toBeVisible();
});
