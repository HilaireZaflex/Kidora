# Données

Tranche : universes (slug unique, titre, description, couleur, icône, ordre, statut), articles (univers, slug unique, titre, résumé, tranches d’âge, langue, blocs JSON, sources JSON, statut, démonstration), quizzes (article, titre), questions (quiz, énoncé, choix JSON, réponse et explication).

Clés étrangères et suppression en cascade pour quiz/questions ; univers protégé s’il contient des articles. Index des slugs et des relations ; requêtes publiques filtrées par publication. PostgreSQL UTF-8. JSON utilisé pour des blocs et sources bornés ; normaliser les médias lors du module éditorial.

Évolution : users, parent_profiles, child_profiles (pseudonyme, niveau), roles, permissions ; categories et topics ; media_assets, sources et translations ; missions, badges, child_progress, favorites, discoveries ; countries et geographic_facts ; editorial_reviews et révisions. Un enfant appartient à son parent ; toute lecture privée impose cette relation côté serveur. Progression liée à de vraies activités et sans pénalité d’absence.

Les migrations sont versionnées. Le seeder de démonstration est idempotent, explicite et limité au développement. Aucun `migrate:fresh` dans les instructions de démarrage ou de production.

GeoWorld : `articles.country_code`, code ISO alpha-3 nullable et indexé, associe une fiche publiée à une destination. La migration renseigne la fiche de démonstration existante du Mali. Les frontières et les noms du jeu cartographique sont des ressources publiques versionnées, pas des coordonnées saisies manuellement.
