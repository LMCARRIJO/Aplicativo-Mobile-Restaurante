<?php

namespace App\Services;

use App\Models\Produto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProdutoService
{
    /**
     * Camada de Serviço OO - centraliza regras de negócio e upload.
     * Mantém Controller magro (SOLID - Single Responsibility)
     */

    public function listAll(int $perPage = 15)
    {
        return Produto::latest()->paginate($perPage);
    }

    public function create(array $data, ?UploadedFile $foto = null): Produto
    {
        if ($foto) {
            $data['foto_path'] = $this->storeFoto($foto);
        }
        // fresh() pra devolver defaults do banco (ex: quantidade_estoque 0) já no POST
        return Produto::create($data)->fresh();
    }

    public function update(Produto $produto, array $data, ?UploadedFile $foto = null): Produto
    {
        if ($foto) {
            $this->deleteFoto($produto->foto_path);
            $data['foto_path'] = $this->storeFoto($foto);
        }
        $produto->update($data);
        return $produto->fresh();
    }

    public function delete(Produto $produto): void
    {
        $this->deleteFoto($produto->foto_path);
        $produto->delete();
    }

    private function storeFoto(UploadedFile $foto): string
    {
        // Salva em storage/app/public/produtos e retorna path relativo
        return $foto->store('produtos', 'public');
    }

    private function deleteFoto(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
