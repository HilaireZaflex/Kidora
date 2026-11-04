"use client";
import { geoEqualEarth, geoPath } from "d3-geo";
import { useMemo } from "react";
import type { Country } from "@/lib/geography/model";
export default function WorldMap({
  countries,
  selected,
  onSelect,
}: {
  countries: Country[];
  selected: string | null;
  onSelect: (country: Country | null) => void;
}) {
  const path = useMemo(
    () =>
      geoPath(
        geoEqualEarth().fitExtent(
          [
            [14, 14],
            [886, 466],
          ],
          { type: "Sphere" },
        ),
      ),
    [],
  );
  return (
    <svg
      viewBox="0 0 900 480"
      className="world-map"
      role="img"
      aria-label="Carte du monde. Utilise la liste des pays pour une sélection au clavier."
    >
      <path
        d={path({ type: "Sphere" }) ?? ""}
        fill="#dbeceb"
        stroke="#93b6b2"
      />
      {countries.map((country) => (
        <path
          key={country.id}
          d={path(country) ?? ""}
          className="country-shape"
          data-country-code={country.code ?? undefined}
          fill={selected === country.id ? "#e5a552" : "#80ae91"}
          stroke="#fcfbf7"
          strokeWidth=".6"
          onClick={() => onSelect(country)}
        >
          <title>{country.label}</title>
        </path>
      ))}
    </svg>
  );
}
