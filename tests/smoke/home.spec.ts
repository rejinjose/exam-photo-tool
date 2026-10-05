import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  // TEMPORARY: deliberately wrong assertion to verify CI uploads the
  // Playwright report on failure (T-02 AC). Reverted in the next commit.
  await expect(page.getByRole("heading", { name: "Exam Photo Tool" })).toBeHidden();
  await expect(page.getByTestId("hello")).toBeVisible();
});
