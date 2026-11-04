import { Arrow } from "@/components/icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiUrl, type Article } from "@/lib/catalog";
import { UniverseArt } from "@/components/art";
import { Quiz } from "@/components/quiz";
export const dynamic = "force-dynamic";
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await fetch(
    `${apiUrl()}/articles/${encodeURIComponent(slug)}`,
    { cache: "no-store", signal: AbortSignal.timeout(8000) },
  );
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Fiche indisponible");
  const { data: a } = (await response.json()) as { data: Article };
  return (
    <main id="contenu" className="shell inner-page article-page">
      <Link className="breadcrumb" href={`/univers/${a.universe.slug}`}>
        ← Explorer {a.universe.name}
      </Link>
      <div className="article-layout">
        <article>
          <header>
            <span className="eyebrow">
              {a.universe.theme} · {a.age_label} · {a.reading_minutes} MIN DE
              LECTURE
            </span>
            <h1>{a.title}</h1>
            <p className="lead">{a.summary}</p>
            {a.is_demo && (
              <p className="demo-notice">
                Fiche de démonstration · Texte à valider avant publication
                commerciale.
              </p>
            )}
          </header>
          <div
            className="article-illustration"
            style={{ background: `${a.universe.color}15` }}
          >
            <UniverseArt icon={a.illustration} color={a.universe.color} />
            <span>Illustration décorative</span>
          </div>
          <div className="article-blocks">
            {a.blocks.map((block, i) => (
              <section
                key={i}
                className={block.type === "fact" ? "fact-block" : "text-block"}
              >
                <h2>
                  {block.type === "fact" && <span aria-hidden="true">✦ </span>}
                  {block.title}
                </h2>
                <p>{block.body}</p>
              </section>
            ))}
          </div>
          <section className="sources">
            <h2>Pour en savoir plus</h2>
            <p>Les références pour poursuivre cette découverte :</p>
            <ul>
              {a.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.label} <Arrow />
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
          {a.quiz && <Quiz quiz={a.quiz} />}
        </article>
        <aside className="article-aside">
          <span className="eyebrow">LE COIN DE KIRO</span>
          <div className="kiro-face small" aria-hidden="true">
            <span>• ◡ •</span>
          </div>
          <h2>
            Prends le temps
            <br />
            de t’émerveiller.
          </h2>
          <p>
            Lis à ton rythme. Tu peux revenir sur une idée autant de fois que tu
            veux.
          </p>
          {a.quiz && (
            <Link href="#quiz" className="button">
              Essayer le quiz ↓
            </Link>
          )}
          <Link className="text-link" href="/recherche">
            Une autre découverte <Arrow />
          </Link>
        </aside>
      </div>
    </main>
  );
}
