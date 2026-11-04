<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Universe;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Article> */
class ArticleFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        return ['universe_id' => Universe::factory()->published(), 'slug' => fake()->unique()->slug(), 'title' => 'Une découverte de test', 'illustration' => 'book', 'summary' => 'Résumé de démonstration.', 'age_label' => '6–12 ans', 'language' => 'fr', 'reading_minutes' => 2, 'blocks' => [['type' => 'text', 'title' => 'Observer', 'body' => 'Un texte de test.']], 'sources' => [], 'keywords' => ['test'], 'is_demo' => true, 'status' => 'draft'];
    }

    public function published(): static
    {
        return $this->state(fn () => ['status' => 'published']);
    }
}
