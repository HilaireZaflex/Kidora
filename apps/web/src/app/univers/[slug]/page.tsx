import { Arrow } from "@/components/icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  api,
  universes,
  type ArticleSummary,
  type Universe,
} from "@/lib/catalog";
import { UniverseArt } from "@/components/art";
import { ArticleCard } from "@/components/catalog-cards";
export const dynamic = "force-dynamic";
export default async function UniversePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = await universes();
  if (!catalog.data.some((u) => u.slug === slug)) notFound();
  const { data: u, articles } = await api<{
    data: Universe;
    articles: ArticleSummary[];
  }>(`/universes/${encodeURIComponent(slug)}`);
  return (
    <main id="contenu" className="shell inner-page">
      <Link href="/#univers" className="breadcrumb">
        ← Tous les univers
      </Link>
      <section
        className="universe-hero"
        style={{ backgroundColor: `${u.color}15` }}
      >
        <div>
          <span className="eyebrow">UN UNIVERS À EXPLORER · {u.theme}</span>
          <h1>{u.name}</h1>
          <p>{u.description}</p>
          <span className="pill">
            {articles.length} fiche{articles.length > 1 ? "s" : ""} disponible
            {articles.length > 1 ? "s" : ""}
          </span>
        </div>
        <UniverseArt icon={u.icon} color={u.color} />
      </section>
      {u.slug === "geoworld" && (
        <div className="geo-entry">
          <p>
            <strong>Et si tu explorais la Terre ?</strong>
            <br />
            Choisis un pays sur la carte ou fais tourner le globe 3D.
          </p>
          <Link className="button" href="/geoworld">
            Explorer la Terre
          </Link>
        </div>
      )}
      <section className="section">
        <div className="section-heading">
          <h2>Ta prochaine découverte</h2>
          <span className="demo-label">FICHES DE DÉMONSTRATION</span>
        </div>
        {articles.length ? (
          <div className="article-grid">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">✧</span>
            <h3>Cet univers se prépare !</h3>
            <p>
              Ses premières fiches sont à venir. En attendant, d’autres mondes
              t’attendent.
            </p>
            <Link className="button" href="/recherche">
              Explorer les fiches disponibles <Arrow />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
