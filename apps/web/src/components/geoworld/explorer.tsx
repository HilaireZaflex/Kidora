"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useState, type ReactNode } from "react";
import WorldMap from "./world-map";
import {
  decodeCountries,
  normalizeSearch,
  type Country,
  type CountryLabel,
  type GeographyArticle,
  type WorldTopology,
} from "@/lib/geography/model";
const Globe = dynamic(() => import("./world-globe"), {
  ssr: false,
  loading: () => (
    <p className="geo-loading" role="status">
      Préparation du globe 3D…
    </p>
  ),
});
class GlobeBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export function GeoExplorer({ articles }: { articles: GeographyArticle[] }) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>("466");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"map" | "globe">("map");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [globeError, setGlobeError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch("/geography/countries-110m.json", { signal: controller.signal }),
      fetch("/geography/country-names-fr.json", { signal: controller.signal }),
    ])
      .then(async ([geometry, names]) => {
        if (!geometry.ok || !names.ok)
          throw new Error("Données cartographiques indisponibles");
        return [
          (await geometry.json()) as WorldTopology,
          (await names.json()) as CountryLabel[],
        ] as const;
      })
      .then(([topology, names]) => {
        setCountries(decodeCountries(topology, names));
        setError("");
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setError(
            e instanceof Error ? e.message : "Impossible de charger la carte.",
          );
      });
    return () => controller.abort();
  }, [attempt]);
  const selected =
    countries.find((country) => country.id === selectedId) ?? null;
  const filtered = countries
    .filter(
      (country) =>
        normalizeSearch(country.label).includes(normalizeSearch(query)) ||
        country.code?.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  const published = selected?.code
    ? articles.find((article) => article.country_code === selected.code)
    : undefined;
  const select = (country: Country | null) => {
    setSelectedId(country?.id ?? null);
  };
  function openGlobe() {
    // Test support before loading the 3D engine; the real map stays usable on low-end devices.
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    if (!context) {
      setGlobeError(
        "La 3D n’est pas disponible sur cet appareil. Tu peux continuer avec la carte 2D.",
      );
      return;
    }
    context.getExtension("WEBGL_lose_context")?.loseContext();
    setGlobeError("");
    setMode("globe");
  }
  if (error)
    return (
      <div className="empty-state" role="alert">
        <h2>La carte fait une petite pause.</h2>
        <p>{error}</p>
        <button
          className="button"
          onClick={() => {
            setError("");
            setAttempt((value) => value + 1);
          }}
        >
          Réessayer
        </button>
      </div>
    );
  if (!countries.length)
    return (
      <div className="geo-loading" role="status">
        Chargement des frontières et des pays…
      </div>
    );
  const map = (
    <WorldMap countries={countries} selected={selectedId} onSelect={select} />
  );
  return (
    <section className="geo-explorer" aria-label="Explorer la Terre">
      <div className="geo-stage">
        <div className="geo-toolbar">
          <span className="eyebrow">LA TERRE, UN MONDE À DÉCOUVRIR</span>
          <div
            className="geo-modes"
            role="group"
            aria-label="Mode d’exploration"
          >
            <button
              aria-pressed={mode === "map"}
              onClick={() => setMode("map")}
            >
              Carte 2D · mode léger
            </button>
            <button aria-pressed={mode === "globe"} onClick={openGlobe}>
              Ouvrir le globe 3D
            </button>
          </div>
        </div>
        {globeError && (
          <p className="geo-alert" role="status">
            {globeError}
          </p>
        )}
        {mode === "map" ? (
          map
        ) : (
          <GlobeBoundary
            fallback={
              <>
                <p className="geo-alert" role="status">
                  Le globe ne peut pas s’afficher. Voici la carte 2D pour
                  continuer.
                </p>
                {map}
              </>
            }
          >
            <Globe
              countries={countries}
              selected={selected}
              onSelect={select}
            />
          </GlobeBoundary>
        )}
        <p className="geo-hint">
          {mode === "map"
            ? "Clique sur une zone de la carte ou choisis un pays dans la liste."
            : "Fais glisser pour tourner, pince pour zoomer ou utilise les boutons. La liste fonctionne aussi au clavier."}
        </p>
      </div>
      <aside className="geo-sidebar">
        <label htmlFor="country-search" className="eyebrow">
          OÙ VEUX-TU ALLER ?
        </label>
        <input
          id="country-search"
          type="search"
          value={query}
          maxLength={100}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Un pays, par exemple Mali…"
        />
        <label htmlFor="country-options" className="geo-list-label">
          Pays ou territoire · {filtered.length} résultat
          {filtered.length > 1 ? "s" : ""}
        </label>
        <select
          id="country-options"
          size={6}
          value={
            filtered.some((country) => country.id === selectedId)
              ? (selectedId ?? "")
              : ""
          }
          onChange={(event) => {
            setSelectedId(event.target.value || null);
            setQuery("");
          }}
        >
          <option value="">Choisis une destination</option>
          {filtered.map((country) => (
            <option key={country.id} value={country.id}>
              {country.label}
            </option>
          ))}
        </select>
        {!filtered.length && (
          <p role="status">
            Aucun résultat. Certains petits territoires ne sont pas représentés
            à cette échelle.
          </p>
        )}
        <div className="country-details" aria-live="polite">
          {selected ? (
            <>
              <span className="eyebrow">TA DESTINATION</span>
              <h2 data-testid="selected-country">{selected.label}</h2>
              {selected.code ? (
                <p>
                  Code ISO : <strong>{selected.code}</strong>
                </p>
              ) : (
                <p>
                  Entité cartographique sans code ISO disponible dans ce jeu.
                </p>
              )}
              {published ? (
                <Link className="button" href={`/fiches/${published.slug}`}>
                  Lire la fiche : {published.title}
                </Link>
              ) : (
                <p className="country-coming">
                  La fiche de cette destination est à venir. Tu peux continuer à
                  explorer la carte.
                </p>
              )}
            </>
          ) : (
            <>
              <h2>Cap sur l’océan !</h2>
              <p>
                Ce point ne correspond pas à une zone terrestre représentée.
                Choisis un pays pour continuer.
              </p>
            </>
          )}
        </div>
      </aside>
    </section>
  );
}
