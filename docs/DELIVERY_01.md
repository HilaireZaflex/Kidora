# Livraison 01 — Parcours public de découverte

Date : 4 novembre 2026. Validation dans la machine cloud courante, sans déploiement de production ni validation d’une restauration dans une nouvelle tâche.

## Livré et opérationnel

- Monorepo `apps/web`, `apps/api`, `docs`, `infra` et tests de bout en bout à la racine.
- Next.js 16.4.5, React 19.3, TypeScript strict, Tailwind 4 ; Webpack/PostCSS compatibles avec cette machine.
- Laravel 13.40, PHP 8.4.27 et PostgreSQL 17 dans Docker Compose.
- Accueil original illustré en SVG local, marque centralisée et menu mobile accessible.
- Quinze univers lus dans PostgreSQL via l’API Laravel, pages d’univers et états vides.
- Trois fiches de démonstration avec blocs texte/fait, illustrations propres et références : éléphants, système solaire et Mali.
- Recherche PostgreSQL par mots et préfixes dans titres, résumés, blocs, mots-clés et univers.
- Quiz à choix unique de trois questions : correction serveur, explications, score et nouvelle tentative.
- États d’erreur réseau, chargement de la recherche et vraies réponses HTTP 404.
- Kiro guide vers des contenus prédéfinis ; aucune conversation IA simulée.

## Fichiers et ensembles créés

Les huit documents de référence exigés se trouvent dans `docs` : PRODUCT_VISION, ARCHITECTURE, FEATURES, ROADMAP, DATABASE, SECURITY, CONTENT_MODEL et TESTING. `AGENTS.md` à la racine guide les sessions suivantes. Le prompt original complet est conservé dans `docs/MASTER_BRIEF.md`.

`apps/web/src` sépare pages, composants, configuration de marque et accès API. `apps/api` contient modèles, factories, migrations, seeder de démonstration, ressources JSON, contrôleurs et tests. Le contrat est `docs/openapi.yaml` (JSON valide, donc YAML compatible). `compose.yaml`, `infra/api.Dockerfile`, `infra/install.sh` et `infra/test-api.sh` permettent installation, démarrage et validation. Le guide principal est `README.md`.

Laravel Boost a été installé à la demande des consignes du squelette Laravel ; ses guides Codex sont locaux à l’API. Aucune dépendance 3D, Redis ou stockage média n’est requise par cette tranche.

## Résultats de validation

- Installation complète `bash infra/install.sh` : réussie. Lockfiles respectés ; migrations déjà appliquées reconnues ; seeder réexécuté sans doublons.
- Compilation de production et vérification TypeScript : réussies.
- ESLint : aucune erreur ni alerte dans le dernier contrôle.
- Formatage PHP Pint : appliqué. Le mode `--dirty` n’est pas disponible dans le conteneur, qui ne monte pas les métadonnées Git ; les chemins PHP ont été traités explicitement.
- Tests API : **13 réussis, 88 assertions**, sur PostgreSQL `kidora_test`.
- Tests Playwright : **16 réussis**, répartis entre bureau et téléphone simulé. Ils couvrent lecture, recherche, quiz, erreurs, largeur effective du viewport, clavier, menu mobile et refus d’une origine étrangère.
- Axe-core : aucune violation des règles WCAG A/AA sélectionnées pour accueil et fiche, sur les deux profils. Cela ne constitue pas une certification d’accessibilité.
- Audits npm des dépendances d’exécution et audit Composer à l’installation : aucun avis de vulnérabilité connu signalé au moment des contrôles.

La première exécution des tests API a révélé une mauvaise transmission du nom de base par Docker et a réinitialisé le catalogue de démonstration créé pendant cette tâche. Le lancement force désormais la base dédiée ; le TestCase refuse toute autre base avant les migrations. Ce refus a été vérifié avec une commande volontairement mal configurée, sans perte des trois fiches restaurées.

Les compteurs de requêtes du catalogue et du quiz sont désormais indépendants ; un test vérifie que 35 lectures ne consomment pas le budget des soumissions. Les limites restent actives.

## Mesure Lighthouse

Une mesure finale locale avec Lighthouse 13.6.0 et Chromium système, version compilée, simulation mobile par défaut :

- Performance : **99/100**.
- Contrôles d’accessibilité : **100/100**.
- LCP : **0,9 seconde** ; CLS : **0**.
- JavaScript transféré : **143 089 octets** (environ 140 Kio), sous le budget initial de 200 Kio.
- Total transféré : **170 497 octets**.

Mesure unique du 4 novembre 2026, 16:56 UTC ; elle ne représente pas un téléphone physique ni un réseau de terrain au Mali. Le rapport brut de cette session se trouve dans `/tmp/kidora-lighthouse.json`, les captures dans `/tmp/kidora-desktop.png` et `/tmp/kidora-mobile.png`.

## Démonstrations et limites

Les textes sont des contenus de démonstration avec références ; ils attendent une validation éditoriale pour publication commerciale. Les illustrations sont décoratives et originales. La planète d’accueil est imaginaire, pas une carte géographique.

Pas encore de globe GeoWorld interactif, administration, comptes parents/enfants, consentements, progression persistante, favoris, missions, vidéos, narration, profils d’âge ajustables, traduction ou PWA hors ligne. Ces fonctionnalités sont indiquées « À venir ». Aucun bouton n’en simule l’activation. Le quiz ne conserve pas de résultat personnel.

La recherche ne fournit pas encore de suggestions, correction orthographique ou classement sémantique. Le catalogue public est paginé côté API (30 fiches) ; cette tranche n’a que trois fiches. Les index de recherche destinés à un grand catalogue seront préparés avec des données représentatives.

Aucun secret externe n’est nécessaire pour ce parcours local. Les paramètres PostgreSQL de Compose sont des paramètres publics de développement. La configuration n’est pas une infrastructure de production.

## Suite logique

Développer GeoWorld avec des données géographiques documentées et licenciées, sélection et recherche des pays, chargement différé et alternative 2D. Ensuite livrer l’administration authentifiée et le workflow éditorial avant les comptes enfants et la progression.

Les commandes exactes d’installation et de démarrage sont dans le README principal. Les scripts cloud d’installation et les instructions de démarrage sont enregistrés séparément dans le brouillon de configuration ; cette sauvegarde ne publie pas l’environnement.
