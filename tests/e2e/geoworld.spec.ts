import { test, expect } from "@playwright/test";

test("GeoWorld charge ses données uniquement sur son parcours", async ({
  page,
}) => {
  const geographyRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/geography/"))
      geographyRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator(".universe-card")).toHaveCount(15);
  expect(geographyRequests).toHaveLength(0);
  await page.goto("/geoworld");
  await expect(page.getByTestId("selected-country")).toHaveText("Mali");
  await expect(page.locator(".world-map .country-shape")).toHaveCount(177);
  await expect(page.locator(".globe-canvas")).toHaveCount(0);
  expect(
    geographyRequests.some((url) => url.endsWith("countries-110m.json")),
  ).toBe(true);
});

test("recherche de pays, sélection 2D et fiche géographique publiée", async ({
  page,
}) => {
  await page.goto("/geoworld");
  await expect(page.getByTestId("selected-country")).toHaveText("Mali");
  await page.getByLabel(/où veux-tu aller/i).fill("Japon");
  await page.getByLabel(/Pays ou territoire/).selectOption({ label: "Japon" });
  await expect(page.getByTestId("selected-country")).toHaveText("Japon");
  await expect(
    page.getByText(/La fiche de cette destination est à venir/),
  ).toBeVisible();
  await page.locator('[data-country-code="MLI"]').click();
  await expect(page.getByTestId("selected-country")).toHaveText("Mali");
  await page
    .getByRole("link", { name: /Lire la fiche : Bonjour, le Mali/ })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Bonjour, le Mali !",
  );
});

test("la recherche gère accents, absence de résultat et clavier", async ({
  page,
}) => {
  await page.goto("/geoworld");
  await expect(page.getByTestId("selected-country")).toHaveText("Mali");
  await page.getByLabel(/où veux-tu aller/i).fill("bresil");
  await page.getByLabel(/Pays ou territoire/).selectOption({ label: "Brésil" });
  await expect(page.getByTestId("selected-country")).toHaveText("Brésil");
  await page.getByLabel(/où veux-tu aller/i).fill("paysintrouvablexyz");
  await expect(page.getByText(/Aucun résultat/)).toBeVisible();
  await page.getByLabel(/où veux-tu aller/i).fill("Mali");
  await page.getByLabel(/Pays ou territoire/).focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByTestId("selected-country")).toHaveText("Mali");
});

test("la carte reste utilisable lorsque WebGL est indisponible", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (type === "webgl" || type === "webgl2") return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/geoworld");
  await expect(page.getByTestId("selected-country")).toHaveText("Mali");
  await page.getByRole("button", { name: "Ouvrir le globe 3D" }).click();
  await expect(page.getByText(/La 3D n’est pas disponible/)).toBeVisible();
  await expect(page.locator(".world-map")).toBeVisible();
  await expect(page.locator(".globe-canvas")).toHaveCount(0);
});

test("globe 3D manipulable, zoom et retour à la carte", async ({ page }) => {
  await page.goto("/geoworld");
  await expect(page.getByTestId("selected-country")).toHaveText("Mali");
  await page.getByRole("button", { name: "Ouvrir le globe 3D" }).click();
  const canvas = page.locator(".globe-canvas canvas");
  await expect(canvas).toBeVisible({ timeout: 20000 });
  const initialPixels = await canvas.screenshot();
  await page.getByRole("button", { name: "Zoom avant", exact: true }).click();
  const zoomedPixels = await canvas.screenshot();
  expect(initialPixels.equals(zoomedPixels)).toBe(false);
  await page.getByRole("button", { name: "Zoom arrière", exact: true }).click();
  const beforeRotation = await canvas.screenshot();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Le globe n’a pas de surface affichable.");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 60,
    box.y + box.height / 2 + 20,
    { steps: 6 },
  );
  await page.mouse.up();
  const rotatedPixels = await canvas.screenshot();
  expect(rotatedPixels.equals(beforeRotation)).toBe(false);
  await page.getByRole("button", { name: "Recentrer", exact: true }).click();
  await canvas.click();
  await expect(page.getByTestId("selected-country")).toHaveText("Burkina Faso");
  await page.getByRole("button", { name: "Carte 2D · mode léger" }).click();
  await expect(page.locator(".world-map")).toBeVisible();
  await expect(page.locator(".globe-canvas")).toHaveCount(0);
});

test("GeoWorld ne déborde pas et respecte les contrôles d’accessibilité", async ({
  page,
}) => {
  await page.goto("/geoworld");
  await expect(page.getByTestId("selected-country")).toHaveText("Mali");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize()!.width);
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
