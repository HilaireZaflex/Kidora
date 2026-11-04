<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\Universe;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new \RuntimeException('Le catalogue de démonstration est réservé aux environnements local et testing.');
        }
        DB::transaction(function () {
            $universes = [
                ['animalia', 'Animalia', 'Le monde des animaux', 'Des insectes minuscules aux géants des savanes, explore la diversité des animaux et leurs habitats.', '#C88C49', 'animal'],
                ['scientia', 'Scientia', 'Sciences & expériences', 'Pose des questions, observe et découvre la lumière, la matière et les forces qui nous entourent.', '#3F9BA7', 'science'],
                ['cosmia', 'Cosmia', 'Voyage dans l’espace', 'Décolle vers les planètes, les étoiles et les grandes questions de notre Univers.', '#8875BE', 'space'],
                ['humania', 'Humania', 'Les secrets de ton corps', 'Pars à la rencontre de tes organes, de tes cinq sens et de cette incroyable machine : ton corps.', '#C47879', 'body'],
                ['chronosia', 'Chronosia', 'Remonter le temps', 'Explore les civilisations, les empires africains, les inventions et les grandes histoires du passé.', '#BC8A4F', 'history'],
                ['geoworld', 'GeoWorld', 'Notre planète en grand', 'Pars à la découverte des pays, des paysages, des océans et des peuples de la Terre.', '#498FA5', 'earth'],
                ['terranature', 'TerraNature', 'La nature nous étonne', 'Observe les plantes, les forêts et les liens fragiles qui unissent les êtres vivants.', '#639563', 'nature'],
                ['technolab', 'TechnoLab', 'Inventer & comprendre', 'Comprends les ordinateurs, les robots et les inventions qui transforment le quotidien.', '#588F9D', 'tech'],
                ['earth-mysteries', 'Earth Mysteries', 'Une Terre surprenante', 'Volcans, éclairs, séismes : découvre les phénomènes naturels et leurs explications.', '#C18469', 'volcano'],
                ['cultures-du-monde', 'Cultures du monde', 'Richesses & traditions', 'Découvre des langues, des traditions, des musiques et le patrimoine des peuples.', '#AC8555', 'culture'],
                ['le-monde-des-pourquoi', 'Le monde des pourquoi', 'Les grandes petites questions', 'Pourquoi le ciel est-il bleu ? Pourquoi flotte-t-on ? Une question ouvre une aventure.', '#C19A43', 'why'],
                ['creativia', 'Creativia', 'Place à l’imagination', 'Peinture, musique, dessin et architecture : explore les arts et crée à ton tour.', '#AD7E9E', 'art'],
                ['logicland', 'LogicLand', 'Le plaisir de réfléchir', 'Joue avec les nombres, les formes et les énigmes pour entraîner ton raisonnement.', '#837FB6', 'logic'],
                ['storyworld', 'StoryWorld', 'Des histoires à découvrir', 'Entre dans les contes, découvre des vies passionnantes et enrichis tes mots.', '#A18CBA', 'book'],
                ['futureworld', 'FutureWorld', 'Imagine demain', 'Découvre les métiers, les compétences et les idées qui aident à construire le monde de demain.', '#A59450', 'future'],
            ];
            foreach ($universes as $i => [$slug, $name, $theme, $description, $color, $icon]) {
                Universe::updateOrCreate(['slug' => $slug], compact('name', 'theme', 'description', 'color', 'icon') + ['position' => $i + 1, 'status' => 'published']);
            }
            $articles = [
                [
                    'universe' => 'animalia', 'illustration' => 'elephant', 'slug' => 'les-secrets-des-elephants', 'title' => 'Les secrets des éléphants',
                    'summary' => 'Une trompe étonnante, de grandes oreilles et une vie en groupe : rencontre un géant de la nature.',
                    'keywords' => ['animaux', 'éléphant', 'elephant', 'savane', 'trompe'],
                    'blocks' => [
                        ['type' => 'text', 'title' => 'Une trompe très utile', 'body' => 'La trompe de l’éléphant est formée par son nez et sa lèvre supérieure. Elle lui permet de respirer, de sentir et de saisir des objets. Pour boire, il aspire de l’eau dans sa trompe, puis la verse dans sa bouche.'],
                        ['type' => 'fact', 'title' => 'Le savais-tu ?', 'body' => 'Les éléphants ne boivent pas à travers leur trompe comme avec une paille ! Ils doivent porter l’eau jusqu’à leur bouche.'],
                        ['type' => 'text', 'title' => 'Grandir ensemble', 'body' => 'Les femelles et les jeunes vivent généralement dans des groupes familiaux. Les adultes protègent les petits et les aident à apprendre. Les éléphants communiquent avec des sons, des gestes et des contacts.'],
                        ['type' => 'text', 'title' => 'Protéger leur maison', 'body' => 'Les éléphants ont besoin de vastes espaces pour trouver de la nourriture et de l’eau. Protéger leurs habitats et lutter contre le braconnage aide à préserver ces animaux.'],
                    ],
                    'sources' => [['label' => 'WWF — African elephant', 'url' => 'https://www.worldwildlife.org/species/african-elephant'], ['label' => 'Encyclopædia Britannica — Elephant', 'url' => 'https://www.britannica.com/animal/elephant-mammal']],
                ],
                [
                    'universe' => 'cosmia', 'illustration' => 'space', 'slug' => 'le-systeme-solaire', 'title' => 'Bienvenue dans le système solaire',
                    'summary' => 'Une étoile, huit planètes et beaucoup de voisins : embarque pour un premier voyage autour du Soleil.',
                    'keywords' => ['espace', 'planète', 'planete', 'soleil', 'étoile', 'systeme solaire'],
                    'blocks' => [
                        ['type' => 'text', 'title' => 'Notre étoile : le Soleil', 'body' => 'Le Soleil est une étoile. Il produit la lumière et la chaleur qui rendent la vie possible sur Terre. Les planètes tournent autour de lui : leur trajet s’appelle une orbite. Ne regarde jamais directement le Soleil, même avec des lunettes de soleil.'],
                        ['type' => 'text', 'title' => 'Huit planètes à rencontrer', 'body' => 'En partant du Soleil, les huit planètes sont Mercure, Vénus, la Terre, Mars, Jupiter, Saturne, Uranus et Neptune. La Terre est donc la troisième planète. Les quatre premières ont une surface rocheuse ; les quatre plus éloignées sont des planètes géantes.'],
                        ['type' => 'fact', 'title' => 'La plus grande de la famille', 'body' => 'Jupiter est la plus grande planète du système solaire. Le Soleil est bien plus grand encore, mais c’est une étoile, pas une planète !'],
                        ['type' => 'text', 'title' => 'Et la Lune ?', 'body' => 'La Lune est le satellite naturel de la Terre : elle tourne autour de notre planète. Le système solaire contient aussi des planètes naines, des astéroïdes et des comètes. Pluton fait partie des planètes naines.'],
                    ],
                    'sources' => [['label' => 'NASA Science — Solar System', 'url' => 'https://science.nasa.gov/solar-system/'], ['label' => 'NASA Science — Planets', 'url' => 'https://science.nasa.gov/solar-system/planets/']],
                ],
                [
                    'universe' => 'geoworld', 'illustration' => 'earth', 'slug' => 'bonjour-le-mali', 'title' => 'Bonjour, le Mali !',
                    'summary' => 'Découvre un pays d’Afrique de l’Ouest, ses paysages variés et le fleuve qui traverse sa capitale.',
                    'keywords' => ['Mali', 'Bamako', 'Afrique', 'Niger', 'pays', 'géographie'],
                    'blocks' => [
                        ['type' => 'text', 'title' => 'Au cœur de l’Afrique de l’Ouest', 'body' => 'Le Mali se trouve en Afrique de l’Ouest. Il n’a pas d’accès direct à la mer : on dit que c’est un pays enclavé. Ses paysages vont des espaces désertiques du Sahara, au nord, aux savanes plus au sud.'],
                        ['type' => 'text', 'title' => 'Bamako et le fleuve Niger', 'body' => 'Bamako est la capitale du Mali. La ville est située sur le fleuve Niger. Un fleuve est un cours d’eau qui se jette dans la mer ou l’océan. Le Niger traverse plusieurs pays d’Afrique de l’Ouest.'],
                        ['type' => 'fact', 'title' => 'Des noms qui se ressemblent', 'body' => 'Le fleuve Niger et le pays appelé Niger ne sont pas la même chose. Le fleuve traverse aussi le Mali !'],
                        ['type' => 'text', 'title' => 'Une histoire à explorer', 'body' => 'Le Mali possède un patrimoine très riche. Tombouctou et les villes anciennes de Djenné sont inscrites sur la Liste du patrimoine mondial de l’UNESCO. Leurs bâtiments et leurs manuscrits racontent une partie de l’histoire de la région.'],
                    ],
                    'sources' => [['label' => 'Encyclopædia Britannica — Mali', 'url' => 'https://www.britannica.com/place/Mali'], ['label' => 'UNESCO — Tombouctou', 'url' => 'https://whc.unesco.org/fr/list/119/'], ['label' => 'UNESCO — Villes anciennes de Djenné', 'url' => 'https://whc.unesco.org/fr/list/116/']],
                ],
            ];
            foreach ($articles as $a) {
                $universe = Universe::where('slug', $a['universe'])->firstOrFail();
                unset($a['universe']);
                Article::updateOrCreate(['slug' => $a['slug']], $a + ['universe_id' => $universe->id, 'age_label' => '6–12 ans', 'language' => 'fr', 'reading_minutes' => 3, 'is_demo' => true, 'status' => 'published']);
            }
            $article = Article::where('slug', 'le-systeme-solaire')->firstOrFail();
            $quiz = Quiz::updateOrCreate(['article_id' => $article->id], ['title' => 'Prêt pour le défi de l’espace ?']);
            $questions = [
                ['Qu’est-ce que le Soleil ?', ['Une planète', 'Une étoile', 'Un satellite'], 1, 'Le Soleil est une étoile : il produit sa propre lumière.'],
                ['Combien de planètes compte le système solaire ?', ['Six', 'Huit', 'Dix'], 1, 'Il compte huit planètes. Pluton est classée parmi les planètes naines.'],
                ['Quelle est la troisième planète en partant du Soleil ?', ['La Terre', 'Mars', 'Jupiter'], 0, 'Après Mercure et Vénus vient la Terre, notre planète.'],
            ];
            foreach ($questions as $i => [$prompt, $options, $correct, $explanation]) {
                Question::updateOrCreate(['quiz_id' => $quiz->id, 'position' => $i + 1], ['prompt' => $prompt, 'options' => $options, 'correct_option' => $correct, 'explanation' => $explanation]);
            }
        });
    }
}
