<?php

namespace Tests\Feature;

use App\Models\Mesa;
use App\Models\Pedido;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MesaApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_crud_de_mesa(): void
    {
        // CREATE
        $res = $this->postJson('/api/mesas', [
            'numero' => 1,
            'capacidade' => 4,
        ]);
        $res->assertCreated()
            ->assertJsonPath('data.numero', 1)
            ->assertJsonPath('data.capacidade', 4)
            ->assertJsonPath('data.ativa', true)
            ->assertJsonPath('data.status', 'livre')
            ->assertJsonPath('data.pedido_ativo', null);
        $mesaId = $res->json('data.id');

        // LIST
        $this->getJson('/api/mesas')->assertOk()->assertJsonCount(1, 'data');

        // SHOW
        $this->getJson("/api/mesas/{$mesaId}")->assertOk()->assertJsonPath('data.numero', 1);

        // UPDATE parcial (não envia numero, ele deve continuar igual)
        $this->putJson("/api/mesas/{$mesaId}", ['capacidade' => 6, 'ativa' => false])
            ->assertOk()
            ->assertJsonPath('data.capacidade', 6)
            ->assertJsonPath('data.ativa', false)
            ->assertJsonPath('data.numero', 1);

        // DELETE
        $this->deleteJson("/api/mesas/{$mesaId}")->assertNoContent();
        $this->getJson("/api/mesas/{$mesaId}")->assertNotFound();
    }

    public function test_numero_de_mesa_precisa_ser_unico(): void
    {
        Mesa::factory()->create(['numero' => 5]);

        $this->postJson('/api/mesas', ['numero' => 5])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('numero');
    }

    public function test_valida_dados_da_mesa(): void
    {
        $this->postJson('/api/mesas', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('numero');

        $this->postJson('/api/mesas', ['numero' => 0])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('numero');

        $this->postJson('/api/mesas', ['numero' => 1, 'capacidade' => 'abc'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('capacidade');
    }

    public function test_mesa_mostra_status_e_comanda_ativa(): void
    {
        $mesa = Mesa::factory()->create(['numero' => 2]);
        $pedido = Pedido::factory()->create(['mesa_id' => $mesa->id, 'status' => Pedido::STATUS_ABERTO]);

        $this->getJson('/api/mesas')
            ->assertOk()
            ->assertJsonPath('data.0.status', 'ocupada')
            ->assertJsonPath('data.0.pedido_ativo.id', $pedido->id)
            ->assertJsonPath('data.0.pedido_ativo.status', 'aberto')
            ->assertJsonPath('data.0.pedido_ativo.itens_count', 0);
    }

    public function test_filtro_de_mesas_por_status(): void
    {
        $livre = Mesa::factory()->create(['numero' => 1]);
        $ocupada = Mesa::factory()->create(['numero' => 2]);
        Pedido::factory()->create(['mesa_id' => $ocupada->id]);

        $this->getJson('/api/mesas?status=livre')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $livre->id);

        $this->getJson('/api/mesas?status=ocupada')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $ocupada->id);
    }

    public function test_mesa_ocupada_quando_a_comanda_e_entregue_e_liberada_ao_fechar_ou_cancelar(): void
    {
        $entregue = Mesa::factory()->create(['numero' => 7]);
        Pedido::factory()->entregue()->create(['mesa_id' => $entregue->id]);

        $fechada = Mesa::factory()->create(['numero' => 8]);
        Pedido::factory()->fechado()->create(['mesa_id' => $fechada->id]);

        $cancelada = Mesa::factory()->create(['numero' => 9]);
        Pedido::factory()->create(['mesa_id' => $cancelada->id, 'status' => Pedido::STATUS_CANCELADO]);

        $this->getJson("/api/mesas/{$entregue->id}")->assertOk()->assertJsonPath('data.status', 'ocupada');
        $this->getJson("/api/mesas/{$fechada->id}")->assertOk()->assertJsonPath('data.status', 'livre');
        $this->getJson("/api/mesas/{$cancelada->id}")->assertOk()->assertJsonPath('data.status', 'livre');
    }

    public function test_nao_exclui_mesa_com_comanda_ativa(): void
    {
        $mesa = Mesa::factory()->create();
        Pedido::factory()->create(['mesa_id' => $mesa->id, 'status' => Pedido::STATUS_EM_PREPARO]);

        $this->deleteJson("/api/mesas/{$mesa->id}")->assertStatus(409);
        $this->assertDatabaseHas('mesas', ['id' => $mesa->id]);

        // cancelando a comanda a mesa pode ser excluída
        $mesa->pedidos()->update(['status' => Pedido::STATUS_CANCELADO]);
        $this->deleteJson("/api/mesas/{$mesa->id}")->assertNoContent();
    }

    public function test_mesa_inexistente_retorna_404(): void
    {
        $this->getJson('/api/mesas/999')->assertNotFound();
        $this->putJson('/api/mesas/999', ['numero' => 1])->assertNotFound();
        $this->deleteJson('/api/mesas/999')->assertNotFound();
    }
}
