<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniverseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'slug' => $this->slug, 'name' => $this->name, 'theme' => $this->theme,
            'description' => $this->description, 'color' => $this->color, 'icon' => $this->icon,
            'articles_count' => $this->whenCounted('articles')];
    }
}
