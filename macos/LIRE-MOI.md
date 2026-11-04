# Tester Kidora sur votre Mac

1. Installez **Docker Desktop pour Mac** (choisissez la version puce Apple ou Intel adaptée à votre Mac) : https://www.docker.com/products/docker-desktop/
2. Ouvrez Docker Desktop et terminez sa configuration initiale.
3. Décompressez `Kidora-macOS.zip` dans un dossier que vous conserverez.
4. Double-cliquez sur **Ouvrir Kidora.command**. Une fenêtre Terminal affiche la préparation. Le premier démarrage peut prendre plusieurs minutes et nécessite Internet.
5. Le navigateur s’ouvre automatiquement sur Kidora lorsque l’API, PostgreSQL et l’accueil répondent. Vous n’avez aucune commande à saisir et aucun compte à créer.

Si macOS demande une confirmation pour ouvrir le fichier, utilisez le clic droit → Ouvrir et suivez la demande affichée par macOS. Ne désactivez pas les protections du système. En cas de refus persistant, transmettez le message exact.

## Arrêter et reprendre

Double-cliquez sur **Arrêter Kidora.command**. Cela arrête seulement les conteneurs de cette démo et conserve sa base. Double-cliquez à nouveau sur le lanceur pour reprendre. Fermer l’onglet du navigateur n’arrête pas les conteneurs.

Le lancement sélectionne explicitement un contexte Docker Desktop local avec socket Unix ; il n’utilise pas un Docker distant configuré sur le Mac. Les services ne sont accessibles que depuis votre ordinateur. Aucune publication sur Internet n’est effectuée.

## Ce que vous pouvez essayer

Les quinze univers, les fiches sur les éléphants, le Mali et le système solaire, la recherche et le quiz de l’espace. Les contenus sont identifiés comme démonstration. GeoWorld permet aussi d’explorer la carte et le globe 3D. Administration, comptes et mode hors ligne restent à venir.

## En cas de difficulté

- Docker introuvable : installez et ouvrez Docker Desktop, puis relancez.
- Port 3000 déjà utilisé : fermez l’application locale qui l’occupe, ou contactez-nous avec le message affiché. Le lanceur ne l’arrête pas automatiquement.
- Première préparation interrompue : relancez le même fichier ; les dépendances et les données déjà préparées sont réutilisées.
- Conservez le dossier complet : les deux lanceurs ont besoin des fichiers qu’il contient.

Le paquet contient les sources et les scripts, **aucune clé ni donnée de la session cloud**. Les dépendances se téléchargent depuis leurs registres officiels et une clé Laravel est générée sur votre Mac. PHP, Node.js, Composer et PostgreSQL sont fournis par Docker ; ils ne sont pas à installer séparément.

Cette distribution vise Docker Desktop sur Mac Intel et Apple Silicon, sans forcer une architecture x86. Le workflow Docker est vérifié sur la machine Linux disponible ; le double-clic Finder et les dialogues macOS nécessitent une vérification sur votre Mac.
