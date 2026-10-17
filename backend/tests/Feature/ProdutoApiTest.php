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

        // CREATE - multipart precisa de post() não postJson
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
        $foto = UploadedFile::fake()->createWithContent('prato.png', $png);
        $res = $this->post('/api/produtos', [
            'nome' => 'Moqueca Baiana',
            'preco' => 49.90,
            'descricao' => 'Prato típico da Bahia',
            'quantidade_estoque' => 8,
            'data_validade' => now()->addMonth()->format('Y-m-d'),
            'categoria' => 'Prato Principal',
            'foto' => $foto,
        ]);
        $res->assertCreated()
            ->assertJsonPath('data.descricao', 'Prato típico da Bahia')
            ->assertJsonPath('data.quantidade_estoque', 8)
            ->assertJsonPath('data.categoria', 'Prato Principal')
            ->assertJsonPath('data.data_validade', now()->addMonth()->format('Y-m-d'));
        $id = $res->json('data.id');

        // LIST
        $this->getJson('/api/produtos')->assertOk()->assertJsonCount(1, 'data');

        // SHOW
        $this->getJson("/api/produtos/{$id}")->assertOk()->assertJsonPath('data.nome', 'Moqueca Baiana');

        // UPDATE
        $this->putJson("/api/produtos/{$id}", [
            'nome' => 'Moqueca Premium',
            'preco' => 59.90,
            'quantidade_estoque' => 12,
            'categoria' => 'Especial',
        ])
            ->assertOk()
            ->assertJsonPath('data.nome', 'Moqueca Premium')
            ->assertJsonPath('data.quantidade_estoque', 12)
            ->assertJsonPath('data.categoria', 'Especial');

        // DELETE
        $this->deleteJson("/api/produtos/{$id}")->assertNoContent();
        $this->assertDatabaseMissing('produtos', ['id' => $id]);
    }

    public function test_crud_apenas_campos_base(): void
    {
        Storage::fake('public');

        $this->postJson('/api/produtos', ['nome' => 'Água', 'preco' => 5.50])
            ->assertCreated()
            ->assertJsonPath('data.quantidade_estoque', 0)
            ->assertJsonPath('data.descricao', null);
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
            'quantidade_estoque' => -1,
            'data_validade' => now()->subDay()->format('Y-m-d'),
        ])->assertStatus(422)->assertJsonValidationErrors(['quantidade_estoque', 'data_validade']);
    }
}
