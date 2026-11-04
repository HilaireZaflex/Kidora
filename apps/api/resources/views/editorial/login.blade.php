@extends('editorial.layout')
@section('title', 'Connexion éditoriale')
@section('content')<div class="login panel"><span class="caption">UN ESPACE RÉSERVÉ À L’ÉQUIPE</span><h1>Connexion éditoriale</h1><p>Préparer, vérifier et publier des découvertes en confiance.</p><form method="post" action="{{ route('editorial.login.store', [], false) }}">@csrf
<label for="email">Adresse e-mail</label><input id="email" type="email" name="email" autocomplete="username" required maxlength="254" value="{{ old('email') }}">
<label for="password">Mot de passe</label><input id="password" type="password" name="password" autocomplete="current-password" required maxlength="128"><button class="primary" type="submit">Se connecter</button></form><p class="help">Votre compte doit avoir été créé par l’équipe responsable. Il n’y a pas de compte ni de mot de passe par défaut.</p></div>@endsection
