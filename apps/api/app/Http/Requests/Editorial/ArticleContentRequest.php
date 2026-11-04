<?php

namespace App\Http\Requests\Editorial;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ArticleContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccessEditorial() ?? false;
    }

    protected function prepareForValidation(): void
    {
        $blocks = $this->input('blocks', []);
        $sources = $this->input('sources', []);
        if (is_array($blocks)) {
            $blocks = array_values(array_filter($blocks, fn ($b) => ! is_array($b) || (is_string($b['title'] ?? '') ? trim($b['title'] ?? '') : 'invalid') !== '' || (is_string($b['body'] ?? '') ? trim($b['body'] ?? '') : 'invalid') !== ''));
        }
        if (is_array($sources)) {
            $sources = array_values(array_filter($sources, fn ($s) => ! is_array($s) || (is_string($s['url'] ?? '') ? trim($s['url'] ?? '') : 'invalid') !== '' || (is_string($s['label'] ?? '') ? trim($s['label'] ?? '') : 'invalid') !== ''));
        }
        $keywords = is_string($this->input('keywords_text')) ? array_values(array_filter(array_map('trim', preg_split('/[,\n]+/u', $this->input('keywords_text')) ?: []))) : [];
        $this->merge(['blocks' => $blocks, 'sources' => $sources, 'keywords' => $keywords, 'is_demo' => $this->boolean('is_demo')]);
    }

    public function rules(): array
    {
        return [
            'slug' => $this->routeIs('editorial.articles.store') ? ['required', 'string', 'max:100', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'unique:articles,slug'] : ['prohibited'],
            'lock_version' => $this->routeIs('editorial.revisions.update') ? ['required', 'integer', 'min:1'] : ['prohibited'],
            'title' => ['required', 'string', 'max:180'], 'summary' => ['required', 'string', 'max:600'],
            'universe_id' => ['required', 'integer', Rule::exists('universes', 'id')->where('status', 'published')],
            'illustration' => ['required', Rule::in(['animal', 'elephant', 'science', 'space', 'earth', 'nature', 'body', 'history', 'tech', 'volcano', 'culture', 'why', 'art', 'logic', 'book', 'future'])],
            'country_code' => ['nullable', 'string', 'size:3', 'regex:/^[A-Z]{3}$/'],
            'age_label' => ['required', Rule::in(['6–8 ans', '9–10 ans', '11–12 ans', '6–12 ans'])],
            'language' => ['required', Rule::in(['fr'])], 'reading_minutes' => ['required', 'integer', 'between:1,30'],
            'is_demo' => ['boolean'], 'keywords' => ['array', 'max:20'], 'keywords.*' => ['string', 'max:60'],
            'blocks' => ['required', 'array', 'min:1', 'max:6'], 'blocks.*' => ['array:type,title,body'],
            'blocks.*.type' => ['required', Rule::in(['text', 'fact'])], 'blocks.*.title' => ['required', 'string', 'max:160'], 'blocks.*.body' => ['required', 'string', 'max:10000'],
            'sources' => ['required', 'array', 'min:1', 'max:3'], 'sources.*' => ['array:label,url'],
            'sources.*.label' => ['required', 'string', 'max:160'], 'sources.*.url' => ['required', 'string', 'max:1000', 'url:https'],
        ];
    }

    public function content(): array
    {
        return $this->safe()->except(['slug', 'lock_version']);
    }
}
