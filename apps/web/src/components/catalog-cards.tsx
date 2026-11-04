import { Arrow } from "@/components/icons";
import Link from "next/link";
import type { ArticleSummary, Universe } from "@/lib/catalog";
import { UniverseArt } from "./art";
export function UniverseCard({
  universe: u,
  index,
}: {
  universe: Universe;
  index: number;
}) {
  return (
    <Link
      href={`/univers/${u.slug}`}
      className="universe-card"
      style={{ "--card-color": u.color } as React.CSSProperties}
    >
      <div className="universe-visual">
        <span className="universe-number">
          {String(index + 1).padStart(2, "0")}
        </span>
        <UniverseArt icon={u.icon} color={u.color} />
        <span className="card-arrow">
          <Arrow />
        </span>
      </div>
      <div className="universe-caption">
        <h3>{u.name}</h3>
        <p>{u.theme}</p>
      </div>
    </Link>
  );
}
export function ArticleCard({ article: a }: { article: ArticleSummary }) {
  return (
    <Link className="article-card" href={`/fiches/${a.slug}`}>
      <div
        className="article-art"
        style={{ backgroundColor: `${a.universe.color}15` }}
      >
        <UniverseArt icon={a.illustration} color={a.universe.color} />
      </div>
      <div className="article-caption">
        <span className="eyebrow">
          {a.universe.name} · {a.reading_minutes} min
        </span>
        <h3>{a.title}</h3>
        <p>{a.summary}</p>
        <span className="text-link">
          Partir à la découverte{" "}
          <span aria-hidden="true">
            <Arrow />
          </span>
        </span>
      </div>
    </Link>
  );
}
