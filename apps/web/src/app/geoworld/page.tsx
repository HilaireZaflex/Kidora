import Link from "next/link";
import { GeoExplorer } from "@/components/geoworld/explorer";
import { api, type ArticleSummary } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export const metadata = { title: "GeoWorld — Explore la Terre" };
export default async function GeoWorldPage() {
  const result = await api<{ articles: ArticleSummary[] }>(
    "/universes/geoworld",
  );
  return (
    <main id="contenu" className="shell inner-page geo-page">
      <Link href="/univers/geoworld" className="breadcrumb">
        ← Les découvertes de GeoWorld
      </Link>
      <span className="eyebrow">UNE PLANÈTE, MILLE CURIOSITÉS</span>
      <h1>Le monde est à toi.</h1>
      <p className="lead">
        Pars à la rencontre des pays. Tourne la Terre, suis les frontières et
        choisis ta prochaine découverte.
      </p>
      <GeoExplorer
        articles={result.articles.map((article) => ({
          country_code: article.country_code,
          title: article.title,
          slug: article.slug,
        }))}
      />
      <section className="geo-sources">
        <h2>Une carte, pas une frontière officielle</h2>
        <p>
          Frontières simplifiées de Natural Earth (édition 4.1.0, échelle 1:110
          millions), redistribuées par world-atlas 2.0.2. Ce jeu représente 177
          zones ; de petites îles et certains territoires peuvent être absents.
          Les tracés et les noms ne constituent pas une prise de position sur
          les frontières ou les statuts politiques.
        </p>
        <p>
          Les noms français et codes ISO proviennent de i18n-iso-countries.
          Aucun chiffre de population, capitale ou coordonnée n’est inventé.
        </p>
        <a href="/geography/README.txt" className="text-link">
          Provenance et licences des données
        </a>
      </section>
    </main>
  );
}
