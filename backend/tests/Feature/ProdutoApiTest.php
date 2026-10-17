<?php

namespace Tests\Feature;

use App\Models\Produto;
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

    public function test_consulta_com_busca_categoria_e_ordenacao(): void
    {
        Produto::factory()->create([
            'nome' => 'Pizza Margherita',
            'descricao' => 'Com manjericão',
            'categoria' => 'Prato Principal',
            'preco' => 40,
        ]);
        Produto::factory()->create([
            'nome' => 'Pizza Calabresa',
            'descricao' => 'Com cebola',
            'categoria' => 'Prato Principal',
            'preco' => 35,
        ]);
        Produto::factory()->create([
            'nome' => 'Pudim',
            'descricao' => 'Com calda',
            'categoria' => 'Sobremesa',
            'preco' => 12,
        ]);

        // Busca por nome
        $this->getJson('/api/produtos?search=Pizza')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        // Busca por descrição
        $this->getJson('/api/produtos?search=calda')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nome', 'Pudim');

        // Filtro por categoria
        $this->getJson('/api/produtos?categoria=Sobremesa')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nome', 'Pudim');

        // Ordenação ascendente e descendente por preço
        $this->getJson('/api/produtos?order=preco')
            ->assertOk()
            ->assertJsonPath('data.0.nome', 'Pudim');
        $this->getJson('/api/produtos?order=-preco')
            ->assertOk()
            ->assertJsonPath('data.0.nome', 'Pizza Margherita');

        // Combinação de filtros
        $this->getJson('/api/produtos?search=Pizza&categoria=Prato Principal&order=nome')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        // Coluna de ordenação inválida cai no default (mais recentes)
        $this->getJson('/api/produtos?order=; DROP TABLE produtos')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_lista_categorias(): void
    {
        Produto::factory()->create(['categoria' => 'Bebida']);
        Produto::factory()->create(['categoria' => 'Sobremesa']);
        Produto::factory()->create(['categoria' => 'Bebida']);
        Produto::factory()->create(['categoria' => null]);

        $this->getJson('/api/produtos/categorias')
            ->assertOk()
            ->assertJsonPath('data', ['Bebida', 'Sobremesa']);
    }

    public function test_atualizacao_parcial_preserva_campos_nao_enviados(): void
    {
        $produto = Produto::factory()->create([
            'nome' => 'Original',
            'preco' => 10,
            'descricao' => 'Descrição original',
            'categoria' => 'Bebida',
            'quantidade_estoque' => 5,
        ]);

        $this->patchJson("/api/produtos/{$produto->id}", ['preco' => 25.50])
            ->assertOk()
            ->assertJsonPath('data.preco', '25.50')
            ->assertJsonPath('data.nome', 'Original')
            ->assertJsonPath('data.descricao', 'Descrição original')
            ->assertJsonPath('data.categoria', 'Bebida')
            ->assertJsonPath('data.quantidade_estoque', 5);
    }

    public function test_atualizacao_substitui_foto_antiga(): void
    {
        Storage::fake('public');
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');

        $criar = $this->post('/api/produtos', [
            'nome' => 'Item',
            'preco' => 10,
            'foto' => UploadedFile::fake()->createWithContent('antiga.png', $png),
        ])->assertCreated();
        $id = $criar->json('data.id');
        $fotoAntiga = $criar->json('data.foto_path');
        Storage::disk('public')->assertExists($fotoAntiga);

        $atualizar = $this->post("/api/produtos/{$id}", [
            '_method' => 'PUT',
            'foto' => UploadedFile::fake()->createWithContent('nova.png', $png),
        ])->assertOk();

        $fotoNova = $atualizar->json('data.foto_path');
        $this->assertNotSame($fotoAntiga, $fotoNova);
        Storage::disk('public')->assertExists($fotoNova);
        Storage::disk('public')->assertMissing($fotoAntiga);
    }

    public function test_atualizacao_remove_foto(): void
    {
        Storage::fake('public');
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');

        $criar = $this->post('/api/produtos', [
            'nome' => 'Item',
            'preco' => 10,
            'foto' => UploadedFile::fake()->createWithContent('foto.png', $png),
        ])->assertCreated();
        $id = $criar->json('data.id');
        $fotoPath = $criar->json('data.foto_path');
        Storage::disk('public')->assertExists($fotoPath);

        $this->putJson("/api/produtos/{$id}", ['remover_foto' => true])
            ->assertOk()
            ->assertJsonPath('data.foto_path', null)
            ->assertJsonPath('data.foto_url', null);

        Storage::disk('public')->assertMissing($fotoPath);
    }

    public function test_criacao_normaliza_campos_vazios_para_null(): void
    {
        $this->postJson('/api/produtos', [
            'nome' => 'Suco',
            'preco' => 8,
            'descricao' => '   ',
            'categoria' => '',
        ])
            ->assertCreated()
            ->assertJsonPath('data.descricao', null)
            ->assertJsonPath('data.categoria', null);

        $this->assertDatabaseHas('produtos', [
            'nome' => 'Suco',
            'descricao' => null,
            'categoria' => null,
        ]);
    }

    public function test_atualizacao_normaliza_campos_vazios_sem_afetar_os_demais(): void
    {
        $produto = Produto::factory()->create([
            'nome' => 'Original',
            'preco' => 10,
            'descricao' => 'Descrição original',
            'categoria' => 'Bebida',
        ]);

        $this->patchJson("/api/produtos/{$produto->id}", ['descricao' => ''])
            ->assertOk()
            ->assertJsonPath('data.descricao', null)
            ->assertJsonPath('data.categoria', 'Bebida')
            ->assertJsonPath('data.nome', 'Original');
    }

    public function test_exclusao_remove_registro_e_foto(): void
    {
        Storage::fake('public');
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');

        $criar = $this->post('/api/produtos', [
            'nome' => 'Item',
            'preco' => 10,
            'foto' => UploadedFile::fake()->createWithContent('foto.png', $png),
        ])->assertCreated();
        $id = $criar->json('data.id');
        $fotoPath = $criar->json('data.foto_path');
        Storage::disk('public')->assertExists($fotoPath);

        $this->deleteJson("/api/produtos/{$id}")->assertNoContent();

        $this->assertDatabaseMissing('produtos', ['id' => $id]);
        Storage::disk('public')->assertMissing($fotoPath);
    }
}
