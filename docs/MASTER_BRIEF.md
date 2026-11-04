# PROMPT MAÎTRE — KIDORA
## Mission : construire une plateforme EdTech immersive de nouvelle génération

Tu es un ingénieur logiciel principal, architecte full-stack, expert React/Next.js, Laravel, PostgreSQL, UX/UI, PWA, animations interactives, applications éducatives pour enfants et sécurité applicative.

Tu travailles sur un véritable produit commercial destiné à être lancé au Mali, puis progressivement dans plusieurs pays africains et à l'international.

Tu es responsable de la qualité de l'architecture, de l'expérience utilisateur, de la cohérence du design, de la maintenabilité du code, des performances et de la sécurité.

**Nom provisoire : KIDORA**

**Slogan : Explore. Découvre. Apprends.**

Le nom doit pouvoir être modifié facilement dans une configuration centralisée.

## 1. Vision générale

KIDORA est une encyclopédie éducative interactive destinée principalement aux enfants de 6 à 12 ans.

Le produit s'inspire du principe de découverte de Microsoft Encarta Junior, mais possède une identité visuelle, une architecture, des contenus et des fonctionnalités entièrement originaux.

Notre ambition est de transformer l'apprentissage en exploration.

L'enfant doit pouvoir :

- Découvrir des connaissances encyclopédiques.
- Explorer des univers thématiques.
- Manipuler des objets et des simulations.
- Observer des animations pédagogiques.
- Écouter des narrations.
- Regarder des vidéos éducatives.
- Participer à des quiz et des mini-jeux.
- Explorer un globe terrestre interactif.
- Accomplir des missions.
- Construire son carnet personnel de découvertes.
- Recevoir des explications adaptées à son âge.

Le produit doit rester pédagogique, agréable, accessible et utilisable sur des appareils relativement modestes.

L'expérience doit être spectaculaire sans devenir confuse ou surchargée.

## 2. Méthode de travail obligatoire

Ne développe pas toute la plateforme dans une seule opération.

Commence par examiner le dépôt existant. S'il est vide, initialise proprement le projet.

Crée d'abord :

1. `docs/PRODUCT_VISION.md`
2. `docs/ARCHITECTURE.md`
3. `docs/FEATURES.md`
4. `docs/ROADMAP.md`
5. `docs/DATABASE.md`
6. `docs/SECURITY.md`
7. `docs/CONTENT_MODEL.md`
8. `docs/TESTING.md`
9. `AGENTS.md`

Ces documents doivent refléter les exigences de ce prompt et servir de référence pour les prochaines sessions Codex.

Ensuite, développe progressivement une première version exécutable.

À la fin de chaque étape :

- Exécute les vérifications pertinentes.
- Corrige les erreurs détectées.
- Résume les fichiers créés ou modifiés.
- Indique les fonctionnalités réellement opérationnelles.
- Indique les fonctionnalités encore simulées.
- Identifie les dépendances ou décisions bloquantes.
- Propose la prochaine étape logique.

Ne prétends jamais qu'une fonctionnalité fonctionne si elle n'a pas été implémentée ou vérifiée.

N'utilise pas de faux boutons, de faux liens ou de données présentées comme réelles sans indication explicite.

## 3. Stack technique

### Frontend

- Next.js avec App Router.
- React.
- TypeScript strict.
- Tailwind CSS.
- Composants accessibles et réutilisables.
- Motion pour les animations d'interface.
- Rive ou Lottie pour les animations légères.
- React Three Fiber et Three.js lorsque la 3D apporte une véritable valeur pédagogique.
- Gestion des données serveur avec TanStack Query lorsque nécessaire.
- PWA avec service worker et stratégie de cache maîtrisée.

### Backend

- Laravel, version stable compatible avec l'environnement.
- API REST documentée avec OpenAPI.
- PostgreSQL.
- Redis pour les caches et les traitements asynchrones lorsque nécessaire.
- Files de tâches Laravel.
- Stockage média compatible S3.
- Authentification sécurisée.
- Gestion des rôles et autorisations.

### Architecture

Privilégie un monorepo comprenant :

- `apps/web`
- `apps/api`
- `packages/shared` si pertinent
- `docs`
- `infra`

Évite une architecture microservices prématurée.

Privilégie un monolithe modulaire maintenable.

Utilise des versions de dépendances stables et compatibles, sans supposer qu'une version précise est disponible.

## 4. Identité visuelle et direction artistique

Je veux une interface premium, très moderne, colorée, immersive et originale.

Le design doit être à la hauteur d'un produit éducatif international.

