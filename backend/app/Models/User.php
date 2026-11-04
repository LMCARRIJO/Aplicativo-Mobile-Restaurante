<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
<<<<<<< HEAD
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role'])]
=======

#[Fillable(['name', 'email', 'password'])]
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
<<<<<<< HEAD
    use HasApiTokens, HasFactory, Notifiable;

    public const ROLE_ADMIN = 'admin';

    public const ROLE_GARCOM = 'garcom';

    public const ROLE_COZINHA = 'cozinha';

    public const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_GARCOM,
        self::ROLE_COZINHA,
    ];
=======
    use HasFactory, Notifiable;
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
