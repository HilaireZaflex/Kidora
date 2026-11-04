import { Arrow } from "@/components/icons";
import Link from "next/link";
import { brand } from "@/config/brand";
import { universes, articles } from "@/lib/catalog";
import { AdventureArt, UniverseArt } from "@/components/art";
import { UniverseCard, ArticleCard } from "@/components/catalog-cards";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [catalog, library] = await Promise.all([universes(), articles()]);
  const discovery =
    library.data.find((a) => a.slug === "les-secrets-des-elephants") ??
    library.data[0];
  const quizArticle = library.data.find((a) => a.slug === "le-systeme-solaire");
  return (
    <main id="contenu">
      <section className="hero shell">
        <div className="hero-copy">
          <span className="eyebrow pill">
            <span className="live-dot" /> POUR LES PETITS ET GRANDS CURIEUX
          </span>
          <h1>
            Explore.
            <br />
            Découvre.
            <br />
            <span className="underlined">Apprends.</span>
          </h1>
          <p>
            {brand.description}
            <br />
            Suis ta curiosité, l’aventure commence ici.
          </p>
          <Link className="button" href="#univers">
            C’est parti, j’explore !{" "}
            <span aria-hidden="true">
              <Arrow />
            </span>
          </Link>
          <div className="hero-note">
            <span aria-hidden="true">✧</span> De 6 à 12 ans · À chacun ses
            découvertes
          </div>
        </div>
        <div className="hero-scene">
          <AdventureArt />
          <div className="floating-label label-top">
            <span aria-hidden="true">✦</span> Et si on découvrait le monde ?
          </div>
          <div className="floating-label label-bottom">
            <span className="tiny-robot" aria-hidden="true">
              ⌁
            </span>
            <div>
              <strong>Salut, moi c’est Kiro !</strong>
              <span>Ton compagnon d’exploration</span>
            </div>
          </div>
        </div>
      </section>
      <div className="values-strip">
        <div className="shell">
          <span>
            <i aria-hidden="true">◎</i> Un monde à explorer
          </span>
          <span>
            <i aria-hidden="true">✧</i> Apprendre en s’amusant
          </span>
          <span>
            <i aria-hidden="true">♡</i> Grandir en confiance
          </span>
          <span className="demo-label">VERSION DÉCOUVERTE · CONTENUS DÉMO</span>
        </div>
      </div>
      <section className="shell section" id="univers">
        <div className="section-heading">
          <div>
            <span className="eyebrow">À CHAQUE CURIOSITÉ, SON AVENTURE</span>
            <h2>Quel monde vas-tu explorer ?</h2>
          </div>
          <span className="count-tag">
            {catalog.data.length} univers, tant de questions !
          </span>
        </div>
        <div className="universe-grid">
          {catalog.data.map((u, index) => (
            <UniverseCard key={u.id} universe={u} index={index} />
          ))}
        </div>
        <p className="section-note">
          Chaque univers s’agrandit petit à petit. Les fiches disponibles sont
          signalées à l’intérieur.
        </p>
      </section>
      {discovery && (
        <section className="shell discovery-panel" id="decouverte">
          <div className="discovery-art">
            <span className="sketch-star" aria-hidden="true">
              ✳
            </span>
            <UniverseArt
              icon={discovery.illustration}
              color={discovery.universe.color}
            />
            <span className="art-caption">LES MERVEILLES D’ANIMALIA</span>
          </div>
          <div className="discovery-copy">
            <span className="eyebrow">
              LA DÉCOUVERTE DU JOUR · SÉLECTION DÉMO
            </span>
            <h2>
              Une trompe.
              <br />
              Mille super-pouvoirs.
            </h2>
            <p>
              Sais-tu que la trompe de l’éléphant lui sert à respirer, sentir,
              boire et saisir des objets ? Partons à la rencontre de ce géant
              étonnant.
            </p>
            <Link href={`/fiches/${discovery.slug}`} className="button">
              Découvrir ses secrets{" "}
              <span aria-hidden="true">
                <Arrow />
              </span>
            </Link>
            <span className="read-note">
              Une fiche à lire en {discovery.reading_minutes} minutes
            </span>
          </div>
        </section>
      )}
      <section className="shell section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">UNE QUESTION EN CACHE UNE AUTRE</span>
            <h2>Le plein de découvertes</h2>
          </div>
          <Link href="/recherche" className="text-link">
            Toute la bibliothèque <Arrow />
          </Link>
        </div>
        <div className="article-grid">
          {library.data.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>
      <section className="shell bottom-grid">
        <div className="play-panel">
          <span className="eyebrow">À TOI DE JOUER</span>
          <h2>
            Petites questions,
            <br />
            grandes découvertes.
          </h2>
          <p>
            Teste ce que tu as appris avec un quiz.
            <br />
            Ici, chaque réponse aide à comprendre.
          </p>
          {quizArticle ? (
            <Link
              href={`/fiches/${quizArticle.slug}#quiz`}
              className="button light"
            >
              Le défi de l’espace{" "}
              <span aria-hidden="true">
                <Arrow />
              </span>
            </Link>
          ) : (
            <Link href="/jeux" className="button light">
              Découvrir les jeux <Arrow />
            </Link>
          )}
          <div className="play-orbit" aria-hidden="true">
            ?
          </div>
        </div>
        <div className="kiro-panel">
          <span className="kiro-face" aria-hidden="true">
            <span>• ◡ •</span>
          </span>
          <span className="eyebrow">UN PETIT COUP DE POUCE ?</span>
          <h2>
            La curiosité,
            <br />
            ça se partage !
          </h2>
          <p>
            Je suis Kiro. Je te propose de commencer par les étoiles, les
            animaux ou notre planète.
          </p>
          <Link href="/recherche" className="text-link">
            Trouver ma prochaine découverte <Arrow />
          </Link>
          <small>Kiro te guide vers des fiches. Ce n’est pas une IA.</small>
        </div>
      </section>
      <section className="shell coming-soon">
        <span aria-hidden="true">✦</span>
        <p>
          <strong>L’aventure ne fait que commencer.</strong> Globe interactif,
          carnet personnel, vidéos et espace parent : à venir.
        </p>
        <Link href="/a-propos">
          Découvrir le projet <Arrow />
        </Link>
      </section>
    </main>
  );
}
