<?php

namespace Database\Factories;

use App\Models\Universe;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Universe> */
class UniverseFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        return ['slug' => fake()->unique()->slug(), 'name' => fake()->words(2, true), 'theme' => 'Univers de test', 'description' => 'Un univers de démonstration.', 'color' => '#3F9BA7', 'icon' => 'science', 'position' => 1, 'status' => 'draft'];
    }

    public function published(): static
    {
        return $this->state(fn () => ['status' => 'published']);
    }
}
