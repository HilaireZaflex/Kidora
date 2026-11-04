# KIDORA

**Explore. Découvre. Apprends.** Une encyclopédie éducative pour les 6–12 ans, pensée au Mali.

Première tranche : monorepo Next.js/Laravel/PostgreSQL, accueil illustré, quinze univers dynamiques, trois fiches de démonstration sourcées, recherche textuelle PostgreSQL par mots et préfixes et quiz corrigé côté serveur. Aucun compte enfant, contenu personnel ou assistant IA. Les autres modules sont explicitement à venir.

Le [bilan de livraison](docs/DELIVERY_01.md) décrit les fonctionnalités, les vérifications et les limites de cette tranche.

## Tester sur macOS sans installer les runtimes

Installer et ouvrir Docker Desktop, puis double-cliquer sur **Ouvrir Kidora.command**. Le lanceur construit et démarre les trois services avec `compose.macos.yaml`, attend leur disponibilité et ouvre le navigateur. **Arrêter Kidora.command** conserve les données. Voir [le guide Mac](macos/LIRE-MOI.md). Cette voie ne nécessite pas Node.js ou PHP sur le Mac.

## Prérequis

Node.js 24 LTS et npm, Docker Engine avec Compose v2. PHP 8.4 et ses extensions sont fournis par `infra/api.Dockerfile` ; PostgreSQL 17 par Compose. Le frontend utilise Next.js 16, React 19, TypeScript strict et Tailwind 4. Versions effectives figées dans les lockfiles. Les dépendances d’animation/3D seront ajoutées avec leurs modules, pas sur l’accueil.

## Installer une première fois

Depuis la racine du dépôt :

```bash
bash infra/install.sh
```

Le script construit PHP, installe Composer et npm depuis les lockfiles, crée `.env` si absent et une clé locale si nécessaire, migre PostgreSQL et charge le catalogue démo. Il ne supprime ni données ni fichiers existants. Il remet à jour les trois fiches de démonstration ; ne pas l’utiliser pour un catalogue éditorial de production.

Dans le cloud, conserver le proxy et `CODEX_PROXY_CERT` injectés. Composer utilise les sources Git officielles, car le domaine des archives `api.github.com` peut être bloqué. Sur une autre machine, le bundle système est utilisé par défaut. Ne jamais désactiver la vérification TLS.

## Démarrer

À la racine, base de données :

```bash
docker compose up -d db
```

Backend Laravel :

```bash
docker compose up -d api
```

Frontend, dans un terminal conservé ouvert :

```bash
npm --prefix apps/web run dev -- --hostname 127.0.0.1
```

La commande `npm run dev` suffit également sans options. Le frontend écoute sur le port 3000, Laravel sur 8000 et PostgreSQL sur 5432, liés à la boucle locale. `GET /api/v1/health` vérifie réellement la connexion PostgreSQL.

Pour vérifier une compilation production : `npm run build`, puis `npm --prefix apps/web run start -- --hostname 127.0.0.1`. Il s’agit d’un serveur local, pas d’un déploiement de production.

Le web appelle Laravel côté serveur via `API_URL`, par défaut `http://127.0.0.1:8000/api/v1`. Copier `apps/web/.env.example` vers `.env.local` seulement pour changer cette adresse. Derrière un reverse proxy HTTPS, définir aussi `WEB_ORIGIN` sur l’origine publique exacte pour la vérification des soumissions de quiz. Aucune variable sensible ne porte le préfixe `NEXT_PUBLIC_`.

## Vérifier

```bash
npm run lint
npm run typecheck
npm run build
npm run test:api
npm run test:e2e
```

`test:api` crée `kidora_test` si nécessaire et lance les tests PostgreSQL sur cette base dédiée, sans vider `kidora`. `test:e2e` démarre le frontend compilé si nécessaire et attend une API déjà disponible. Chromium système est utilisé s’il existe ; sinon lancer `npx playwright install chromium`. Une autre installation peut être sélectionnée par `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Deux profils sont testés : bureau et viewport/tactile mobile simulé. Cela ne remplace pas des appareils physiques.

## Structure

- `apps/web` : interface publique, composants, configuration de marque et proxy de correction quiz.
- `apps/api` : catalogue, migrations, seeders et API REST versionnée.
- `docs` : vision, architecture, données, sécurité, contenu, tests, roadmap et contrat OpenAPI.
- `infra` : runtime PHP et scripts de développement ; `compose.yaml` à la racine.
- `tests/e2e` : parcours navigateur.

## Limites de cette tranche

Le globe interactif, l’administration, l’authentification parent/enfant, la progression, les traductions, les vidéos et le mode PWA hors ligne ne sont pas implémentés. Aucun faux contrôle ne les active. Les univers sans fiche affichent un état explicite. La planète illustrée de l’accueil est décorative, pas une carte scientifique.

Le seeder et les textes sont identifiés comme démonstration et nécessitent une validation éditoriale. La recherche est textuelle, sans correction orthographique ni recherche sémantique. Les quinze univers ont leurs noms dans PostgreSQL, mais leur édition par interface attend le module administration. Le niveau de lecture n’est pas encore ajustable.

## Exploitation future

Compose est réservé au développement : mot de passe PostgreSQL public de développement, serveur PHP de développement, pas de HTTPS ni sauvegardes automatiques. Avant VPS : secrets propres, PHP-FPM/reverse proxy HTTPS, `APP_DEBUG=false`, comptes limités, sauvegardes chiffrées et restauration testée, migrations contrôlées, supervision et revue juridique. Ne pas exposer cette configuration directement sur Internet. Aucun déploiement n’est autorisé par ce projet.

`docker compose stop` arrête les services en gardant le volume de données. Ne pas utiliser `down -v` si des données doivent être conservées.
