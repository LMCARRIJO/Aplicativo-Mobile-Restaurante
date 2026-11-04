<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    protected function autenticarComo(string $perfil = User::ROLE_ADMIN): User
    {
        $usuario = User::factory()->make(['role' => $perfil]);
        Sanctum::actingAs($usuario);

        return $usuario;
    }
}
