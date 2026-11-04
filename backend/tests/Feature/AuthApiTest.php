<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_retorna_token_e_usuario(): void
    {
        $usuario = User::factory()->admin()->create([
            'email' => 'admin@restaurante.test',
            'password' => 'password',
        ]);

        $resposta = $this->postJson('/api/login', [
            'email' => 'admin@restaurante.test',
            'password' => 'password',
        ]);

        $resposta->assertOk()
            ->assertJsonPath('data.token_type', 'Bearer')
            ->assertJsonPath('data.usuario.id', $usuario->id)
            ->assertJsonPath('data.usuario.email', 'admin@restaurante.test')
            ->assertJsonPath('data.usuario.role', User::ROLE_ADMIN);

        $this->assertNotEmpty($resposta->json('data.token'));
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $usuario->id,
            'name' => 'expo-mobile',
        ]);
    }

    public function test_login_rejeita_credenciais_invalidas_com_401(): void
    {
        User::factory()->create([
            'email' => 'admin@restaurante.test',
            'password' => 'password',
        ]);

        $this->postJson('/api/login', [
            'email' => 'admin@restaurante.test',
            'password' => 'senha-errada',
        ])
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Credenciais inválidas.');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_login_valida_campos_obrigatorios(): void
    {
        $this->postJson('/api/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_me_retorna_usuario_autenticado(): void
    {
        User::factory()->cozinha()->create([
            'email' => 'cozinha@restaurante.test',
            'password' => 'password',
        ]);

        $token = $this->postJson('/api/login', [
            'email' => 'cozinha@restaurante.test',
            'password' => 'password',
        ])->json('data.token');

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'cozinha@restaurante.test')
            ->assertJsonPath('data.role', User::ROLE_COZINHA);
    }

    public function test_logout_revoga_apenas_o_token_atual(): void
    {
        User::factory()->garcom()->create([
            'email' => 'garcom@restaurante.test',
            'password' => 'password',
        ]);

        $login = fn () => $this->postJson('/api/login', [
            'email' => 'garcom@restaurante.test',
            'password' => 'password',
        ])->json('data.token');

        $primeiroToken = $login();
        $segundoToken = $login();

        $this->assertDatabaseCount('personal_access_tokens', 2);

        $this->withToken($primeiroToken)
            ->postJson('/api/logout')
            ->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 1);

        $this->app['auth']->forgetGuards();

        $this->withToken($primeiroToken)
            ->getJson('/api/me')
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this->withToken($segundoToken)
            ->getJson('/api/me')
            ->assertOk();
    }
}
