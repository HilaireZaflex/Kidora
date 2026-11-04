import { readFileSync, writeFileSync } from "node:fs";
import countries from "i18n-iso-countries";
import french from "i18n-iso-countries/langs/fr.json" with { type: "json" };
countries.registerLocale(french);
const folder = new URL("../public/geography/", import.meta.url);
const topology = JSON.parse(readFileSync(new URL("countries-110m.json", folder)));
const labels = topology.objects.countries.geometries.map((geometry, index) => {
  const code = geometry.id ? countries.numericToAlpha3(String(geometry.id)) : undefined;
  return { id: geometry.id ? String(geometry.id) : `natural-earth-${index}`, name: code ? countries.getName(code, "fr") ?? geometry.properties.name : geometry.properties.name, code: code ?? null };
});
writeFileSync(new URL("country-names-fr.json", folder), JSON.stringify(labels, null, 2) + "\n");
console.log(`${labels.length} entités cartographiques ; noms français issus de i18n-iso-countries.`);
