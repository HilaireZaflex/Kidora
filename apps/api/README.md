# API KIDORA

Laravel REST versionné, PostgreSQL, ressources publiques explicitement filtrées par publication. Voir [installation et tests](../../README.md), [modèle de données](../../docs/DATABASE.md) et [OpenAPI](../../docs/openapi.yaml).

Exécuter PHP dans Docker : `docker compose exec -T api php artisan …` depuis la racine du monorepo. Ne pas utiliser le script Composer `dev` du squelette : le frontend est dans `apps/web`, pas dans Vite.

Laravel Boost est une dépendance de développement requise par les consignes du squelette Laravel. Ses guides Codex se trouvent dans `AGENTS.md` et `.agents/skills`. Pour le formatage : `docker compose exec -T api vendor/bin/pint --format agent`.

Le seeder contient seulement le catalogue de démonstration ; aucun utilisateur n’est créé. Il est interdit hors des environnements `local` et `testing`. Le quiz corrige sans conserver de résultat personnel. Les sessions et le cache utilisent des fichiers dans la version de développement.
