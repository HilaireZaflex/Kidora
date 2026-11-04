"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="contenu" className="shell inner-page empty-state">
      <h1>Petite pause dans l’exploration.</h1>
      <p>
        Le catalogue est momentanément indisponible. Réessaie dans quelques
        instants.
      </p>
      <button className="button" onClick={reset}>
        Réessayer
      </button>
    </main>
  );
}
