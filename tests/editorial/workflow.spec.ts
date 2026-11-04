import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const password = process.env.KIDORA_TEST_PASSWORD;
if (!password) throw new Error("Run npm run test:editorial for isolated accounts and database.");

async function login(page: Page, role: string) {
  await page.goto("/administration/connexion");
  await page.getByLabel("Adresse e-mail").fill(role + "@example.test");
  await page.getByLabel("Mot de passe").fill(password!);
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
  await expect(page).toHaveURL(/\/administration$/);
}
async function logout(page: Page) {
  await page.getByRole("button", { name: "Se déconnecter" }).click();
  await expect(page).toHaveURL(/\/connexion$/);
}
test("session, protection CSRF, origine et accessibilité", async ({ page, context }) => {
  const response = await page.goto("/administration");
  await expect(page).toHaveURL(/\/administration\/connexion$/);
  expect(response?.headers()["cache-control"]).toContain("no-store");
  expect(response?.headers()["content-security-policy"]).toContain("script-src 'none'");
  await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute("href", "/administration/assets/editorial.css");
  const css = await page.request.get("/administration/assets/editorial.css");
  expect(css.status()).toBe(200);
  expect(css.headers()["content-type"]).toContain("text/css");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
  const csrf = await page.request.post("/administration/connexion", { form: { email: "writer@example.test", password: "invalid" } });
  expect(csrf.status()).toBe(419);
  const foreign = await page.request.post("/administration/connexion", { headers: { Origin: "https://foreign.example" }, form: {} });
  expect(foreign.status()).toBe(403);
  await login(page, "writer");
  expect((await context.cookies()).some(cookie => cookie.name === "kidora_editorial_test" && cookie.httpOnly && cookie.sameSite === "Lax")).toBe(true);
  await logout(page);
  await page.goto("/administration/articles/nouveau");
  await expect(page).toHaveURL(/\/connexion$/);
});
test("rédiger, faire valider, publier et ouvrir la fiche publique", async ({ page }, testInfo) => {
  const slug = "ocean-browser-" + testInfo.project.name;
  await login(page, "writer");
  await page.getByRole("link", { name: "Nouvelle fiche", exact: true }).click();
  await page.getByLabel("Adresse de la fiche").fill(slug);
  await page.getByLabel("Titre", { exact: true }).fill("Les océans — test éditorial");
  await page.getByLabel("Résumé", { exact: true }).fill("Découvrons la vie dans les océans.");
  await page.locator("#block-title-0").fill("Des milieux vivants");
  await page.locator("#block-body-0").fill("Les océans abritent de nombreuses espèces.");
  await page.locator("#source-label-0").fill("UNESCO");
  await page.locator("#source-url-0").fill("https://www.unesco.org/");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Enregistrer le brouillon" }).click();
  await expect(page.getByRole("heading", { name: "Les océans — test éditorial", exact: true })).toBeVisible();
  const revisionPath = new URL(page.url()).pathname;
  await page.getByRole("button", { name: "Soumettre à la validation" }).click();
  await expect(page.getByText("VERSION 1 · En validation", { exact: true })).toBeVisible();
  await logout(page);
  await login(page, "reviewer");
  await page.goto(revisionPath);
  await page.getByRole("button", { name: "Valider le contenu" }).click();
  await expect(page.getByRole("button", { name: "Publier cette version" })).toHaveCount(0);
  await logout(page);
  await login(page, "editor");
  await page.goto(revisionPath);
  await page.getByRole("button", { name: "Publier cette version" }).click();
  await expect(page.getByText("VERSION 1 · Publiée", { exact: true })).toBeVisible();
  await page.goto("/fiches/" + slug);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Les océans — test éditorial");
  await expect(page.getByText("Les océans abritent de nombreuses espèces.")).toBeVisible();
});
