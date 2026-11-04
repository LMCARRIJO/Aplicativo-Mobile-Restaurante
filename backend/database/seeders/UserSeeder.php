<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Cria os usuários de desenvolvimento para cada perfil.
     */
    public function run(): void
    {
        $usuarios = [
            ['name' => 'Administrador', 'email' => 'admin@restaurante.test', 'role' => User::ROLE_ADMIN],
            ['name' => 'Garçom', 'email' => 'garcom@restaurante.test', 'role' => User::ROLE_GARCOM],
            ['name' => 'Cozinha', 'email' => 'cozinha@restaurante.test', 'role' => User::ROLE_COZINHA],
        ];

        foreach ($usuarios as $usuario) {
            User::updateOrCreate(
                ['email' => $usuario['email']],
                [
                    'name' => $usuario['name'],
                    'password' => Hash::make('password'),
                    'role' => $usuario['role'],
                ],
            );
        }
    }
}
