import { Arrow } from "@/components/icons";
import Link from "next/link";
export default function NotFound() {
  return (
    <main id="contenu" className="shell inner-page empty-state">
      <span className="eyebrow">PETIT DÉTOUR</span>
      <h1>Cette découverte est introuvable.</h1>
      <p>Retrouvons un chemin vers les univers disponibles.</p>
      <Link className="button" href="/">
        Revenir à l’accueil <Arrow />
      </Link>
    </main>
  );
}
