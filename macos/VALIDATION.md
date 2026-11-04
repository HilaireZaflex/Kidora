# Vérifications du paquet macOS

Le 4 novembre 2026, sur la machine cloud Linux x86-64 disponible :

- Construction réelle de l’image web Node 24 et du runtime PHP 8.4.
- Démarrage isolé PostgreSQL → API → frontend, avec contrôles HTTP de disponibilité.
- Migrations et chargement des trois fiches de démonstration sur une nouvelle base de test indépendante de la base cloud existante.
- **16 tests navigateur réussis** contre le frontend Docker : univers, fiches, recherche, quiz corrigé, nouvelle tentative, navigation mobile, clavier, contrôles axe-core et rejet d’une origine étrangère.
- Vérification de syntaxe des lanceurs et contrôle d’intégrité du ZIP, des permissions exécutables et de l’absence de `.env`, données SQLite, logs, caches, clés de stockage et dépendances de la session cloud.

Le serveur PHP utilise `--no-reload` afin de conserver les variables Docker Compose, notamment la connexion PostgreSQL, dans son sous-processus HTTP.

Limites : le double-clic Finder, les dialogues de macOS et l’exécution physique sur Apple Silicon/Intel ne peuvent pas être vérifiés dans cette machine Linux. Les dépendances PHP déjà vérifiées dans la session ont été réutilisées pour le contrôle Docker, car le proxy cloud bloque les archives de l’API GitHub. Sur le Mac, le premier lancement télécharge les dépendances verrouillées depuis leurs sources officielles avec TLS actif.

Aucun compte, mot de passe personnel, clé de la session cloud ni donnée d’enfant n’est exporté dans l’archive. Les mots de passe PostgreSQL présents dans Compose sont uniquement les paramètres publics de la démo locale.
