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
        $foto = UploadedFile::fake()->image('prato.jpg', 600, 400);
        $res = $this->post('/api/produtos', [
            'nome' => 'Moqueca Baiana',
            'preco' => 49.90,
            'foto' => $foto,
        ]);
        $res->assertCreated();
        $id = $res->json('data.id');

        // LIST
        $this->getJson('/api/produtos')->assertOk()->assertJsonCount(1, 'data');

        // SHOW
        $this->getJson("/api/produtos/{$id}")->assertOk()->assertJsonPath('data.nome', 'Moqueca Baiana');

        // UPDATE
        $this->putJson("/api/produtos/{$id}", ['nome' => 'Moqueca Premium', 'preco' => 59.90])
            ->assertOk()
            ->assertJsonPath('data.nome', 'Moqueca Premium');

        // DELETE
        $this->deleteJson("/api/produtos/{$id}")->assertNoContent();
        $this->assertDatabaseMissing('produtos', ['id' => $id]);
    }

    public function test_validacao_nome_preco(): void
    {
        $this->postJson('/api/produtos', [])->assertStatus(422)->assertJsonValidationErrors(['nome', 'preco']);
    }
}
