import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("shows the core offer and a working Telegram destination", async ({ page }) => {
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "VPN без лишних сложностей для телефона и компьютера"
    })
  ).toBeVisible();

  await expect(page.getByRole("link", { name: "Перейти в Telegram-бот" }).first()).toHaveAttribute(
    "href",
    "https://t.me/OpenAccessVPN_bot"
  );
});

test("announces unavailable demo actions", async ({ page }) => {
  await page.locator(".hero-actions").getByRole("link", { name: "Подключить VPN" }).click();

  await expect(page.getByRole("status")).toHaveText(
    "Подключение пока недоступно в демонстрационной версии."
  );
});

test("support links lead to the dedicated Telegram support destination", async ({ page }) => {
  const supportLink = page.locator(".hero-text-links").getByRole("link", {
    name: "Нужна помощь? Написать в поддержку"
  });

  await expect(supportLink).toHaveAttribute(
    "href",
    "https://t.me/OpenAccessVPN_bot?start=support"
  );
});

test("internal navigation reaches the requested section", async ({ page }) => {
  await page.getByRole("link", { name: "Как проходит подключение" }).click();

  await expect(page).toHaveURL(/#instruction$/);
  await expect(page.getByRole("heading", { name: "Инструкция подключения" })).toBeInViewport();
});

test("skip link moves keyboard focus to the main content", async ({ page }) => {
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "К основному содержанию" });

  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("global planet stays anchored to the viewport while content scrolls", async ({ page }) => {
  const backdrop = page.locator(".site-backdrop");
  const planet = page.locator(".site-planet");
  const start = await planet.boundingBox();

  await expect(backdrop).toHaveCSS("position", "fixed");
  await expect(backdrop).toHaveCSS("pointer-events", "none");
  await page.locator("#faq").scrollIntoViewIfNeeded();
  const scrolled = await planet.boundingBox();

  expect(start).not.toBeNull();
  expect(scrolled).not.toBeNull();
  expect(Math.abs(start.x - scrolled.x)).toBeLessThan(3);
  expect(Math.abs(start.y - scrolled.y)).toBeLessThan(3);
});

test("mobile menu supports opening and Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole("button", { name: "Открыть меню" });

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Преимущества" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("has no serious automatically detectable accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const seriousViolations = results.violations.filter(({ impact }) =>
    ["serious", "critical"].includes(impact)
  );

  expect(seriousViolations).toEqual([]);
});

test("account preview does not expose a public subscription link", async ({ page }) => {
  await page.goto("/account/");

  await expect(
    page.getByRole("heading", { name: "Личный кабинет скоро будет доступен" })
  ).toBeVisible();
  await expect(page.locator('a[href^="vless:"], a[href*="subscription"]')).toHaveCount(0);
});