Il ne doit pas ressembler à un thème WordPress, à un tableau de bord administratif classique ou à un simple catalogue de cartes génériques.

### Direction artistique

- Univers illustrés en 3D stylisée.
- Couleurs lumineuses et harmonieuses.
- Personnages attachants.
- Typographie parfaitement lisible.
- Grandes illustrations pédagogiques.
- Cartes interactives avec profondeur et animations.
- Transitions fluides.
- Micro-interactions utiles.
- Navigation simple pour les enfants.
- Design responsive mobile, tablette et ordinateur.

### Palette indicative

- Bleu exploration : `#2563EB`
- Violet imagination : `#7C3AED`
- Vert nature : `#22C55E`
- Orange aventure : `#F97316`
- Jaune découverte : `#FACC15`
- Fond clair : `#F8FAFF`
- Texte principal : `#14213D`

Ces couleurs constituent un point de départ, pas une obligation d'utiliser toutes les couleurs simultanément.

Chaque univers possède son identité visuelle, tout en conservant une cohérence globale.

### Accessibilité

- Navigation clavier.
- Contrastes suffisants.
- Taille des textes adaptée.
- Boutons tactiles confortables.
- Alternatives textuelles.
- Respect de `prefers-reduced-motion`.
- Narrations et sous-titres lorsque disponibles.
- Mode allégé pour appareils peu performants.

## 5. Structure de l'application

L'application doit comprendre les espaces suivants :

### A. Espace public

- Page d'accueil.
- Présentation des univers.
- Recherche encyclopédique.
- Découvertes du jour.
- Bibliothèque d'articles.
- Sélection de vidéos.
- Jeux accessibles sans inscription.
- Informations sur la plateforme.

### B. Espace enfant

- Profil d'explorateur.
- Choix du niveau.
- Univers de connaissances.
- Carnet de découvertes.
- Favoris.
- Quiz.
- Missions.
- Badges.
- Progression.
- Île personnelle évolutive, dans une phase ultérieure.

### C. Espace parent

- Gestion des profils enfants.
- Autorisations et préférences.
- Progression pédagogique.
- Activités consultées.
- Objectifs facultatifs.
- Gestion du temps d'utilisation.
- Gestion des données et de la confidentialité.

### D. Administration

- Gestion des catégories.
- Gestion des sous-catégories.
- Articles.
- Images.
- Audio.
- Vidéos.
- Quiz.
- Questions.
- Missions.
- Jeux.
- Publications.
- Traductions.
- Validation éditoriale.
- Gestion des utilisateurs autorisés.
- Statistiques agrégées.

L'administration doit être indépendante visuellement de l'espace enfant.

## 6. Les quinze univers éducatifs

Construis un système de catégories entièrement dynamique.

Les catégories ne doivent jamais être codées en dur dans les composants de présentation.

Chaque univers possède :

- Identifiant.
- Nom.
- Slug.
- Description.
- Illustration.
- Couleur.
- Icône.
- Sous-catégories.
- Articles.
- Ressources multimédias.
- Quiz.
- Missions.
- Niveau de difficulté.
- Statut de publication.

### Les univers

**01 — Animalia : Animaux**

Mammifères, oiseaux, reptiles, insectes, poissons, animaux marins, dinosaures, habitats, alimentation et biodiversité.

**02 — Scientia : Sciences**

Physique, chimie, énergie, lumière, électricité, magnétisme et expériences.

**03 — Cosmia : Espace**

Système solaire, planètes, étoiles, galaxies, fusées, astronautes et exploration spatiale.

**04 — Humania : Corps humain**

Cœur, cerveau, organes, squelette, muscles, respiration, digestion et cinq sens.

**05 — Chronosia : Histoire**

Préhistoire, civilisations, empires africains, grandes découvertes, inventions et personnages historiques.

**06 — GeoWorld : Géographie**

Continents, pays, capitales, océans, montagnes, cartes, drapeaux et globe terrestre.

**07 — TerraNature : Nature et environnement**

Forêts, plantes, climat, océans, écosystèmes et protection de la nature.

**08 — TechnoLab : Technologies**

Robotique, ordinateurs, machines, transports, inventions et innovation.

**09 — Earth Mysteries : Phénomènes naturels**

Volcans, séismes, tornades, éclairs, tempêtes et phénomènes géologiques.

**10 — Cultures du monde**

Traditions, langues, peuples, fêtes, monuments, musiques et patrimoine.

**11 — Le monde des pourquoi**

Questions scientifiques et curiosités du quotidien.

**12 — Creativia : Arts**

