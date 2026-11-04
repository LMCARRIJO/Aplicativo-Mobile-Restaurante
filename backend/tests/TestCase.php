<?php

namespace Tests;

<<<<<<< HEAD
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
=======
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    //
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
}
