<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Quiz> */
class QuizFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        return ['article_id' => Article::factory()->published(), 'title' => 'Quiz de démonstration'];
    }
}
