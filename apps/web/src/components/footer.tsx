import { Arrow } from "@/components/icons";
import Link from "next/link";
import { brand } from "@/config/brand";
export function Footer() {
  return (
    <footer className="site-footer shell">
      <div>
        <Link href="/" className="wordmark">
          ✳ {brand.name}.
        </Link>
        <p>La curiosité est le début d’une grande aventure.</p>
      </div>
      <div>
        <Link href="/a-propos">
          Notre projet & confidentialité <Arrow />
        </Link>
        <p>Version de démonstration · Créé pour les esprits curieux.</p>
      </div>
    </footer>
  );
}
