import { feature } from "topojson-client";
import { geoContains } from "d3-geo";
import type { Feature, MultiPolygon, Polygon } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
export type Country = Feature<Polygon | MultiPolygon, { name: string }> & {
  id: string;
  label: string;
  code: string | null;
};
export type CountryLabel = { id: string; name: string; code: string | null };
export type WorldTopology = Topology<{
  countries: GeometryCollection<{ name: string }>;
}>;
export type GeographyArticle = {
  country_code: string | null;
  title: string;
  slug: string;
};
export function decodeCountries(
  topology: WorldTopology,
  labels: CountryLabel[],
): Country[] {
  const geometries = feature(topology, topology.objects.countries).features;
  return geometries.flatMap((item, index) => {
    if (
      item.geometry.type !== "Polygon" &&
      item.geometry.type !== "MultiPolygon"
    )
      return [];
    const id =
      item.id === undefined ? `natural-earth-${index}` : String(item.id);
    const label = labels.find((entry) => entry.id === id);
    if (!label)
      throw new Error(
        "Nomenclature géographique incompatible avec les frontières.",
      );
    return [
      {
        ...item,
        geometry: item.geometry,
        id,
        label: label.name,
        code: label.code,
      } as Country,
    ];
  });
}
export function findCountry(
  countries: Country[],
  longitude: number,
  latitude: number,
): Country | null {
  return (
    countries.find((country) => geoContains(country, [longitude, latitude])) ??
    null
  );
}
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim();
}
export function countryFromUv(
  countries: Country[],
  u: number,
  v: number,
): Country | null {
  return findCountry(countries, u * 360 - 180, v * 180 - 90);
}
