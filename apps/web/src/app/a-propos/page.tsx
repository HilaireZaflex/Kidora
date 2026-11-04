import { brand } from "@/config/brand";
export const metadata = { title: "Le projet et les parents" };
export default function AboutPage() {
  return (
    <main id="contenu" className="shell inner-page prose-page">
      <span className="eyebrow">LA CURIOSITÉ EN CONFIANCE</span>
      <h1>Bienvenue dans {brand.name}.</h1>
      <p className="lead">
        Une encyclopédie éducative en construction, imaginée pour les enfants de
        6 à 12 ans, au Mali et au-delà.
      </p>
      <h2>Ce que vous pouvez essayer</h2>
      <p>
        Explorer les quinze univers, lire les premières fiches de démonstration
        et jouer au quiz du système solaire. Les textes sont accompagnés de
        références. Ils attendent une validation éditoriale avant une
        publication commerciale.
      </p>
      <h2>Un espace public, sans compte enfant</h2>
      <p>
        Cette version ne demande ni nom, ni adresse, ni position géographique.
        Elle ne propose aucun profil public, aucune messagerie et aucune
        publicité. Les réponses au quiz sont traitées pour afficher une
        correction ; elles ne sont pas liées à un enfant ni conservées dans un
        carnet.
      </p>
      <h2>Ce qui reste à construire</h2>
      <p>
        Gestion parentale, profils d’âge, consentements, progression, favoris et
        suppression/export des données : à venir. Aucun compte parent ne peut
        encore être créé. Kiro propose des chemins prédéfinis ; il ne répond pas
        comme une intelligence artificielle.
      </p>
      <h2>Illustrations et ressources</h2>
      <p>
        Les illustrations vectorielles ont été créées pour cette démonstration.
        Le globe de l’accueil est une planète décorative imaginaire, pas une
        carte géographique. Le module GeoWorld avec données géographiques
        documentées reste à venir.
      </p>
    </main>
  );
}
