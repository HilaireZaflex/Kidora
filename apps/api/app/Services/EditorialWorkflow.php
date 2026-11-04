<?php

namespace App\Services;

use App\Models\Article;
use App\Models\ArticleRevision;
use App\Models\EditorialEvent;
use App\Models\Universe;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class EditorialWorkflow
{
    public const CONTENT_FIELDS = ['title', 'summary', 'universe_id', 'illustration', 'country_code', 'age_label', 'language', 'reading_minutes', 'is_demo', 'keywords', 'blocks', 'sources'];

    public function create(User $actor, string $slug, array $content): ArticleRevision
    {
        Gate::forUser($actor)->authorize('create', Article::class);

        return DB::transaction(function () use ($actor, $slug, $content) {
            $article = Article::create($content + ['slug' => $slug, 'status' => 'draft', 'author_id' => $actor->id]);

            return $this->newRevision($actor, $article, $content);
        });
    }

    public function revise(User $actor, Article $article): ArticleRevision
    {
        return DB::transaction(function () use ($actor, $article) {
            $article = Article::lockForUpdate()->findOrFail($article->id);
            Gate::forUser($actor)->authorize('revise', $article);
            $active = $article->revisions()->where('status', '!=', 'published')->first();
            if ($active) {
                return $active;
            }

            return $this->newRevision($actor, $article, $article->only(self::CONTENT_FIELDS));
        });
    }

    private function newRevision(User $actor, Article $article, array $content): ArticleRevision
    {
        $revision = $article->revisions()->create(['author_id' => $actor->id, 'version' => ($article->revisions()->max('version') ?? 0) + 1, 'status' => 'draft', 'content' => $content]);
        $this->record($actor, $article, $revision, 'create');

        return $revision;
    }

    public function update(User $actor, ArticleRevision $revision, int $lockVersion, array $content): ArticleRevision
    {
        return $this->mutate($actor, $revision, $lockVersion, 'update', function (ArticleRevision $current) use ($content) {
            $current->content = $content;
            $current->status = 'draft';
            $current->reviewer_id = null;
            $current->reviewed_at = null;
        });
    }

    public function transition(User $actor, ArticleRevision $revision, int $lockVersion, string $action, ?string $comment = null): ArticleRevision
    {
        $ability = match ($action) {
            'submit' => 'submit', 'validate', 'request_changes' => 'review', 'publish' => 'publish', default => abort(422, 'Action inconnue.')
        };

        return $this->mutate($actor, $revision, $lockVersion, $ability, function (ArticleRevision $current, Article $article) use ($actor, $action) {
            if ($action === 'submit') {
                $current->status = 'in_review';
            }
            if ($action === 'request_changes') {
                $current->status = 'changes_requested';
                $current->reviewer_id = null;
                $current->reviewed_at = null;
            }
            if ($action === 'validate') {
                $current->status = 'validated';
                $current->reviewer_id = $actor->id;
                $current->reviewed_at = now();
            }
            if ($action === 'publish') {
                abort_unless(Universe::whereKey($current->content['universe_id'])->where('status', 'published')->exists(), 409, 'L’univers doit être publié.');
                $article->fill($current->content);
                $article->status = 'published';
                $article->editorial_version = $current->version;
                $article->save();
                $current->status = 'published';
                $current->published_at = now();
            }
        }, $action, $comment);
    }

    private function mutate(User $actor, ArticleRevision $revision, int $lockVersion, string $ability, callable $change, ?string $action = null, ?string $comment = null): ArticleRevision
    {
        return DB::transaction(function () use ($actor, $revision, $lockVersion, $ability, $change, $action, $comment) {
            $article = Article::lockForUpdate()->findOrFail($revision->article_id);
            $current = ArticleRevision::with('article')->lockForUpdate()->findOrFail($revision->id);
            Gate::forUser($actor)->authorize('view', $current);
            abort_unless($current->lock_version === $lockVersion, 409, 'Cette version a changé. Rechargez la page avant de poursuivre.');
            Gate::forUser($actor)->authorize($ability, $current);
            $change($current, $article);
            $current->lock_version++;
            $current->save();
            $this->record($actor, $article, $current, $action ?? $ability, $comment);

            return $current;
        });
    }

    public function archive(User $actor, Article $article, int $publishedVersion): void
    {
        DB::transaction(function () use ($actor, $article, $publishedVersion) {
            $article = Article::lockForUpdate()->findOrFail($article->id);
            Gate::forUser($actor)->authorize('archive', $article);
            abort_unless($article->editorial_version === $publishedVersion, 409, 'La version publiée a changé.');
            $article->update(['status' => 'archived']);
            $this->record($actor, $article, null, 'unpublish');
        });
    }

    private function record(User $actor, Article $article, ?ArticleRevision $revision, string $action, ?string $comment = null): void
    {
        EditorialEvent::create(['actor_id' => $actor->id, 'article_id' => $article->id, 'revision_id' => $revision?->id, 'action' => $action, 'comment' => $comment]);
    }
}
