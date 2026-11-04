<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Question> */
class QuestionFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        return ['quiz_id' => Quiz::factory(), 'prompt' => 'Quel choix est correct dans ce test ?', 'options' => ['A', 'B', 'C'], 'correct_option' => 1, 'explanation' => 'La réponse B est la réponse de ce test.', 'position' => 1];
    }
}
