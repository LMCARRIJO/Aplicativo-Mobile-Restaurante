<?php

namespace Tests\Feature;

use App\Models\Mesa;
use App\Models\Pedido;
use App\Models\Produto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AutorizacaoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_rotas_protegidas_retornam_401_sem_token(): void
    {
        $this->getJson('/api/produtos')->assertUnauthorized();
        $this->getJson('/api/mesas')->assertUnauthorized();
        $this->getJson('/api/pedidos')->assertUnauthorized();
        $this->getJson('/api/cozinha/fila')->assertUnauthorized();
        $this->get('/api/produtos')->assertUnauthorized();
    }

    public function test_garcom_nao_cria_produto_e_recebe_403(): void
    {
        Sanctum::actingAs(User::factory()->garcom()->create());

        $this->postJson('/api/produtos', [
            'nome' => 'Produto do garçom',
            'preco' => 10,
        ])->assertForbidden();

        $this->assertDatabaseMissing('produtos', ['nome' => 'Produto do garçom']);
    }

    public function test_garcom_nao_cria_mesa_e_recebe_403(): void
    {
        Sanctum::actingAs(User::factory()->garcom()->create());

        $this->postJson('/api/mesas', ['numero' => 99])->assertForbidden();

        $this->assertDatabaseMissing('mesas', ['numero' => 99]);
    }

    public function test_garcom_acessa_cardapio_e_mesas(): void
    {
        Sanctum::actingAs(User::factory()->garcom()->create());

        $this->getJson('/api/produtos')->assertOk();
        $this->getJson('/api/mesas')->assertOk();
    }

    public function test_garcom_nao_acessa_fila_da_cozinha_e_recebe_403(): void
    {
        Sanctum::actingAs(User::factory()->garcom()->create());

        $this->getJson('/api/cozinha/fila')->assertForbidden();
    }

    public function test_garcom_pode_abrir_comanda_e_adicionar_item(): void
    {
        $mesa = Mesa::factory()->create();
        $produto = Produto::factory()->create(['preco' => 25]);
        Sanctum::actingAs(User::factory()->garcom()->create());

        $pedidoId = $this->postJson('/api/pedidos', ['mesa_id' => $mesa->id])
            ->assertCreated()
            ->json('data.id');

        $this->postJson("/api/pedidos/{$pedidoId}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 2,
        ])->assertCreated();

        $this->assertDatabaseHas('pedidos', ['id' => $pedidoId, 'mesa_id' => $mesa->id]);
        $this->assertDatabaseHas('pedido_itens', [
            'pedido_id' => $pedidoId,
            'produto_id' => $produto->id,
            'quantidade' => 2,
        ]);
    }

    public function test_cozinha_acessa_fila_e_marca_pronto(): void
    {
        $pedido = Pedido::factory()->emPreparo()->create();
        $pedido->itens()->create([
            'produto_id' => null,
            'produto_nome' => 'Feijoada',
            'quantidade' => 1,
            'preco_unitario' => 35.50,
            'status' => 'em_preparo',
        ]);
        Sanctum::actingAs(User::factory()->cozinha()->create());

        $this->getJson('/api/cozinha/fila')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $pedido->id);

        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'pronto'])
            ->assertOk()
            ->assertJsonPath('data.status', 'pronto');

        $this->assertDatabaseHas('pedidos', ['id' => $pedido->id, 'status' => 'pronto']);
    }

    public function test_cozinha_nao_acessa_mesas_nem_cardapio_e_recebe_403(): void
    {
        Sanctum::actingAs(User::factory()->cozinha()->create());

        $this->getJson('/api/mesas')->assertForbidden();
        $this->getJson('/api/produtos')->assertForbidden();
    }

    public function test_cozinha_nao_marca_entregue_e_recebe_403(): void
    {
        $pedido = Pedido::factory()->pronto()->create();
        Sanctum::actingAs(User::factory()->cozinha()->create());

        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'entregue'])
            ->assertForbidden();

        $this->assertDatabaseHas('pedidos', ['id' => $pedido->id, 'status' => 'pronto']);
    }

    public function test_admin_acessa_todas_as_areas(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->getJson('/api/produtos')->assertOk();
        $this->getJson('/api/mesas')->assertOk();
        $this->getJson('/api/pedidos')->assertOk();
        $this->getJson('/api/cozinha/fila')->assertOk();
    }
}
