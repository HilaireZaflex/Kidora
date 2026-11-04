<?php

namespace App\Policies;

use App\Models\ArticleRevision;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ArticleRevisionPolicy
{
    public function view(User $user, ArticleRevision $revision): Response
    {
        return $user->canAccessEditorial() && ($user->role !== 'writer' || $revision->article->author_id === $user->id) ? Response::allow() : Response::denyAsNotFound();
    }

    public function update(User $user, ArticleRevision $revision): bool
    {
        return $this->view($user, $revision)->allowed() && $user->hasEditorialRole(['super_admin', 'admin', 'editor', 'writer']) && in_array($revision->status, ['draft', 'changes_requested'], true);
    }

    public function submit(User $user, ArticleRevision $revision): bool
    {
        return $this->update($user, $revision);
    }

    public function review(User $user, ArticleRevision $revision): bool
    {
        return $user->hasEditorialRole(['super_admin', 'admin', 'reviewer']) && $revision->status === 'in_review'
            && $revision->author_id !== $user->id && $revision->article->author_id !== $user->id
            && ! $revision->events()->where('actor_id', $user->id)->whereIn('action', ['create', 'update'])->exists();
    }

    public function publish(User $user, ArticleRevision $revision): bool
    {
        return $user->hasEditorialRole(['super_admin', 'admin', 'editor']) && $revision->status === 'validated'
            && $revision->reviewer_id !== null && $revision->reviewer_id !== $revision->author_id;
    }
}