Peinture, dessin, musique, architecture et créativité.

**13 — LogicLand : Logique**

Mathématiques récréatives, énigmes, raisonnement et jeux de logique.

**14 — StoryWorld : Histoires**

Contes, biographies, lecture, vocabulaire et narration.

**15 — FutureWorld : Métiers**

Découverte des métiers, compétences, inventions et métiers de demain.

Les noms doivent être configurables depuis l'administration.

## 7. Page d'accueil immersive

La page d'accueil est une priorité absolue.

Elle doit contenir :

### Barre supérieure

- Logo KIDORA.
- Recherche globale.
- Découverte du jour.
- Jeux.
- Favoris, si disponibles.
- Sélection du profil.
- Accès parent.

### Hero principal

Une grande illustration immersive combinant la Terre, la nature, l'espace, les animaux et la découverte.

Texte principal :

« Explore. Découvre. Apprends. »

Texte secondaire :

« Un monde de connaissances et d'aventures t'attend ! »

Ajouter un appel à l'exploration.

### Univers

Présenter les quinze univers sous forme de cartes illustrées.

Chaque carte possède une identité visuelle propre et mène vers une page fonctionnelle.

### Découverte du jour

Une information étonnante, illustrée, vérifiée et reliée à une fiche encyclopédique.

### Jeux éducatifs

Sélection de mini-jeux disponibles.

### Vidéos et histoires

Ressources réellement publiées depuis l'administration.

### Compagnon Kiro

Présenter un personnage robot attachant.

Dans la première version, Kiro peut guider l'utilisateur vers des contenus prédéfinis. Ne pas simuler une véritable IA conversationnelle.

## 8. Fiches encyclopédiques interactives

Une fiche doit pouvoir contenir :

- Titre.
- Résumé.
- Illustration principale.
- Introduction adaptée à l'âge.
- Sections structurées.
- Images.
- Audio.
- Vidéo.
- Modèles 3D facultatifs.
- Informations étonnantes.
- Glossaire.
- Sources.
- Liens vers d'autres fiches.
- Quiz associé.
- Favoris.
- Progression.

Créer un système de blocs de contenu réutilisables.

Exemples de blocs :

- Texte illustré.
- Galerie.
- Lecteur audio.
- Vidéo.
- Question interactive.
- Carte.
- Frise chronologique.
- Comparaison.
- Modèle 3D.
- Simulation.
- Quiz.

Les contenus doivent être gérés depuis le backend.

## 9. Globe terrestre interactif

Le globe terrestre est une fonctionnalité signature du produit.

Créer un module `GeoWorld` indépendant et extensible.

### Première version

- Globe manipulable à 360 degrés.
- Zoom.
- Rotation.
- Sélection des pays.
- Identification du pays sélectionné.
- Affichage du nom et des informations disponibles.
- Recherche d'un pays.
- Accès aux fiches géographiques.
- Interface adaptée au tactile.

Utiliser des données géographiques fiables, documentées et correctement licenciées.

Ne pas inventer les coordonnées, frontières ou informations géographiques.

### Versions avancées

- Frontières.
- Capitales.
- Relief.
- Océans.
- Monuments.
- Animaux emblématiques.
- Cycle jour/nuit.
- Comparaison de pays.
- Passeport virtuel.
- Missions géographiques.

### Performances

Le globe doit être chargé uniquement à l'ouverture du module.

Prévoir une alternative 2D pour les appareils incompatibles ou peu performants.

Éviter les textures trop volumineuses.

Ne jamais bloquer la page principale à cause du moteur 3D.

## 10. Jeux éducatifs

Créer un moteur de quiz réutilisable.

Types de questions :

- Choix unique.
- Choix multiple.
- Vrai ou faux.
- Association.
- Classement.
- Identification d'image.
- Questions chronométrées facultatives.

Prévoir :

- Correction.
- Explication.
- Score.
- Rejouer.
- Progression.
- Résultats.
- Difficulté.
- Accessibilité.

Développer ensuite des mini-jeux indépendants :

- Memory des animaux.
- Quiz des capitales.
- Puzzle géographique.
- Reconnaissance des drapeaux.
- Devine le cri de l'animal.
- Classement des planètes.
- Associations scientifiques.

Ne pas utiliser de classements publics entre enfants.

Ne pas employer de mécanismes de récompense encourageant une utilisation excessive.

## 11. Système de progression

Créer un système de progression pédagogique.

Prévoir :

- Univers explorés.
- Fiches terminées.
- Quiz réussis.
- Badges.
- Missions accomplies.
- Carnet de découvertes.
- Recommandations de révision.

