<?php

namespace App\Http\Controllers;

use App\Http\Resources\ArticleResource;
use App\Http\Resources\UniverseResource;
use App\Models\Article;
use App\Models\Universe;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CatalogController extends Controller
{
    public function universes(): AnonymousResourceCollection
    {
        return UniverseResource::collection(Universe::where('status', 'published')->withCount(['articles' => fn ($q) => $q->published()])->orderBy('position')->get());
    }

    public function universe(string $slug): UniverseResource
    {
        $universe = Universe::where('status', 'published')->where('slug', $slug)->firstOrFail();

        return (new UniverseResource($universe))->additional(['articles' => ArticleResource::collection($universe->articles()->published()->with('universe')->orderBy('id')->limit(50)->get())]);
    }

    public function articles(Request $request): AnonymousResourceCollection
    {
        $input = $request->validate(['q' => ['nullable', 'string', 'max:100'], 'page' => ['nullable', 'integer', 'min:1', 'max:10000']]);
        $q = trim($input['q'] ?? '');
        $query = Article::published()->with('universe')->orderBy('id');
        if ($q !== '') {
            $tokens = preg_split('/[^\\p{L}\\p{N}]+/u', $q, -1, PREG_SPLIT_NO_EMPTY);
            $terms = implode(' & ', array_map(fn (string $token): string => $token.':*', $tokens));
            if ($terms === '') {
                $query->whereRaw('1 = 0');
            } else {
                $query->where(function ($builder) use ($terms) {
                    $builder->whereRaw("to_tsvector('simple', title || ' ' || summary || ' ' || jsonb_path_query_array(blocks, '$[*].body')::text || ' ' || jsonb_path_query_array(blocks, '$[*].title')::text || ' ' || keywords::text) @@ to_tsquery('simple', ?)", [$terms])
                        ->orWhereHas('universe', fn ($universe) => $universe->whereRaw("to_tsvector('simple', name || ' ' || theme) @@ to_tsquery('simple', ?)", [$terms]));
                });
            }
        }

        return ArticleResource::collection($query->paginate(30));
    }

    public function article(string $slug): ArticleResource
    {
        return new ArticleResource(Article::published()->where('slug', $slug)->with(['universe', 'quiz.questions'])->firstOrFail());
    }
}
