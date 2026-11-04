<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = ['id' => $this->id, 'slug' => $this->slug, 'title' => $this->title,
            'summary' => $this->summary, 'illustration' => $this->illustration, 'age_label' => $this->age_label,
            'reading_minutes' => $this->reading_minutes, 'is_demo' => $this->is_demo,
            'universe' => new UniverseResource($this->whenLoaded('universe'))];
        if ($this->relationLoaded('quiz')) {
            $data['blocks'] = $this->blocks;
            $data['sources'] = $this->sources;
            $data['quiz'] = $this->quiz ? ['id' => $this->quiz->id, 'title' => $this->quiz->title,
                'questions' => $this->quiz->questions->map(fn ($q) => ['id' => $q->id, 'prompt' => $q->prompt, 'options' => $q->options])] : null;
        }

        return $data;
    }
}