La progression doit être liée à des activités pédagogiques réelles.

L'enfant ne doit pas perdre ses acquis s'il ne revient pas pendant plusieurs jours.

## 12. Profils selon l'âge

Trois niveaux :

- 6–8 ans : petits explorateurs.
- 9–10 ans : grands explorateurs.
- 11–12 ans : explorateurs experts.

Adapter :

- Complexité du texte.
- Quantité d'informations.
- Types de quiz.
- Narration.
- Difficulté des missions.
- Interface.

Le niveau doit rester ajustable par le parent et ne pas constituer une limitation rigide.

## 13. Recherche encyclopédique

Créer un moteur de recherche global.

Rechercher dans :

- Titres.
- Résumés.
- Articles.
- Catégories.
- Mots-clés.
- Questions.
- Jeux.
- Ressources.

Prévoir :

- Autocomplétion.
- Correction des fautes courantes.
- Filtres.
- Suggestions.
- Résultats pertinents.

Commencer avec une recherche textuelle fiable.

Préparer l'architecture pour une recherche sémantique future.

## 14. Innovations prévues

Prévoir l'extensibilité de l'architecture pour les modules suivants, sans chercher à les développer intégralement dans la première version :

### Corps humain 3D

Exploration des organes, systèmes et animations physiologiques.

### Laboratoire virtuel

Simulations de physique, d'électricité, de lumière et de phénomènes scientifiques.

### Machine à voyager dans le temps

Frises historiques, scènes interactives et missions.

### Musée virtuel

Galeries thématiques, objets 3D et visites pédagogiques.

### Mode « Et si… ? »

Scénarios scientifiques hypothétiques et simulations.

### Enquêtes scientifiques

Missions d'investigation et résolution de problèmes.

### Créateur de mondes

Construction d'écosystèmes et simulations de leurs interactions.

### Grandes expéditions

Aventures associant plusieurs domaines de connaissances.

### Île personnelle

Monde virtuel évoluant selon les découvertes réalisées.

### Compagnon Kiro IA

Assistant pédagogique contrôlé et limité à des contenus vérifiés.

### Langues africaines

Infrastructure de traduction et de narration multilingue.

### Espace écoles

Gestion des classes, exercices et progression pédagogique.

## 15. Sécurité des enfants

La protection des enfants est une exigence non négociable.

Mettre en place :

- Comptes enfants sous contrôle parental.
- Collecte minimale de données.
- Pseudonymes plutôt que noms réels dans l'espace enfant.
- Aucune messagerie libre entre enfants.
- Aucun profil public d'enfant.
- Aucune publicité comportementale.
- Aucune géolocalisation précise des enfants.
- Consentements parentaux adaptés aux juridictions concernées.
- Contrôles d'accès côté serveur.
- Validation des entrées.
- Protection contre les abus.
- Journalisation administrative sans données sensibles inutiles.
- Suppression et export des données selon les règles applicables.
- Protection des ressources privées.
- Politique de conservation documentée.

Ne jamais exposer les clés API dans le frontend.

Les futures fonctions IA devront être conçues avec des protections spécifiques aux mineurs.

## 16. Administration des contenus

Développer une interface d'administration professionnelle.

Prévoir les rôles :

- Super administrateur.
- Administrateur.
- Éditeur.
- Rédacteur.
- Validateur pédagogique.

Workflow :

Brouillon → Révision → Validation → Publication → Mise à jour.

Chaque contenu doit posséder :

- Auteur.
- Statut.
- Date de création.
- Date de mise à jour.
- Références.
- Niveau d'âge.
- Langue.
- Historique des modifications.

Les données de démonstration doivent être clairement identifiées comme telles.

## 17. Architecture des données

Concevoir un modèle relationnel cohérent.

Entités envisagées :

- Users.
- ParentProfiles.
- ChildProfiles.
- Roles.
- Permissions.
- Universes.
- Categories.
- Topics.
- Articles.
- ArticleBlocks.
- MediaAssets.
- Sources.
- Quizzes.
- Questions.
- Answers.
- Games.
- Missions.
- Badges.
- ChildProgress.
- Favorites.
- Discoveries.
- Countries.
- GeographicFacts.
- Translations.
- EditorialReviews.

Les noms exacts peuvent être ajustés selon les conventions Laravel.

Créer migrations, modèles, relations, index, contraintes, politiques d'accès et données de démonstration.

Éviter la duplication inutile des contenus.

## 18. PWA et mode hors ligne

