# Architecture

Monorepo : `apps/web` (Next.js App Router, React, TypeScript strict, Tailwind), `apps/api` (Laravel REST), `docs`, `infra`. Monolithe modulaire : Catalogue, Géographie, Jeux, Editorial, Identité (futur), Progression (futur).

PostgreSQL est la source de vérité. Le frontend serveur appelle l’API via `API_URL`, jamais un accès direct à la base. Les interactions quiz sont locales à la page, sans profil enfant ni persistance personnelle dans cette tranche. Les données de catégories ne sont pas codées dans les composants : elles viennent du catalogue API.

API publique versionnée `/api/v1`. Projections explicites, pagination bornée, validation des paramètres. Le contrat est décrit dans `docs/openapi.yaml`. Modules futurs : Redis et queues, stockage S3, TanStack Query si cache client nécessaire, Motion pour transitions utiles, Rive/Lottie pour assets validés, R3F/Three chargé à la demande pour le globe. Ne pas installer de moteur 3D sur l’accueil.

Les services de développement sont Docker Compose pour PHP et PostgreSQL, Node pour Next.js. Secrets exclusivement côté serveur. Configuration de marque dans `apps/web/src/config/brand.ts`.

Pour la démo macOS, `compose.macos.yaml` fournit aussi le frontend Node dans Docker. Les lanceurs `.command` ciblent exclusivement un contexte Docker Desktop local et ouvrent le navigateur après les contrôles de disponibilité. Voir `macos/LIRE-MOI.md` et `macos/VALIDATION.md`.

GeoWorld : route `apps/web/src/app/geoworld`, composants `components/geoworld`, décodage partagé `lib/geography`. TopoJSON et nomenclature française sont servis localement depuis `public/geography`. D3-geo fournit Equal Earth, les centroïdes et les tests d’inclusion sphérique ; Three et React Three Fiber sont importés uniquement pour la vue 3D. Une texture de 1024×512 est générée localement ; rendu à la demande, DPR plafonné à 1,5, contrôles OrbitControls sans rotation automatique.


Administration : Laravel rend des documents Blade autonomes derrière le Route Handler Next /administration/[[...path]]. L’origine Laravel est résolue depuis API_URL à chaque requête, ce qui permet de conserver le même build dans Docker. Seuls GET et POST sont relayés, vers un chemin fixe ; les redirections restent internes à l’administration. Les formulaires utilisent la session Laravel et des jetons CSRF, sans JavaScript client. Les contrôleurs délèguent les transitions transactionnelles à EditorialWorkflow et les droits aux politiques. L’API publique conserve ses projections explicites et ne renvoie pas l’historique privé.
