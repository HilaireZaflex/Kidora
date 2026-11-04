<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ArticlePolicy
{
    public function view(User $user, Article $article): Response
    {
        return $user->canAccessEditorial() && ($user->role !== 'writer' || $article->author_id === $user->id) ? Response::allow() : Response::denyAsNotFound();
    }

    public function create(User $user): bool
    {
        return $user->hasEditorialRole(['super_admin', 'admin', 'editor', 'writer']);
    }

    public function revise(User $user, Article $article): bool
    {
        return $this->create($user) && $this->view($user, $article)->allowed();
    }

    public function archive(User $user, Article $article): bool
    {
        return $user->hasEditorialRole(['super_admin', 'admin', 'editor']) && $article->status === 'published';
    }
}
