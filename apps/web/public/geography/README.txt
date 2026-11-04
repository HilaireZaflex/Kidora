GEOWORLD — PROVENANCE DES DONNÉES

Frontières : countries-110m.json, copie inchangée de world-atlas 2.0.2.
Source : https://github.com/topojson/world-atlas
Jeu d’origine : Natural Earth 4.1.0, Admin 0, échelle 1:110 millions.
Natural Earth : domaine public. Le retraitement world-atlas est sous licence ISC
(voir LICENSE-world-atlas.txt). Informations :
https://github.com/nvkelso/natural-earth-vector
https://www.naturalearthdata.com/about/terms-of-use/

Le jeu contient 177 entités cartographiques. Ce n’est pas une liste exhaustive de
pays indépendants : certains petits États sont absents et des zones sans code
ISO sont présentes. Les frontières et statuts peuvent être contestés ou avoir
évolué depuis cette édition. Aucune assertion de reconnaissance politique.

Noms français et codes : i18n-iso-countries (version figée dans package-lock.json),
licence MIT, copyright widdix GmbH ; voir LICENSE-country-names.txt.
Les noms d’origine sont conservés lorsqu’aucun code ISO n’est disponible.
Régénération des libellés : node apps/web/scripts/prepare-geography.mjs.

Aucune donnée de population ou capitale n’est ajoutée ici. Les coordonnées sont
celles des frontières Natural Earth ; les centres de visualisation sont calculés
à partir de ces géométries et ne représentent pas nécessairement une capitale.

Le moteur 3D est chargé à la demande. Une texture locale de 1024 x 512 pixels est
dessinée à partir de ces mêmes frontières. La carte 2D utilise Equal Earth.
