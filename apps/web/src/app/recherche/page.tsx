import { articles } from "@/lib/catalog";
import { ArticleCard } from "@/components/catalog-cards";
export const dynamic = "force-dynamic";
export const metadata = { title: "La bibliothèque" };
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.slice(0, 100).trim() : "";
  const result = await articles(q);
  return (
    <main id="contenu" className="shell inner-page">
      <span className="eyebrow">SUIS LE FIL DE TA CURIOSITÉ</span>
      <h1>Que veux-tu découvrir ?</h1>
      <p className="lead">Un animal, une planète, un grand pourquoi…</p>
      <form action="/recherche" className="search-form" role="search">
        <label className="sr-only" htmlFor="q">
          Rechercher dans la bibliothèque
        </label>
        <input
          id="q"
          name="q"
          type="search"
          maxLength={100}
          defaultValue={q}
          placeholder="Essaie « planète », « éléphant » ou « Mali »…"
        />
        <button className="button" type="submit">
          Rechercher <span aria-hidden="true">⌕</span>
        </button>
      </form>
      <p role="status">
        {result.data.length} découverte{result.data.length > 1 ? "s" : ""}
        {q ? ` pour « ${q} »` : " à explorer"} · Contenus de démonstration
      </p>
      <section className="section compact">
        <div className="article-grid">
          {result.data.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
        {!result.data.length && (
          <div className="empty-state">
            <h2>Pas encore de découverte sur ce sujet</h2>
            <p>
              Essaie un mot plus court, ou une autre curiosité. Le catalogue
              grandit petit à petit.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
