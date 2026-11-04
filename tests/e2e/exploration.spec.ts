import { test, expect } from "@playwright/test";
test("explorer un univers et lire une fiche sourcée", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Explore.Découvre.Apprends.",
  );
  await expect(page.locator(".universe-card")).toHaveCount(15);
  await page.locator(".universe-card").filter({ hasText: "Animalia" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Animalia");
  await page.getByRole("link", { name: /Les secrets des éléphants/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Les secrets des éléphants",
  );
  await expect(
    page.getByText("Fiche de démonstration", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /WWF/ })).toHaveAttribute(
    "href",
    "https://www.worldwildlife.org/species/african-elephant",
  );
  expect(errors).toEqual([]);
});
test("recherche et état sans résultat", async ({ page }) => {
  await page.goto("/recherche");
  await page.getByRole("searchbox").fill("Mali");
  await page.getByRole("button", { name: "Rechercher" }).click();
  await expect(page.locator(".article-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Bonjour, le Mali !" }),
  ).toBeVisible();
  await page.getByRole("searchbox").fill("xyzaucunresultat");
  await page.getByRole("button", { name: "Rechercher" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Pas encore de découverte sur ce sujet",
    }),
  ).toBeVisible();
});
test("quiz : correction serveur, erreurs expliquées et nouvelle tentative", async ({
  page,
}) => {
  await page.goto("/fiches/le-systeme-solaire#quiz");
  const form = page.locator(".quiz");
  await expect(
    form.getByRole("button", { name: "Découvrir mes résultats" }),
  ).toBeDisabled();
  await form.getByRole("radio", { name: "Une planète", exact: true }).check();
  await form.getByRole("radio", { name: "Huit", exact: true }).check();
  await form.getByRole("radio", { name: "La Terre", exact: true }).check();
  await form.getByRole("button", { name: "Découvrir mes résultats" }).click();
  await expect(
    form.getByRole("heading", { name: "2 / 3 réponses justes" }),
  ).toBeVisible();
  await expect(form.getByText(/Le Soleil est une étoile :/)).toBeVisible();
  await form.getByRole("button", { name: "Rejouer" }).click();
  await form.getByRole("radio", { name: "Une étoile", exact: true }).check();
  await form.getByRole("radio", { name: "Huit", exact: true }).check();
  await form.getByRole("radio", { name: "La Terre", exact: true }).check();
  await form.getByRole("button", { name: "Découvrir mes résultats" }).click();
  await expect(
    form.getByRole("heading", { name: "3 / 3 réponses justes" }),
  ).toBeVisible();
});
test("univers en préparation et vraie page introuvable", async ({ page }) => {
  await page.goto("/univers/scientia");
  await expect(
    page.getByRole("heading", { name: "Cet univers se prépare !" }),
  ).toBeVisible();
  const response = await page.goto("/fiches/inexistante");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Cette découverte est introuvable." }),
  ).toBeVisible();
});
test("accueil sans débordement, lien clavier et capture", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const viewportWidth = page.viewportSize()!.width;
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(viewportWidth);
  expect(await page.evaluate(() => window.innerWidth)).toBeLessThanOrEqual(
    viewportWidth,
  );
  await page.screenshot({
    path: `/tmp/kidora-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Aller au contenu" }),
  ).toBeFocused();
});

test("accessibilité de l’accueil et d’une fiche", async ({ page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const path of ["/", "/fiches/le-systeme-solaire"]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});

test("le proxy de quiz refuse une origine étrangère", async ({ request }) => {
  const response = await request.post("/api/quiz/1", {
    headers: { Origin: "https://example.invalid" },
    data: { answers: [] },
  });
  expect(response.status()).toBe(403);
});

test("la navigation donne accès aux jeux sur chaque format", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile") {
    await page.getByText("Menu", { exact: true }).click();
    await page
      .getByRole("navigation", { name: "Navigation mobile" })
      .getByRole("link", { name: "Les jeux", exact: true })
      .click();
    await expect(page.locator(".mobile-menu")).not.toHaveAttribute("open");
  } else {
    await page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: "Les jeux", exact: true })
      .click();
  }
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "À toi de jouer !",
  );
});
