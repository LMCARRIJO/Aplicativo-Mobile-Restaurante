<?php

namespace Tests\Feature;

use App\Models\Mesa;
use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Produto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PedidoApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array{0: Mesa, 1: Pedido}
     */
    private function mesaComComanda(): array
    {
        $mesa = Mesa::factory()->create(['numero' => 3]);
        $pedido = Pedido::factory()->create(['mesa_id' => $mesa->id]);

        return [$mesa, $pedido];
    }

    public function test_abre_comanda_e_adiciona_itens(): void
    {
        $mesa = Mesa::factory()->create(['numero' => 3]);
        $produto = Produto::factory()->create(['nome' => 'Feijoada', 'preco' => 35.50]);

        // abre a comanda
        $res = $this->postJson('/api/pedidos', [
            'mesa_id' => $mesa->id,
            'observacao' => 'Mesa perto da janela',
        ]);
        $res->assertCreated()
            ->assertJsonPath('data.status', 'aberto')
            ->assertJsonPath('data.mesa_id', $mesa->id)
            ->assertJsonPath('data.observacao', 'Mesa perto da janela')
            ->assertJsonPath('data.total', '0.00')
            ->assertJsonCount(0, 'data.itens');
        $pedidoId = $res->json('data.id');

        // a mesa fica ocupada
        $this->getJson("/api/mesas/{$mesa->id}")
            ->assertOk()
            ->assertJsonPath('data.status', 'ocupada')
            ->assertJsonPath('data.pedido_ativo.id', $pedidoId);

        // primeiro item
        $this->postJson("/api/pedidos/{$pedidoId}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 2,
        ])->assertCreated()
            ->assertJsonPath('data.produto_nome', 'Feijoada')
            ->assertJsonPath('data.quantidade', 2)
            ->assertJsonPath('data.preco_unitario', '35.50')
            ->assertJsonPath('data.subtotal', '71.00');

        // segundo item com observação
        $this->postJson("/api/pedidos/{$pedidoId}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 1,
            'observacao' => 'Sem cebola',
        ])->assertCreated()->assertJsonPath('data.observacao', 'Sem cebola');

        // total recalculado e comanda completa
        $this->getJson("/api/pedidos/{$pedidoId}")
            ->assertOk()
            ->assertJsonPath('data.total', '106.50')
            ->assertJsonPath('data.mesa.numero', 3)
            ->assertJsonCount(2, 'data.itens');
    }

    public function test_edita_e_remove_itens_recalculando_o_total(): void
    {
        [$mesa, $pedido] = $this->mesaComComanda();
        $produto = Produto::factory()->create(['preco' => 10]);

        $itemId = $this->postJson("/api/pedidos/{$pedido->id}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 2,
        ])->json('data.id');

        $this->getJson("/api/pedidos/{$pedido->id}")->assertJsonPath('data.total', '20.00');

        // muda a quantidade
        $this->putJson("/api/pedidos/{$pedido->id}/itens/{$itemId}", ['quantidade' => 3])
            ->assertOk()
            ->assertJsonPath('data.subtotal', '30.00');
        $this->getJson("/api/pedidos/{$pedido->id}")->assertJsonPath('data.total', '30.00');

        // muda só a observação (update parcial)
        $this->putJson("/api/pedidos/{$pedido->id}/itens/{$itemId}", ['observacao' => 'Bem passado'])
            ->assertOk()
            ->assertJsonPath('data.observacao', 'Bem passado')
            ->assertJsonPath('data.quantidade', 3);

        // remove o item
        $this->deleteJson("/api/pedidos/{$pedido->id}/itens/{$itemId}")->assertNoContent();
        $this->getJson("/api/pedidos/{$pedido->id}")
            ->assertJsonPath('data.total', '0.00')
            ->assertJsonCount(0, 'data.itens');
    }

    public function test_nao_abre_duas_comandas_na_mesma_mesa(): void
    {
        [$mesa] = $this->mesaComComanda();

        $this->postJson('/api/pedidos', ['mesa_id' => $mesa->id])->assertStatus(409);
    }

    public function test_nao_abre_comanda_em_mesa_inativa_ou_inexistente(): void
    {
        $inativa = Mesa::factory()->create(['ativa' => false]);

        $this->postJson('/api/pedidos', ['mesa_id' => $inativa->id])->assertStatus(409);

        $this->postJson('/api/pedidos', ['mesa_id' => 999])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('mesa_id');
    }

    public function test_envia_comanda_para_a_cozinha(): void
    {
        [$mesa, $pedido] = $this->mesaComComanda();
        $produto = Produto::factory()->create(['preco' => 20]);

        // comanda vazia não vai para a cozinha
        $this->postJson("/api/pedidos/{$pedido->id}/enviar")->assertStatus(409);

        $this->postJson("/api/pedidos/{$pedido->id}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 1,
        ])->assertCreated();

        $this->postJson("/api/pedidos/{$pedido->id}/enviar")
            ->assertOk()
            ->assertJsonPath('data.status', 'em_preparo');

        // fila consumida pelo sistema da cozinha
        $this->getJson('/api/cozinha/fila')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $pedido->id)
            ->assertJsonPath('data.0.mesa.numero', 3)
            ->assertJsonPath('data.0.total', '20.00')
            ->assertJsonCount(1, 'data.0.itens');

        // comanda enviada não aceita mais alteração de itens nem novo envio
        $this->postJson("/api/pedidos/{$pedido->id}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 1,
        ])->assertStatus(409);
        $this->postJson("/api/pedidos/{$pedido->id}/enviar")->assertStatus(409);

        // e a mesa continua ocupada
        $this->getJson("/api/mesas/{$mesa->id}")->assertOk()->assertJsonPath('data.status', 'ocupada');
    }

    public function test_fluxo_de_status_da_comanda(): void
    {
        [$mesa, $pedido] = $this->mesaComComanda();
        $produto = Produto::factory()->create();

        // comanda vazia não vai para a cozinha nem pelo endpoint de status
        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'em_preparo'])->assertStatus(409);

        $this->postJson("/api/pedidos/{$pedido->id}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 1,
        ])->assertCreated();

        // pulando etapas ou voltando não é permitido
        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'pronto'])->assertStatus(409);
        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'aberto'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        // fluxo feliz
        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'em_preparo'])
            ->assertOk()
            ->assertJsonPath('data.status', 'em_preparo')
            ->assertJsonPath('data.itens.0.status', 'em_preparo');
        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'pronto'])
            ->assertOk()
            ->assertJsonPath('data.status', 'pronto')
            ->assertJsonPath('data.itens.0.status', 'pronto');
        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'entregue'])
            ->assertOk()
            ->assertJsonPath('data.status', 'entregue')
            ->assertJsonPath('data.itens.0.status', 'entregue');

        // entregue mantém a mesa ocupada e não pode ser cancelado
        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'cancelado'])->assertStatus(409);
        $this->getJson("/api/mesas/{$mesa->id}")->assertOk()->assertJsonPath('data.status', 'ocupada');

        // fechar a conta libera a mesa
        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'fechado'])
            ->assertOk()
            ->assertJsonPath('data.status', 'fechado');
        $this->assertNotNull($pedido->refresh()->fechado_em);

        $this->getJson("/api/mesas/{$mesa->id}")->assertOk()->assertJsonPath('data.status', 'livre');
    }

    public function test_status_repetido_e_idempotente(): void
    {
        [, $pedido] = $this->mesaComComanda();
        $produto = Produto::factory()->create();

        $this->postJson("/api/pedidos/{$pedido->id}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 1,
        ])->assertCreated();

        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'em_preparo'])
            ->assertOk()
            ->assertJsonPath('data.status', 'em_preparo');

        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'em_preparo'])
            ->assertOk()
            ->assertJsonPath('data.status', 'em_preparo')
            ->assertJsonPath('data.itens.0.status', 'em_preparo');

        $primeiroPronto = $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'pronto'])
            ->assertOk()
            ->json('data');

        $this->assertNotNull($primeiroPronto['pronto_em']);

        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'pronto'])
            ->assertOk()
            ->assertJsonPath('data.status', 'pronto')
            ->assertJsonPath('data.itens.0.status', 'pronto')
            ->assertJsonPath('data.pronto_em', $primeiroPronto['pronto_em']);

        // transição realmente inválida continua bloqueada
        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'em_preparo'])
            ->assertStatus(409);
    }

    public function test_entrega_mantem_mesa_ocupada_e_permite_nova_rodada(): void
    {
        $mesa = Mesa::factory()->create(['numero' => 4]);
        $feijoada = Produto::factory()->create(['nome' => 'Feijoada', 'preco' => 35.50]);
        $pudim = Produto::factory()->create(['nome' => 'Pudim', 'preco' => 10]);

        $pedidoId = $this->postJson('/api/pedidos', ['mesa_id' => $mesa->id])
            ->assertCreated()
            ->json('data.id');

        $this->postJson("/api/pedidos/{$pedidoId}/itens", [
            'produto_id' => $feijoada->id,
            'quantidade' => 1,
        ])->assertCreated()->assertJsonPath('data.status', 'pendente');

        $this->postJson("/api/pedidos/{$pedidoId}/enviar")->assertOk();
        $this->patchJson("/api/pedidos/{$pedidoId}/status", ['status' => 'pronto'])->assertOk();
        $this->patchJson("/api/pedidos/{$pedidoId}/status", ['status' => 'entregue'])->assertOk();

        $this->getJson("/api/mesas/{$mesa->id}")->assertOk()->assertJsonPath('data.status', 'ocupada');

        // nova rodada reabre a comanda sem apagar o item já entregue
        $this->postJson("/api/pedidos/{$pedidoId}/itens", [
            'produto_id' => $pudim->id,
            'quantidade' => 1,
        ])->assertCreated()->assertJsonPath('data.status', 'pendente');

        $this->getJson("/api/pedidos/{$pedidoId}")
            ->assertOk()
            ->assertJsonPath('data.status', 'aberto')
            ->assertJsonPath('data.total', '45.50')
            ->assertJsonPath('data.itens.0.status', 'entregue')
            ->assertJsonPath('data.itens.1.status', 'pendente');

        // a cozinha recebe somente a nova rodada
        $this->postJson("/api/pedidos/{$pedidoId}/enviar")->assertOk();

        $this->getJson('/api/cozinha/fila')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $pedidoId)
            ->assertJsonCount(1, 'data.0.itens')
            ->assertJsonPath('data.0.itens.0.produto_nome', 'Pudim')
            ->assertJsonPath('data.0.total', '45.50');

        $this->patchJson("/api/pedidos/{$pedidoId}/status", ['status' => 'pronto'])->assertOk();
        $this->patchJson("/api/pedidos/{$pedidoId}/status", ['status' => 'entregue'])->assertOk();

        $this->getJson("/api/mesas/{$mesa->id}")->assertOk()->assertJsonPath('data.status', 'ocupada');

        $this->patchJson("/api/pedidos/{$pedidoId}/status", ['status' => 'fechado'])
            ->assertOk()
            ->assertJsonPath('data.status', 'fechado');

        $this->getJson("/api/mesas/{$mesa->id}")->assertOk()->assertJsonPath('data.status', 'livre');
        $this->postJson('/api/pedidos', ['mesa_id' => $mesa->id])->assertCreated();
    }

    public function test_nao_fecha_conta_antes_da_entrega(): void
    {
        [, $pedido] = $this->mesaComComanda();

        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'fechado'])
            ->assertStatus(409);
    }

    public function test_nao_cancela_conta_com_itens_entregues(): void
    {
        $mesa = Mesa::factory()->create();
        $pedido = Pedido::factory()->entregue()->create(['mesa_id' => $mesa->id]);
        $pedido->itens()->create([
            'produto_id' => null,
            'produto_nome' => 'Feijoada',
            'quantidade' => 1,
            'preco_unitario' => 35.50,
            'status' => 'entregue',
        ]);

        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'cancelado'])
            ->assertStatus(409);
    }

    public function test_item_entregue_nao_pode_ser_editado_ou_removido(): void
    {
        $mesa = Mesa::factory()->create();
        $pedido = Pedido::factory()->entregue()->create(['mesa_id' => $mesa->id]);
        $entregue = $pedido->itens()->create([
            'produto_id' => null,
            'produto_nome' => 'Feijoada',
            'quantidade' => 1,
            'preco_unitario' => 35.50,
            'status' => 'entregue',
        ]);
        $produto = Produto::factory()->create();

        $this->postJson("/api/pedidos/{$pedido->id}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 1,
        ])->assertCreated();

        $this->putJson("/api/pedidos/{$pedido->id}/itens/{$entregue->id}", ['quantidade' => 2])
            ->assertStatus(409);
        $this->deleteJson("/api/pedidos/{$pedido->id}/itens/{$entregue->id}")
            ->assertStatus(409);
    }

    public function test_cancela_comanda_e_libera_a_mesa(): void
    {
        [$mesa, $pedido] = $this->mesaComComanda();

        $this->patchJson("/api/pedidos/{$pedido->id}/status", ['status' => 'cancelado'])
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelado');

        $this->getJson("/api/mesas/{$mesa->id}")->assertOk()->assertJsonPath('data.status', 'livre');

        // e a mesa aceita uma nova comanda
        $this->postJson('/api/pedidos', ['mesa_id' => $mesa->id])->assertCreated();
    }

    public function test_item_guarda_snapshot_do_produto(): void
    {
        [$mesa, $pedido] = $this->mesaComComanda();
        $produto = Produto::factory()->create(['nome' => 'Picanha', 'preco' => 80]);

        $this->postJson("/api/pedidos/{$pedido->id}/itens", [
            'produto_id' => $produto->id,
            'quantidade' => 1,
        ])->assertCreated();

        // o preço muda no cardápio, a comanda mantém o do momento do pedido
        $produto->update(['preco' => 95, 'nome' => 'Picanha Premium']);

        $this->getJson("/api/pedidos/{$pedido->id}")
            ->assertOk()
            ->assertJsonPath('data.itens.0.produto_nome', 'Picanha')
            ->assertJsonPath('data.itens.0.preco_unitario', '80.00')
            ->assertJsonPath('data.total', '80.00');

        // e continua legível mesmo se o produto sair do cardápio
        $produto->delete();

        $this->getJson("/api/pedidos/{$pedido->id}")
            ->assertOk()
            ->assertJsonPath('data.itens.0.produto_nome', 'Picanha')
            ->assertJsonPath('data.itens.0.produto_id', null)
            ->assertJsonPath('data.total', '80.00');
    }

    public function test_comanda_usa_o_preco_promocional_vigente(): void
    {
        [, $pedido] = $this->mesaComComanda();

        $emPromocao = Produto::factory()->create([
            'nome' => 'Risoto',
            'preco' => 60,
            'preco_promocional' => 45,
            'promocao_fim' => now()->addWeek()->format('Y-m-d'),
        ]);
        $promocaoVencida = Produto::factory()->create([
            'nome' => 'Nhoque',
            'preco' => 50,
            'preco_promocional' => 30,
            'promocao_fim' => now()->subWeek()->format('Y-m-d'),
        ]);

        $this->postJson("/api/pedidos/{$pedido->id}/itens", [
            'produto_id' => $emPromocao->id,
            'quantidade' => 1,
        ])->assertCreated()->assertJsonPath('data.preco_unitario', '45.00');

        $this->postJson("/api/pedidos/{$pedido->id}/itens", [
            'produto_id' => $promocaoVencida->id,
            'quantidade' => 2,
        ])->assertCreated()->assertJsonPath('data.preco_unitario', '50.00');

        $this->getJson("/api/pedidos/{$pedido->id}")->assertOk()->assertJsonPath('data.total', '145.00');
    }

    public function test_item_de_outra_comanda_retorna_404(): void
    {
        [, $pedido] = $this->mesaComComanda();
        $outroPedido = Pedido::factory()->create();
        $item = PedidoItem::factory()->create(['pedido_id' => $outroPedido->id]);

        $this->putJson("/api/pedidos/{$pedido->id}/itens/{$item->id}", ['quantidade' => 2])->assertNotFound();
        $this->deleteJson("/api/pedidos/{$pedido->id}/itens/{$item->id}")->assertNotFound();
    }

    public function test_valida_dados_do_item(): void
    {
        [, $pedido] = $this->mesaComComanda();
        $produto = Produto::factory()->create();

        $this->postJson("/api/pedidos/{$pedido->id}/itens", ['produto_id' => 999, 'quantidade' => 1])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('produto_id');

        $this->postJson("/api/pedidos/{$pedido->id}/itens", ['produto_id' => $produto->id])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('quantidade');

        $this->postJson("/api/pedidos/{$pedido->id}/itens", ['produto_id' => $produto->id, 'quantidade' => 0])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('quantidade');
    }

    public function test_lista_comandas_com_filtro_e_404(): void
    {
        [$mesa, $aberto] = $this->mesaComComanda();
        $outraMesa = Mesa::factory()->create(['numero' => 9]);
        $enviado = Pedido::factory()->create(['mesa_id' => $outraMesa->id, 'status' => Pedido::STATUS_EM_PREPARO]);

        $this->getJson('/api/pedidos')->assertOk()->assertJsonCount(2, 'data');

        $this->getJson('/api/pedidos?status=em_preparo')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $enviado->id);

        $this->getJson("/api/pedidos?mesa_id={$mesa->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $aberto->id);

        $this->getJson('/api/pedidos/999')->assertNotFound();
    }
}
