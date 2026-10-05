import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Exam Photo Tool" })).toBeVisible();
  await expect(page.getByTestId("hello")).toBeVisible();
});
