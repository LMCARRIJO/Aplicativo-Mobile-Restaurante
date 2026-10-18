<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProdutoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_crud_produto_com_foto(): void
    {
        Storage::fake('public');

        $promocaoFim = now()->addMonth()->format('Y-m-d');

        // CREATE - multipart precisa de post() não postJson
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
        $foto = UploadedFile::fake()->createWithContent('prato.png', $png);
        $res = $this->post('/api/produtos', [
            'nome' => 'Moqueca Baiana',
            'preco' => 49.90,
            'preco_promocional' => 39.90,
            'descricao' => 'Prato típico da Bahia',
            'ingredientes' => 'Peixe, leite de coco, azeite de dendê',
            'alergenicos' => 'Frutos do mar, Lactose',
            'porcao' => 2,
            'disponivel' => true,
            'promocao_fim' => $promocaoFim,
            'categoria' => 'Prato Principal',
            'foto' => $foto,
        ]);
        $res->assertCreated()
            ->assertJsonPath('data.descricao', 'Prato típico da Bahia')
            ->assertJsonPath('data.ingredientes', 'Peixe, leite de coco, azeite de dendê')
            ->assertJsonPath('data.alergenicos', 'Frutos do mar, Lactose')
            ->assertJsonPath('data.porcao', 2)
            ->assertJsonPath('data.disponivel', true)
            ->assertJsonPath('data.promocao_fim', $promocaoFim)
            ->assertJsonPath('data.categoria', 'Prato Principal');
        $id = $res->json('data.id');

        // LIST
        $this->getJson('/api/produtos')->assertOk()->assertJsonCount(1, 'data');

        // SHOW
        $this->getJson("/api/produtos/{$id}")->assertOk()->assertJsonPath('data.nome', 'Moqueca Baiana');

        // UPDATE
        $this->putJson("/api/produtos/{$id}", [
            'nome' => 'Moqueca Premium',
            'preco' => 59.90,
            'preco_promocional' => 49.90,
            'porcao' => 4,
            'disponivel' => false,
            'categoria' => 'Entrada',
        ])
            ->assertOk()
            ->assertJsonPath('data.nome', 'Moqueca Premium')
            ->assertJsonPath('data.porcao', 4)
            ->assertJsonPath('data.disponivel', false)
            ->assertJsonPath('data.preco_promocional', '49.90')
            ->assertJsonPath('data.categoria', 'Entrada');

        // DELETE
        $this->deleteJson("/api/produtos/{$id}")->assertNoContent();
        $this->assertDatabaseMissing('produtos', ['id' => $id]);
    }

    public function test_crud_apenas_campos_base(): void
    {
        Storage::fake('public');

        $this->postJson('/api/produtos', ['nome' => 'Água', 'preco' => 5.50])
            ->assertCreated()
            ->assertJsonPath('data.porcao', null)
            ->assertJsonPath('data.descricao', null)
            ->assertJsonPath('data.disponivel', true);
    }

    public function test_validacao_nome_preco(): void
    {
        $this->postJson('/api/produtos', [])->assertStatus(422)->assertJsonValidationErrors(['nome', 'preco']);
    }

    public function test_validacao_campos_extras(): void
    {
        $this->postJson('/api/produtos', [
            'nome' => 'Teste',
            'preco' => 10,
            'preco_promocional' => -1,
            'porcao' => 0,
            'categoria' => 'Inexistente',
            'promocao_fim' => 'data-invalida',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['preco_promocional', 'porcao', 'categoria', 'promocao_fim']);
    }
}
