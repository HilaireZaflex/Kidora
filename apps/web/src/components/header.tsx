import { MobileMenu } from "./mobile-menu";
import { Arrow } from "@/components/icons";
import Link from "next/link";
import { brand } from "@/config/brand";
export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label={`${brand.name}, accueil`}
        >
          <span className="logo-mark" aria-hidden="true">
            ✳
          </span>
          {brand.name}
          <span className="logo-dot">.</span>
        </Link>
        <nav aria-label="Navigation principale">
          <Link href="/#univers">Les univers</Link>
          <Link href="/#decouverte">La découverte du jour</Link>
          <Link href="/geoworld">Le globe</Link>
          <Link href="/jeux">Les jeux</Link>
        </nav>
        <MobileMenu />
        <Link
          className="header-search"
          href="/recherche"
          aria-label="Rechercher"
        >
          <span aria-hidden="true">⌕</span>
          <span>Rechercher</span>
        </Link>
        <Link href="/a-propos" className="parent-link">
          Côté parents{" "}
          <span aria-hidden="true">
            <Arrow />
          </span>
        </Link>
      </div>
    </header>
  );
}
