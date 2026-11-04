import { Arrow } from "@/components/icons";
import Link from "next/link";
export const metadata = { title: "Les jeux" };
export default function GamesPage() {
  return (
    <main id="contenu" className="shell inner-page">
      <span className="eyebrow">APPRENDRE EN S’AMUSANT</span>
      <h1>À toi de jouer !</h1>
      <section className="play-panel standalone">
        <span className="pill">QUIZ DISPONIBLE · DÉMO</span>
        <h2>Le défi de l’espace</h2>
        <p>
          Lis la fiche du système solaire, puis réponds à trois questions. Une
          explication accompagne chaque réponse.
        </p>
        <Link className="button light" href="/fiches/le-systeme-solaire#quiz">
          Commencer le quiz <Arrow />
        </Link>
      </section>
      <section className="section">
        <h2>De nouvelles aventures se préparent</h2>
        <p>
          Memory des animaux, capitales et drapeaux : à venir. Aucun classement,
          aucune course contre les autres.
        </p>
      </section>
    </main>
  );
}
