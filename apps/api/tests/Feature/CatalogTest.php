<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Quiz;
use App\Models\Universe;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_postgresql_is_connected(): void
    {
        $this->getJson('/api/v1/health')->assertOk()->assertJson(['status' => 'ok', 'database' => 'connected']);
    }

    public function test_fifteen_universes_and_only_available_articles_are_counted(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->getJson('/api/v1/universes')->assertOk()->assertJsonCount(15, 'data')->assertJsonPath('data.0.articles_count', 1);
    }

    public function test_draft_articles_are_excluded_from_all_public_paths(): void
    {
        $this->seed(DatabaseSeeder::class);

        $article = Article::where('slug', 'les-secrets-des-elephants')->firstOrFail();
        $article->update(['status' => 'draft']);
        $this->getJson('/api/v1/articles')->assertJsonCount(2, 'data');
        $this->getJson('/api/v1/articles/'.$article->slug)->assertNotFound();
        $this->getJson('/api/v1/universes/animalia')->assertJsonCount(0, 'articles');
        $this->getJson('/api/v1/universes')->assertJsonPath('data.0.articles_count', 0);
    }

    public function test_draft_universes_also_hide_their_articles(): void
    {
        $this->seed(DatabaseSeeder::class);

        Universe::where('slug', 'cosmia')->update(['status' => 'draft']);
        $this->getJson('/api/v1/universes/cosmia')->assertNotFound();
        $this->getJson('/api/v1/articles/le-systeme-solaire')->assertNotFound();
        $this->getJson('/api/v1/articles')->assertJsonCount(2, 'data');
    }

    public function test_search_is_case_insensitive_and_finds_keywords(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->getJson('/api/v1/articles?q=mALI')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.slug', 'bonjour-le-mali');
        $this->getJson('/api/v1/articles?q=elephant')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.slug', 'les-secrets-des-elephants');
    }

    public function test_search_treats_wildcards_as_literal_and_validates_input(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->getJson('/api/v1/articles?q=%25')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/v1/articles?q='.str_repeat('a', 101))->assertUnprocessable();
        $this->getJson('/api/v1/articles?q[]=mali')->assertUnprocessable();
    }

    public function test_article_has_blocks_and_sources_but_does_not_leak_quiz_answers(): void
    {
        $this->seed(DatabaseSeeder::class);

        $response = $this->getJson('/api/v1/articles/le-systeme-solaire')->assertOk()->assertJsonPath('data.is_demo', true)->assertJsonCount(3, 'data.quiz.questions');
        $this->assertNotEmpty($response->json('data.blocks'));
        $this->assertNotEmpty($response->json('data.sources'));
        $this->assertArrayNotHasKey('correct_option', $response->json('data.quiz.questions.0'));
        $this->assertArrayNotHasKey('explanation', $response->json('data.quiz.questions.0'));
    }

    public function test_quiz_grades_correct_and_wrong_answers_with_explanations(): void
    {
        $this->seed(DatabaseSeeder::class);

        $quiz = Quiz::with('questions')->firstOrFail();
        $answers = $quiz->questions->map(fn ($q, $i) => ['question_id' => $q->id, 'option' => [0, 1, 0][$i]])->all();
        $this->postJson('/api/v1/quizzes/'.$quiz->id.'/submit', ['answers' => $answers])->assertOk()->assertJsonPath('score', 2)->assertJsonPath('total', 3)->assertJsonPath('results.0.correct', false)->assertJsonPath('results.0.correct_option', 1)->assertJsonStructure(['results' => [['question_id', 'correct', 'correct_option', 'explanation']]]);
    }

    public function test_invalid_incomplete_and_duplicate_quiz_answers_are_refused(): void
    {
        $this->seed(DatabaseSeeder::class);

        $quiz = Quiz::with('questions')->firstOrFail();
        $url = '/api/v1/quizzes/'.$quiz->id.'/submit';
        $this->postJson($url, ['answers' => []])->assertUnprocessable();
        $answers = $quiz->questions->map(fn ($q) => ['question_id' => $q->id, 'option' => 99])->all();
        $this->postJson($url, ['answers' => $answers])->assertUnprocessable();
        $this->postJson($url, ['answers' => array_fill(0, 3, ['question_id' => $quiz->questions->first()->id, 'option' => 1])])->assertUnprocessable();
        $answers = $quiz->questions->map(fn ($q, $i) => ['question_id' => $q->id, 'option' => [1, 1, 0][$i]])->all();
        $answers[0]['question_id'] = 99999;
        $this->postJson($url, ['answers' => $answers])->assertUnprocessable();
    }

    public function test_quiz_of_unpublished_article_is_not_accessible(): void
    {
        $this->seed(DatabaseSeeder::class);

        $quiz = Quiz::firstOrFail();
        $quiz->article->update(['status' => 'draft']);
        $this->postJson('/api/v1/quizzes/'.$quiz->id.'/submit', [])->assertNotFound();
    }

    public function test_demo_seed_is_repeatable(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->seed(DatabaseSeeder::class);
        $this->assertDatabaseCount('universes', 15);
        $this->assertDatabaseCount('articles', 3);
        $this->assertDatabaseCount('quizzes', 1);
        $this->assertDatabaseCount('questions', 3);
    }

    public function test_missing_resources_return_json_404(): void
    {
        $this->getJson('/api/v1/articles/absent')->assertNotFound();
        $this->getJson('/api/v1/universes/absent')->assertNotFound();
    }

    public function test_catalog_reads_do_not_consume_the_quiz_submission_budget(): void
    {
        $this->seed(DatabaseSeeder::class);
        $quiz = Quiz::with('questions')->firstOrFail();
        $answers = $quiz->questions->map(fn ($question, $index) => ['question_id' => $question->id, 'option' => [1, 1, 0][$index]])->all();

        for ($i = 0; $i < 35; $i++) {
            $this->getJson('/api/v1/universes')->assertOk();
        }

        $this->postJson('/api/v1/quizzes/'.$quiz->id.'/submit', ['answers' => $answers])->assertOk()->assertJsonPath('score', 3);
    }

    public function test_geographic_article_exposes_its_country_link(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->getJson('/api/v1/universes/geoworld')->assertOk()->assertJsonPath('articles.0.country_code', 'MLI');
        $this->getJson('/api/v1/articles/bonjour-le-mali')->assertOk()->assertJsonPath('data.country_code', 'MLI');
        $this->getJson('/api/v1/articles/le-systeme-solaire')->assertOk()->assertJsonPath('data.country_code', null);
    }
}