L'application doit être installable sur les appareils compatibles.

Prévoir :

- Manifest.
- Icônes.
- Service worker.
- Page hors ligne.
- Cache des ressources publiques.
- Téléchargement volontaire de modules.
- Indication de l'espace occupé.
- Gestion des mises à jour.
- Synchronisation différée des activités autorisées.

Ne pas mettre en cache de données personnelles sensibles sans protection adaptée.

Prévoir une stratégie de mise à jour et d'invalidation du cache.

## 19. Performance

Objectifs :

- Chargement rapide.
- Optimisation des images.
- Lazy loading.
- Découpage du code.
- Chargement différé de la 3D.
- Cache serveur.
- Requêtes optimisées.
- Compatibilité mobile.
- Réduction de la consommation de données.

Définir des budgets de performance mesurables.

Tester les pages principales avec Lighthouse et des tests automatisés lorsque l'environnement le permet.

## 20. Qualité du code

Exigences :

- TypeScript strict.
- Code modulaire.
- Composants réutilisables.
- Séparation des responsabilités.
- Nommage cohérent.
- Gestion des erreurs.
- États de chargement.
- États vides.
- Validation serveur.
- Documentation.
- Tests unitaires.
- Tests d'intégration.
- Tests end-to-end des parcours critiques.

Éviter les composants géants et les fichiers contenant toute la logique applicative.

Ne pas ajouter de dépendances sans justification.

## 21. Déploiement

Préparer une infrastructure compatible avec un VPS Ubuntu.

Utiliser des variables d'environnement.

Prévoir :

- Docker Compose pour le développement local, si pertinent.
- Configuration de production documentée.
- HTTPS.
- Sauvegardes.
- Migrations contrôlées.
- Journaux.
- Supervision.
- Gestion des erreurs.
- Procédure de restauration.
- Déploiement reproductible.

Ne jamais déployer en production ou modifier une infrastructure réelle sans autorisation explicite.

## 22. Première livraison attendue

Commence par produire une version initiale fonctionnelle contenant :

1. Architecture du monorepo.
2. Frontend Next.js.
3. Backend Laravel.
4. Connexion PostgreSQL.
5. Design system.
6. Page d'accueil immersive.
7. Navigation responsive.
8. Univers dynamiques.
9. Pages de catégories.
10. Modèle de fiches encyclopédiques.
11. Quelques contenus de démonstration vérifiés ou clairement signalés.
12. Recherche initiale.
13. Premier quiz fonctionnel.
14. Première version du globe terrestre interactif.
15. Administration minimale des contenus.
16. Tests de base.
17. Documentation d'installation.

Les fonctionnalités non encore développées doivent être indiquées comme « À venir », sans simuler un fonctionnement inexistant.

## 23. Ordre d'exécution

Travaille dans cet ordre :

**Étape A — Analyse**

Inspecte le dépôt et l'environnement.

Présente l'architecture proposée, les dépendances importantes et les éventuelles questions réellement bloquantes.

**Étape B — Initialisation**

Crée le projet, la structure, les configurations et la documentation.

**Étape C — Design system**

Développe les composants fondamentaux et les styles.

**Étape D — Accueil**

Crée une page d'accueil spectaculaire, responsive et navigable.

**Étape E — Encyclopédie**

Implémente les catégories, articles et contenus structurés.

**Étape F — Géographie**

Implémente le globe interactif et les fiches pays.

**Étape G — Jeux**

Implémente le moteur de quiz et les premiers jeux.

**Étape H — Administration**

Implémente la gestion des contenus.

**Étape I — Qualité**

Exécute les tests, corrige les bugs et améliore les performances.

## 24. Consignes finales

Je veux une application réellement développée, pas seulement une maquette.

Ne te contente pas d'expliquer ce qu'il faudrait coder.

Écris le code, crée les fichiers, exécute les commandes nécessaires et vérifie les résultats.

Prends des décisions techniques raisonnables lorsqu'aucune précision n'est indispensable.

Privilégie une première version stable, élégante et fonctionnelle plutôt qu'une accumulation de fonctionnalités inachevées.

Le produit doit être conçu pour pouvoir évoluer vers une grande plateforme éducative internationale.

Commence maintenant par analyser l'environnement et initialiser le projet, puis construis la première tranche fonctionnelle.

À la fin, fournis les commandes exactes permettant de démarrer le frontend, le backend et la base de données en local.

**Notre objectif : construire une encyclopédie éducative immersive que les enfants auront plaisir à explorer, que les parents pourront utiliser en confiance et qui pourra évoluer durablement.**