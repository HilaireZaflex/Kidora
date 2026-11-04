@extends('editorial.layout')
@section('title', 'Univers')
@section('content')<h1>Univers</h1><p>Les noms et les descriptions sont lus par l’encyclopédie. Les adresses existantes restent stables pour préserver les liens. Un nouvel univers est immédiatement visible ; ses fiches suivent leur propre validation.</p>
@foreach($universes as $universe)<details class="panel"><summary>{{ $universe->name }} · {{ $universe->slug }}</summary>@include('editorial.universe-form', ['universe'=>$universe])</details>@endforeach
<details class="panel"><summary>Créer un univers</summary>@include('editorial.universe-form', ['universe'=>null])</details>@endsection
