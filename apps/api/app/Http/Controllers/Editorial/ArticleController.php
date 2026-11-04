<?php

namespace App\Http\Controllers\Editorial;

use App\Http\Controllers\Controller;
use App\Http\Requests\Editorial\ArticleContentRequest;
use App\Models\Article;
use App\Models\Universe;
use App\Services\EditorialWorkflow;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ArticleController extends Controller
{
    public function index(Request $request): View
    {
        $input = $request->validate(['q' => ['nullable', 'string', 'max:100']]);
        $query = Article::visibleTo($request->user())->with('universe')->orderByDesc('updated_at')->orderByDesc('id');
        if (! empty($input['q'])) {
            $query->where('title', 'ilike', '%'.addcslashes($input['q'], '%_\\').'%');
        }

        return view('editorial.articles', ['articles' => $query->paginate(20)->withQueryString(), 'query' => $input['q'] ?? '']);
    }

    public function create(): View
    {
        Gate::authorize('create', Article::class);

        return view('editorial.form', ['revision' => null, 'content' => ['language' => 'fr', 'is_demo' => true, 'age_label' => '6–12 ans', 'reading_minutes' => 3, 'illustration' => 'book'], 'universes' => Universe::where('status', 'published')->orderBy('position')->get()]);
    }

    public function store(ArticleContentRequest $request, EditorialWorkflow $workflow): RedirectResponse
    {
        $revision = $workflow->create($request->user(), $request->validated('slug'), $request->content());

        return redirect()->away(route('editorial.revisions.show', $revision, false))->with('status', 'Brouillon créé. Il reste privé jusqu’à sa validation et sa publication.');
    }

    public function show(Request $request, Article $article): View
    {
        Gate::authorize('view', $article);

        return view('editorial.article', ['article' => $article->load('universe'), 'revisions' => $article->revisions()->with('author', 'reviewer')->get(), 'events' => $article->events()->with('actor')->limit(100)->get()]);
    }

    public function revise(Request $request, Article $article, EditorialWorkflow $workflow): RedirectResponse
    {
        $revision = $workflow->revise($request->user(), $article);

        return redirect()->away(route('editorial.revisions.show', $revision, false));
    }

    public function archive(Request $request, Article $article, EditorialWorkflow $workflow): RedirectResponse
    {
        $data = $request->validate(['published_version' => ['required', 'integer', 'min:0'], 'confirm' => ['accepted']]);
        $workflow->archive($request->user(), $article, (int) $data['published_version']);

        return redirect()->away(route('editorial.articles.show', $article, false))->with('status', 'La fiche a été retirée du catalogue public. Son historique est conservé.');
    }
}
