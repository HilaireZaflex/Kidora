<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleRevision;
use App\Models\Universe;
use App\Models\User;
use App\Services\EditorialWorkflow;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class EditorialWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private function actor(string $role): User
    {
        return User::factory()->create(['role' => $role, 'is_active' => true]);
    }

    private function content(): array
    {
        $universe = Universe::create(['slug' => 'testing', 'name' => 'Sciences', 'theme' => 'Explorer', 'description' => 'Observer le monde.', 'color' => '#245BC4', 'icon' => 'science', 'position' => 1, 'status' => 'published']);

        return ['title' => 'Les océans', 'summary' => 'Découvrir les océans.', 'universe_id' => $universe->id, 'age_label' => '6–12 ans', 'language' => 'fr', 'reading_minutes' => 3, 'illustration' => 'earth', 'country_code' => null, 'is_demo' => true, 'keywords' => ['océan'], 'blocks' => [['type' => 'text', 'title' => 'Observer', 'body' => 'Les océans abritent de nombreux êtres vivants.']], 'sources' => [['label' => 'UNESCO', 'url' => 'https://www.unesco.org/']]];
    }

    private function draft(User $actor): ArticleRevision
    {
        return app(EditorialWorkflow::class)->create($actor, 'les-oceans', $this->content());
    }

    private function transition(User $actor, ArticleRevision $revision, string $action): TestResponse
    {
        return $this->actingAs($actor)->postJson('/administration/versions/'.$revision->id.'/transition', ['lock_version' => $revision->fresh()->lock_version, 'action' => $action]);
    }

    public function test_private_pages_require_an_active_editorial_account(): void
    {
        $this->get('/administration')->assertRedirect('/administration/connexion');
        $this->getJson('/administration')->assertUnauthorized();
        $this->actingAs(User::factory()->create())->get('/administration')->assertForbidden();
        $inactive = $this->actor('admin');
        $inactive->is_active = false;
        $inactive->save();
        $this->actingAs($inactive)->get('/administration')->assertForbidden();
    }

    public function test_login_logout_and_headers(): void
    {
        $actor = $this->actor('writer');
        $this->get('/administration/connexion')->assertOk()->assertSee('Connexion')->assertHeader('X-Robots-Tag', 'noindex, nofollow');
        $this->post('/administration/connexion', ['email' => $actor->email, 'password' => 'incorrect'])->assertSessionHasErrors('email');
        $this->post('/administration/connexion', ['email' => $actor->email, 'password' => 'password'])->assertRedirect('/administration');
        $this->assertAuthenticatedAs($actor);
        $this->post('/administration/deconnexion')->assertRedirect('/administration/connexion');
        $this->assertGuest();
    }

    public function test_writer_can_create_a_private_draft_and_render_all_authoring_pages(): void
    {
        $actor = $this->actor('writer');
        $content = $this->content();
        $this->actingAs($actor)->get('/administration/articles/nouveau')->assertOk();
        $this->post('/administration/articles', $content + ['slug' => 'les-oceans'])->assertRedirect();
        $revision = ArticleRevision::firstOrFail();
        $this->get('/administration')->assertOk()->assertSee('Les océans');
        $this->get('/administration/articles/'.$revision->article_id)->assertOk();
        $this->get('/administration/versions/'.$revision->id)->assertOk();
        $this->get('/administration/versions/'.$revision->id.'/modifier')->assertOk();
        $this->getJson('/api/v1/articles/les-oceans')->assertNotFound();
        $this->getJson('/api/v1/articles')->assertJsonCount(0, 'data');
    }

    public function test_writer_cannot_access_another_authors_content_or_manage_universes(): void
    {
        $revision = $this->draft($this->actor('writer'));
        $this->actingAs($this->actor('writer'))->get('/administration/articles/'.$revision->article_id)->assertNotFound();
        $this->get('/administration/versions/'.$revision->id)->assertNotFound();
        $this->get('/administration/versions/'.$revision->id.'/modifier')->assertNotFound();
        $this->get('/administration/univers')->assertForbidden();
    }

    public function test_reviewer_cannot_author_or_publish(): void
    {
        $actor = $this->actor('reviewer');
        $this->actingAs($actor)->get('/administration/articles/nouveau')->assertForbidden();
        $this->postJson('/administration/articles', $this->content() + ['slug' => 'forbidden'])->assertForbidden();
    }

    public function test_independent_review_and_publication_are_required(): void
    {
        $writer = $this->actor('writer');
        $reviewer = $this->actor('reviewer');
        $editor = $this->actor('editor');
        $revision = $this->draft($writer);
        $this->transition($editor, $revision, 'publish')->assertForbidden();
        $this->transition($writer, $revision, 'submit')->assertRedirect();
        $this->transition($writer, $revision, 'validate')->assertForbidden();
        $this->transition($reviewer, $revision, 'validate')->assertRedirect();
        $this->transition($reviewer, $revision, 'publish')->assertForbidden();
        $this->transition($writer, $revision, 'publish')->assertForbidden();
        $this->transition($editor, $revision, 'publish')->assertRedirect();
        $response = $this->getJson('/api/v1/articles/les-oceans')->assertOk()->assertJsonPath('data.title', 'Les océans');
        foreach (['author_id', 'reviewer_id', 'editorial_version', 'revisions', 'events'] as $field) {
            $this->assertArrayNotHasKey($field, $response->json('data'));
        }
        $this->assertDatabaseCount('editorial_events', 4);
    }

    public function test_even_super_admin_cannot_validate_their_own_work(): void
    {
        $actor = $this->actor('super_admin');
        $revision = $this->draft($actor);
        $this->transition($actor, $revision, 'submit')->assertRedirect();
        $this->transition($actor, $revision, 'validate')->assertForbidden();
        $this->assertSame('in_review', $revision->fresh()->status);
    }

    public function test_a_contributor_cannot_later_validate_the_revision(): void
    {
        $writer = $this->actor('writer');
        $admin = $this->actor('admin');
        $revision = $this->draft($writer);
        $workflow = app(EditorialWorkflow::class);
        $revision = $workflow->update($admin, $revision, 1, $revision->content);
        $this->transition($writer, $revision, 'submit')->assertRedirect();
        $this->transition($admin, $revision, 'validate')->assertForbidden();
    }

    public function test_changes_require_a_comment_and_a_new_submission(): void
    {
        $writer = $this->actor('writer');
        $reviewer = $this->actor('reviewer');
        $revision = $this->draft($writer);
        $this->transition($writer, $revision, 'submit')->assertRedirect();
        $this->transition($reviewer, $revision, 'request_changes')->assertUnprocessable();
        $this->postJson('/administration/versions/'.$revision->id.'/transition', ['lock_version' => 2, 'action' => 'request_changes', 'comment' => 'Préciser la source.'])->assertRedirect();
        $revision = app(EditorialWorkflow::class)->update($writer, $revision->fresh(), 3, $revision->content);
        $this->assertSame('draft', $revision->status);
        $this->transition($reviewer, $revision, 'validate')->assertForbidden();
        $this->transition($writer, $revision, 'submit')->assertRedirect();
        $this->transition($reviewer, $revision, 'validate')->assertRedirect();
        $this->actingAs($writer)->get('/administration/versions/'.$revision->id.'/modifier')->assertForbidden();
    }

    public function test_stale_forms_cannot_overwrite_a_revision(): void
    {
        $writer = $this->actor('writer');
        $revision = $this->draft($writer);
        $workflow = app(EditorialWorkflow::class);
        $workflow->update($writer, $revision, 1, array_replace($revision->content, ['title' => 'Titre conservé']));
        $this->actingAs($writer)->postJson('/administration/versions/'.$revision->id, $revision->content + ['lock_version' => 1])->assertConflict();
        $this->assertSame('Titre conservé', $revision->fresh()->content['title']);
        $this->assertDatabaseCount('editorial_events', 2);
        $this->assertSame($revision->id, $workflow->revise($writer, $revision->article)->id);
    }

    public function test_live_content_remains_stable_until_next_publication_and_can_be_retired(): void
    {
        $writer = $this->actor('writer');
        $reviewer = $this->actor('reviewer');
        $editor = $this->actor('editor');
        $revision = $this->draft($writer);
        $this->transition($writer, $revision, 'submit')->assertRedirect();
        $this->transition($reviewer, $revision, 'validate')->assertRedirect();
        $this->transition($editor, $revision, 'publish')->assertRedirect();
        $workflow = app(EditorialWorkflow::class);
        $next = $workflow->revise($writer, $revision->article->fresh());
        $next = $workflow->update($writer, $next, 1, array_replace($next->content, ['title' => 'Nouvelle édition']));
        $this->getJson('/api/v1/articles/les-oceans')->assertJsonPath('data.title', 'Les océans');
        $this->transition($writer, $next, 'submit')->assertRedirect();
        $this->transition($reviewer, $next, 'validate')->assertRedirect();
        $this->transition($editor, $next, 'publish')->assertRedirect();
        $this->getJson('/api/v1/articles/les-oceans')->assertJsonPath('data.title', 'Nouvelle édition');
        $this->postJson('/administration/articles/'.$next->article_id.'/retirer', ['confirm' => 1, 'published_version' => 1])->assertConflict();
        $this->postJson('/administration/articles/'.$next->article_id.'/retirer', ['confirm' => 1, 'published_version' => 2])->assertRedirect();
        $this->getJson('/api/v1/articles/les-oceans')->assertNotFound();
        $this->assertDatabaseCount('article_revisions', 2);
    }

    public function test_malformed_content_and_unsafe_source_urls_are_rejected(): void
    {
        $content = $this->content();
        $this->actingAs($this->actor('writer'));
        foreach (['javascript:alert(1)', 'http://example.org'] as $url) {
            $bad = array_replace($content, ['sources' => [['label' => 'Source', 'url' => $url]]]);
            $this->postJson('/administration/articles', $bad + ['slug' => 'bad'])->assertUnprocessable()->assertJsonValidationErrors('sources.0.url');
        }
        $bad = array_replace($content, ['blocks' => [['type' => 'text', 'title' => ['malformed'], 'body' => 'Texte']]]);
        $this->postJson('/administration/articles', $bad + ['slug' => 'bad'])->assertUnprocessable()->assertJsonValidationErrors('blocks.0.title');
        $this->assertDatabaseCount('articles', 0);
    }

    public function test_html_is_escaped_in_private_preview(): void
    {
        $writer = $this->actor('writer');
        $content = array_replace($this->content(), ['title' => '<script>alert(1)</script>']);
        $revision = app(EditorialWorkflow::class)->create($writer, 'escaped', $content);
        $this->actingAs($writer)->get('/administration/versions/'.$revision->id)->assertOk()->assertSee('&lt;script&gt;alert(1)&lt;/script&gt;', false)->assertDontSee('<script>', false);
    }

    public function test_only_administrators_can_manage_universes_and_slugs_are_stable(): void
    {
        $this->actingAs($this->actor('admin'))->get('/administration/univers')->assertOk();
        $universe = Universe::findOrFail($this->content()['universe_id']);
        $data = $universe->only(['name', 'theme', 'description', 'color', 'icon', 'position']);
        $this->post('/administration/univers/'.$universe->id, $data)->assertRedirect();
        $this->postJson('/administration/univers/'.$universe->id, $data + ['slug' => 'changed'])->assertUnprocessable();
        $this->assertSame('testing', $universe->fresh()->slug);
        $this->actingAs($this->actor('editor'))->get('/administration/univers')->assertForbidden();
    }

    public function test_demo_seed_preserves_an_editorial_revision(): void
    {
        $this->seed(DatabaseSeeder::class);
        $article = Article::where('slug', 'les-secrets-des-elephants')->firstOrFail();
        $revision = app(EditorialWorkflow::class)->revise($this->actor('editor'), $article);
        $article->update(['title' => 'Titre éditorial conservé']);
        $this->seed(DatabaseSeeder::class);
        $this->assertSame('Titre éditorial conservé', $article->fresh()->title);
        $this->assertDatabaseHas('article_revisions', ['id' => $revision->id]);
    }

    public function test_login_is_throttled_and_malformed_identity_is_rejected(): void
    {
        $this->postJson('/administration/connexion', ['email' => ['invalid'], 'password' => 'incorrect'])->assertUnprocessable();
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/administration/connexion', ['email' => 'missing@example.test', 'password' => 'incorrect'])->assertUnprocessable();
        }
        $this->postJson('/administration/connexion', ['email' => 'missing@example.test', 'password' => 'incorrect'])->assertStatus(429);
    }

    public function test_client_cannot_choose_author_or_publication_status(): void
    {
        $writer = $this->actor('writer');
        $this->actingAs($writer)->post('/administration/articles', $this->content() + ['slug' => 'forged', 'status' => 'published', 'role' => 'admin', 'author_id' => 999, 'reviewer_id' => $writer->id])->assertRedirect();
        $article = Article::firstOrFail();
        $this->assertSame('draft', $article->status);
        $this->assertSame($writer->id, $article->author_id);
        $this->assertSame('writer', $writer->fresh()->role);
        $this->assertNull($article->revisions()->firstOrFail()->reviewer_id);
    }

    public function test_invalid_nested_form_can_be_displayed_again_without_a_server_error(): void
    {
        $this->actingAs($this->actor('writer'));
        $bad = array_replace($this->content(), ['blocks' => [['type' => 'text', 'title' => ['invalid'], 'body' => 'Texte']]]);
        $this->post('/administration/articles', $bad + ['slug' => 'bad'])->assertRedirect('/administration/articles/nouveau');
        $this->get('/administration/articles/nouveau')->assertOk()->assertSee('Vérifiez le formulaire.');
    }

    public function test_demo_seed_preserves_an_edited_universe(): void
    {
        $this->seed(DatabaseSeeder::class);
        $universe = Universe::where('slug', 'animalia')->firstOrFail();
        $data = array_replace($universe->only(['name', 'theme', 'description', 'color', 'icon', 'position']), ['name' => 'Animalia édité']);
        $this->actingAs($this->actor('admin'))->post('/administration/univers/'.$universe->id, $data)->assertRedirect();
        $this->seed(DatabaseSeeder::class);
        $this->assertSame('Animalia édité', $universe->fresh()->name);
    }

    public function test_demo_seed_does_not_republish_a_retired_legacy_article(): void
    {
        $this->seed(DatabaseSeeder::class);
        $article = Article::where('slug', 'les-secrets-des-elephants')->firstOrFail();
        $this->actingAs($this->actor('admin'))->post('/administration/articles/'.$article->id.'/retirer', ['confirm' => 1, 'published_version' => 0])->assertRedirect();
        $this->seed(DatabaseSeeder::class);
        $this->assertSame('archived', $article->fresh()->status);
        $this->getJson('/api/v1/articles/les-secrets-des-elephants')->assertNotFound();
    }
}
