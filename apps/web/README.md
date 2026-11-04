# Interface publique KIDORA

Next.js App Router, React, TypeScript strict, Tailwind CSS. Voir le [guide d’installation](../../README.md) et le [contrat API](../../docs/openapi.yaml).

`npm run dev` depuis ce dossier démarre le frontend. L’API Laravel doit être disponible ; `API_URL` est une variable serveur. Les quiz passent par un Route Handler de même origine pour éviter d’exposer une URL interne au navigateur.

Le nom et le slogan vivent dans `src/config/brand.ts`. Les univers et fiches sont fournis par l’API, sans catalogue de secours silencieux. Une panne API affiche une erreur explicite.

Webpack/PostCSS sont utilisés car Turbopack ne peut pas créer ses communications internes dans l’environnement cloud actuel. Ne pas charger de police distante ni de moteur 3D sur l’accueil.
