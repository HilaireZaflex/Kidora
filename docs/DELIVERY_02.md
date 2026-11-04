# Livraison 02 — GeoWorld et synchronisation GitHub

## Fonctionnel

- Route `/geoworld`, accessible depuis la navigation et l’univers GeoWorld.
- Carte Equal Earth en SVG, utilisable sans WebGL ; sélection tactile/pointeur ou via la liste clavier.
- Noms français lorsqu’un code ISO est disponible, recherche sans sensibilité aux accents, états sans résultat.
- Globe Three.js/React Three Fiber chargé sur demande, rotation 360°, zoom, recentrage et identification d’un pays par clic.
- Pays sélectionné mis en évidence ; caméra recentrée à partir de sa géométrie, sans coordonnées inventées.
- Retour au mode léger, message clair si WebGL n’est pas disponible et carte de repli en cas d’échec du moteur.
- Fiches disponibles liées par `articles.country_code` dans PostgreSQL. La fiche du Mali est actuellement publiée en démonstration.

## Données et licences

Frontières : world-atlas 2.0.2, dérivé de Natural Earth 4.1.0 à l’échelle 1:110 millions, 177 entités cartographiques. Le fichier distribué est inchangé (SHA-256 `2516c915867c7baf18ddec727aec46c315541a07cfb3d79a6559b05d5e94eee8`). Natural Earth est dans le domaine public ; la redistribution world-atlas est ISC. Noms et codes : i18n-iso-countries, MIT. Notices incluses dans `apps/web/public/geography`.

Les zones ne sont pas une liste de pays indépendants et les frontières ne constituent pas une position politique. Certains petits États/territoires sont absents à cette échelle. Aucun chiffre de population ou capitale n’est simulé. Les autres fiches pays restent à venir.

## Code et contrat

Nouveaux composants : `components/geoworld/explorer`, `world-map`, `world-globe`. Logique géométrique dans `lib/geography/model`. Ressources cartographiques locales dans `public/geography`, générateur de libellés dans `scripts/prepare-geography.mjs`. Migration additive du code pays, ressource ArticleResource et seeder mis à jour ; contrat OpenAPI actualisé.

## Vérifications

- TypeScript strict, ESLint et compilation de production réussis.
- **14 tests API réussis, 94 assertions**, sur PostgreSQL dédié.
- **28 tests navigateur réussis**, bureau et mobile simulé, parcours existants et GeoWorld.
- Le rendu 3D est vérifié par comparaison des pixels après zoom et rotation, puis par sélection réelle d’une zone via le globe recentré.
- Mode WebGL indisponible vérifié séparément ; carte toujours utilisable.
- Contrôles axe-core A/AA réussis sur GeoWorld, accueil et fiche dans les profils testés.
- Pas de validation sur GPU physique, iPhone ou Safari ; le runner Chromium utilise SwiftShader.

## GitHub

La première livraison a été commitée et envoyée sur `main`. Cette livraison GeoWorld est envoyée séparément après vérification. Aucune dépendance installée, clé, fichier `.env` local ou donnée de session n’est versionnée.

## Suite

Prochaine tranche : administration des contenus avec authentification, autorisations serveur et workflow de validation/publication. Relief, capitales, données géographiques détaillées et enrichissement des fiches pays restent à développer.
