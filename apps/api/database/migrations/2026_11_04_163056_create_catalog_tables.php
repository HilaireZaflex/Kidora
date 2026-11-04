<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('universes', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('theme');
            $table->text('description');
            $table->string('color', 7);
            $table->string('icon');
            $table->unsignedSmallInteger('position');
            $table->string('status')->default('draft')->index();
            $table->timestamps();
        });
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('universe_id')->constrained()->restrictOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('summary');
            $table->string('age_label');
            $table->string('language', 10)->default('fr');
            $table->unsignedSmallInteger('reading_minutes');
            $table->jsonb('blocks');
            $table->jsonb('sources');
            $table->jsonb('keywords');
            $table->boolean('is_demo')->default(true);
            $table->string('status')->default('draft')->index();
            $table->timestamps();
            $table->index(['universe_id', 'status']);
        });
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->timestamps();
        });
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $table->text('prompt');
            $table->jsonb('options');
            $table->unsignedSmallInteger('correct_option');
            $table->text('explanation');
            $table->unsignedSmallInteger('position');
            $table->timestamps();
            $table->unique(['quiz_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('articles');
        Schema::dropIfExists('universes');
    }
};
