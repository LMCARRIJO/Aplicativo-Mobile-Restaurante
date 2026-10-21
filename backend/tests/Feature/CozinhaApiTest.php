<?php

namespace Tests\Feature;

use App\Models\Mesa;
use App\Models\Pedido;
use App\Models\Produto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CozinhaApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Comanda já enviada para a cozinha, com um item que tem observação.
     */
    private function comandaEmPreparo(int $minutosAtras = 0): Pedido
    {
        $mesa = Mesa::factory()->create();
        $pedido = Pedido::factory()->emPreparo($minutosAtras)->create(['mesa_id' => $mesa->id]);

        $pedido->itens()->create([
            'produto_id' => null,
            'produto_nome' => 'Feijoada',
            'quantidade' => 2,
            'preco_unitario' => 35.50,
            'observacao' => 'Sem cebola',
            'status' => 'em_preparo',
        ]);
        $pedido->update(['total' => 71.00]);

        return $pedido->refresh();
    }

    private function comandaPronta(int $minutosAtras = 0): Pedido
    {
        $pedido = Pedido::factory()->pronto($minutosAtras)->create();

        $pedido->itens()->create([
            'produto_id' => null,
            'produto_nome' => 'Feijoada',
            'quantidade' => 1,
            'preco_unitario' => 35.50,
            'status' => 'pronto',
        ]);
        $pedido->update(['total' => 35.50]);

        return $pedido->refresh();
    }

    public function test_fila_mostra_comandas_em_preparo_mais_antigas_primeiro(): void
    {
        $nova = $this->comandaEmPreparo(5);
        $antiga = $this->comandaEmPreparo(30);

        // comandas que não estão na cozinha
        Pedido::factory()->pronto()->create();
        Pedido::factory()->create();

        $res = $this->getJson('/api/cozinha/fila')->assertOk();

        $res->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $antiga->id)
            ->assertJsonPath('data.0.mesa.numero', $antiga->mesa->numero)
            ->assertJsonPath('data.0.status', 'em_preparo')
            ->assertJsonPath('data.0.total', '71.00')
            ->assertJsonPath('data.0.itens.0.produto_nome', 'Feijoada')
            ->assertJsonPath('data.0.itens.0.quantidade', 2)
            ->assertJsonPath('data.0.itens.0.observacao', 'Sem cebola')
            ->assertJsonPath('data.1.id', $nova->id)
            ->assertJsonStructure([
                'data' => [['id', 'mesa' => ['id', 'numero'], 'status', 'total', 'itens', 'criado_em', 'enviado_em', 'pronto_em']],
            ]);

        $this->assertNotNull($res->json('data.0.enviado_em'));
        $this->assertNull($res->json('data.0.pronto_em'));
    }

    public function test_fila_traz_as_prontas_aguardando_retirada(): void
    {
        $this->comandaEmPreparo();

        $prontaAntiga = $this->comandaPronta(20);
        $prontaNova = $this->comandaPronta(5);

        $this->getJson('/api/cozinha/fila?status=pronto')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $prontaAntiga->id)
            ->assertJsonPath('data.1.id', $prontaNova->id)
            ->assertJsonPath('data.0.status', 'pronto');

        $this->assertNotNull($this->getJson("/api/pedidos/{$prontaAntiga->id}")->json('data.pronto_em'));
    }

    public function test_fila_recusa_status_invalido(): void
    {
        $this->getJson('/api/cozinha/fila?status=aberto')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $this->getJson('/api/cozinha/fila?status=qualquer')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');
    }

    public function test_cozinha_marca_comanda_como_pronta(): void
    {
        $pedido = $this->comandaEmPreparo(10);

        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'pronto'])
            ->assertOk()
            ->assertJsonPath('data.status', 'pronto');

        $pedido->refresh();
        $this->assertNotNull($pedido->enviado_em);
        $this->assertNotNull($pedido->pronto_em);

        // sai da fila de preparo e entra na lista das prontas
        $this->getJson('/api/cozinha/fila')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/cozinha/fila?status=pronto')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $pedido->id);
    }

    public function test_comanda_pronta_nao_volta_para_preparo(): void
    {
        $pedido = Pedido::factory()->pronto()->create();

        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'em_preparo'])
            ->assertStatus(409);
    }

    public function test_fluxo_completo_garcom_cozinha_ate_liberar_a_mesa(): void
    {
        $mesa = Mesa::factory()->create();
        $produto = Produto::factory()->create(['nome' => 'Feijoada', 'preco' => 35.50]);

        // garçom abre a comanda e anota dois pratos
        $pedidoId = $this->postJson('/api/pedidos', ['mesa_id' => $mesa->id])
            ->assertCreated()
            ->json('data.id');

        $this->postJson("/api/pedidos/{$pedidoId}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 2,
        ])->assertCreated();

        // envia para a cozinha (registra o envio)
        $envio = $this->postJson("/api/pedidos/{$pedidoId}/enviar")->assertOk();
        $this->assertNotNull($envio->json('data.enviado_em'));

        // a cozinha vê a comanda na fila e marca como pronta
        $this->getJson('/api/cozinha/fila')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $pedidoId);

        $this->patchJson("/api/pedidos/{$pedidoId}/status", ['status' => 'pronto'])
            ->assertOk()
            ->assertJsonPath('data.status', 'pronto');

        // garçom entrega; a mesa continua ocupada até fechar a conta
        $this->patchJson("/api/pedidos/{$pedidoId}/status", ['status' => 'entregue'])
            ->assertOk()
            ->assertJsonPath('data.status', 'entregue');

        $this->getJson('/api/cozinha/fila?status=pronto')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson("/api/mesas/{$mesa->id}")->assertOk()->assertJsonPath('data.status', 'ocupada');

        $this->patchJson("/api/pedidos/{$pedidoId}/status", ['status' => 'fechado'])
            ->assertOk()
            ->assertJsonPath('data.status', 'fechado');

        $this->getJson("/api/mesas/{$mesa->id}")->assertOk()->assertJsonPath('data.status', 'livre');
    }
}
