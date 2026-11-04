<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    protected $attributes = ['is_active' => true];

    public const EDITORIAL_ROLES = ['super_admin' => 'Super administrateur', 'admin' => 'Administrateur', 'editor' => 'Éditeur', 'writer' => 'Rédacteur', 'reviewer' => 'Validateur pédagogique'];

    public function hasEditorialRole(array $roles): bool
    {
        return $this->is_active && in_array($this->role, $roles, true);
    }

    public function canAccessEditorial(): bool
    {
        return $this->hasEditorialRole(array_keys(self::EDITORIAL_ROLES));
    }

    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', 'is_active' => 'boolean',
        ];
    }
}
