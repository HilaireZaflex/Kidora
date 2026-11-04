<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ArticleRevision extends Model
{
    protected $guarded = ['id'];

    protected $attributes = ['lock_version' => 1, 'status' => 'draft'];

    public const LABELS = ['draft' => 'Brouillon', 'changes_requested' => 'Corrections demandées', 'in_review' => 'En validation', 'validated' => 'Validée', 'published' => 'Publiée'];

    protected function casts(): array
    {
        return ['content' => 'array', 'version' => 'integer', 'lock_version' => 'integer', 'reviewed_at' => 'datetime', 'published_at' => 'datetime'];
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function events(): HasMany
    {
        return $this->hasMany(EditorialEvent::class, 'revision_id')->orderByDesc('id');
    }
}
