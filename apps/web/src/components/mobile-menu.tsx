"use client";
import Link from "next/link";
import { useRef } from "react";
export function MobileMenu() {
  const details = useRef<HTMLDetailsElement>(null);
  return (
    <details className="mobile-menu" ref={details}>
      <summary aria-label="Menu de navigation">
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
        <span>Menu</span>
      </summary>
      <nav
        aria-label="Navigation mobile"
        onClick={() => details.current?.removeAttribute("open")}
      >
        <Link href="/#univers">Les univers</Link>
        <Link href="/#decouverte">La découverte du jour</Link>
        <Link href="/jeux">Les jeux</Link>
        <Link href="/a-propos">Côté parents</Link>
      </nav>
    </details>
  );
}
