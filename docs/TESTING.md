# Validation

API : tests Laravel d’intégration sur PostgreSQL dédié, migrations, intégrité du catalogue, exclusion des brouillons, recherche et validation, absence de bonnes réponses dans le quiz public, correction des réponses et refus des entrées invalides.

Web : TypeScript strict, lint, build production ; tests navigateur du parcours accueil → univers → article → quiz, recherche et affichage mobile. Contrôles axe-core WCAG A/AA sur accueil et fiche. Tester clavier, focus, titres, contrastes et réduction des animations. Ne pas prétendre avoir testé Lighthouse ou un appareil physique sans l’avoir fait.

Budgets initiaux à mesurer : aucune dépendance 3D dans l’accueil ; illustrations SVG locales ; objectif JS initial < 200 Ko gzip, LCP mobile < 2,5 s sur réseau de référence documenté. Ces objectifs ne sont pas des résultats mesurés.

Futur : politiques admin et ownership parent/enfant, consentements, export/suppression, offline et invalidation, dégradation WebGL, données géographiques, restauration des sauvegardes. Toute vérification rapporte les tests exécutés et les échecs, pas seulement le code de sortie.
