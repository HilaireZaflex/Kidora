<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateEditorialUser extends Command
{
    protected $signature = 'kidora:editorial-user {--role= : super_admin, admin, editor, writer ou reviewer}';

    protected $description = 'Créer un compte éditorial avec mot de passe saisi confidentiellement (aucun compte par défaut).';

    public function handle(): int
    {
        if (! $this->input->isInteractive()) {
            $this->error('Utilisez un terminal interactif ; aucun mot de passe n’est accepté en argument.');

            return self::FAILURE;
        }
        $role = $this->option('role') ?? $this->choice('Rôle', array_keys(User::EDITORIAL_ROLES), 'writer');
        if (! isset(User::EDITORIAL_ROLES[$role])) {
            $this->error('Rôle inconnu.');

            return self::FAILURE;
        }
        $name = $this->ask('Nom professionnel');
        $email = mb_strtolower(trim((string) $this->ask('Adresse e-mail')));
        $password = $this->secret('Mot de passe (12 caractères minimum)');
        $confirmation = $this->secret('Confirmer le mot de passe');
        $validator = Validator::make(['name' => $name, 'email' => $email, 'password' => $password, 'password_confirmation' => $confirmation], ['name' => 'required|string|max:80', 'email' => 'required|email|max:254|unique:users,email', 'password' => 'required|string|min:12|max:128|confirmed']);
        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }
        $user = new User(['name' => $name, 'email' => $email, 'password' => $password]);
        $user->role = $role;
        $user->save();
        $this->info('Compte éditorial créé. Connectez-vous depuis /administration/connexion.');

        return self::SUCCESS;
    }
}
