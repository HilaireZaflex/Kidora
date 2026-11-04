<?php

namespace App\Http\Controllers\Editorial;

use App\Http\Controllers\Controller;
use App\Models\EditorialEvent;
use App\Models\Universe;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UniverseController extends Controller
{
    public function index(): View
    {
        return view('editorial.universes', ['universes' => Universe::orderBy('position')->get()]);
    }

    public function save(Request $request, ?Universe $universe = null): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'], 'theme' => ['required', 'string', 'max:120'], 'description' => ['required', 'string', 'max:1500'],
            'color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'], 'icon' => ['required', Rule::in(['animal', 'science', 'space', 'earth', 'nature', 'body', 'history', 'tech', 'volcano', 'culture', 'why', 'art', 'logic', 'book', 'future'])],
            'position' => ['required', 'integer', 'between:1,999'],
            'slug' => $universe?->exists ? ['prohibited'] : ['required', 'string', 'max:80', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'unique:universes,slug'],
        ]);
        DB::transaction(function () use ($request, $universe, $data) {
            if ($universe?->exists) {
                $universe->update($data);
            } else {
                $universe = Universe::create($data + ['status' => 'published']);
            }
            EditorialEvent::create(['actor_id' => $request->user()->id, 'universe_id' => $universe->id, 'action' => 'universe_saved']);
        });

        return redirect()->away(route('editorial.universes.index', [], false))->with('status', 'Univers enregistré. Ses informations sont visibles dans le catalogue.');
    }
}
