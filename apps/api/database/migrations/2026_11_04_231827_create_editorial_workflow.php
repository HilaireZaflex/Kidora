<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['super_admin', 'admin', 'editor', 'writer', 'reviewer'])->nullable();
            $table->boolean('is_active')->default(true);
        });
        Schema::table('articles', function (Blueprint $table) {
            $table->foreignId('author_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->unsignedInteger('editorial_version')->default(0);
        });
        Schema::create('article_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->unsignedInteger('version');
            $table->unsignedInteger('lock_version')->default(1);
            $table->enum('status', ['draft', 'changes_requested', 'in_review', 'validated', 'published'])->default('draft');
            $table->jsonb('content');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->unique(['article_id', 'version']);
            $table->index(['status', 'updated_at']);
        });
        DB::statement("CREATE UNIQUE INDEX one_active_article_revision ON article_revisions (article_id) WHERE status <> 'published'");
        Schema::create('editorial_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('article_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('revision_id')->nullable()->constrained('article_revisions')->cascadeOnDelete();
            $table->foreignId('universe_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('action', 40);
            $table->text('comment')->nullable();
            $table->timestamps();
            $table->index(['article_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('editorial_events');
        Schema::dropIfExists('article_revisions');
        Schema::table('articles', function (Blueprint $table) {
            $table->dropConstrainedForeignId('author_id');
            $table->dropColumn('editorial_version');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'is_active']);
        });
    }
};
