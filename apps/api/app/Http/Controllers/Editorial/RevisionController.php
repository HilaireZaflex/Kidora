<?php

namespace App\Http\Controllers\Editorial;

use App\Http\Controllers\Controller;
use App\Http\Requests\Editorial\ArticleContentRequest;
use App\Models\ArticleRevision;
use App\Models\Universe;
use App\Services\EditorialWorkflow;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class RevisionController extends Controller
{
    public function show(ArticleRevision $revision): View
    {
        $revision->load('article', 'author', 'reviewer');
        Gate::authorize('view', $revision);

        return view('editorial.revision', ['revision' => $revision, 'events' => $revision->events()->with('actor')->limit(100)->get()]);
    }

    public function edit(ArticleRevision $revision): View
    {
        $revision->load('article');
        Gate::authorize('view', $revision);
        Gate::authorize('update', $revision);

        return view('editorial.form', ['revision' => $revision, 'content' => $revision->content, 'universes' => Universe::where('status', 'published')->orderBy('position')->get()]);
    }

    public function update(ArticleContentRequest $request, ArticleRevision $revision, EditorialWorkflow $workflow): RedirectResponse
    {
        $workflow->update($request->user(), $revision, $request->integer('lock_version'), $request->content());

        return redirect()->away(route('editorial.revisions.show', $revision, false))->with('status', 'Révision enregistrée. La version publique n’a pas changé.');
    }

    public function transition(Request $request, ArticleRevision $revision, EditorialWorkflow $workflow): RedirectResponse
    {
        $data = $request->validate(['lock_version' => ['required', 'integer', 'min:1'], 'action' => ['required', Rule::in(['submit', 'validate', 'request_changes', 'publish'])], 'comment' => ['nullable', 'string', 'max:1000', 'required_if:action,request_changes']]);
        $workflow->transition($request->user(), $revision, (int) $data['lock_version'], $data['action'], $data['comment'] ?? null);

        return redirect()->away(route('editorial.revisions.show', $revision, false))->with('status', 'Le changement d’état a été enregistré.');
    }
}
