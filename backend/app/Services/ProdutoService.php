<?php

namespace App\Services;

use App\Models\Produto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProdutoService
{
    /**
     * Colunas permitidas para ordenação (whitelist evita injeção via ?order).
     */
    private const COLUNAS_ORDENAVEIS = [
        'nome',
        'preco',
        'categoria',
        'created_at',
        'updated_at',
    ];

    /**
     * Camada de Serviço OO - centraliza regras de negócio e upload.
     * Mantém Controller magro (SOLID - Single Responsibility)
     */
    public function listAll(array $filters = [], int $perPage = 15)
    {
        $search = $this->normalizar($filters['search'] ?? null);
        $categoria = $this->normalizar($filters['categoria'] ?? null);
        [$coluna, $direcao] = $this->resolveOrder($filters['order'] ?? null);

        return Produto::query()
            ->when($search, function ($query, $termo) {
                $query->where(function ($sub) use ($termo) {
                    $sub->where('nome', 'like', "%{$termo}%")
                        ->orWhere('descricao', 'like', "%{$termo}%");
                });
            })
            ->when($categoria, fn ($query, $valor) => $query->where('categoria', $valor))
            ->orderBy($coluna, $direcao)
            ->paginate($perPage);
    }

    /**
     * Categorias distintas já cadastradas (para o filtro no app).
     */
    public function categorias(): array
    {
        return Produto::query()
            ->whereNotNull('categoria')
            ->where('categoria', '!=', '')
            ->distinct()
            ->orderBy('categoria')
            ->pluck('categoria')
            ->values()
            ->all();
    }

    /**
     * Traduz ?order em [coluna, direção]. Prefixo "-" = descendente.
     * Default: mais recentes primeiro.
     */
    private function resolveOrder(?string $order): array
    {
        $order = $this->normalizar($order);

        if ($order === null) {
            return ['created_at', 'desc'];
        }

        $direcao = str_starts_with($order, '-') ? 'desc' : 'asc';
        $candidata = ltrim($order, '-');

        if (! in_array($candidata, self::COLUNAS_ORDENAVEIS, true)) {
            return ['created_at', 'desc'];
        }

        return [$candidata, $direcao];
    }

    private function normalizar(?string $valor): ?string
    {
        $valor = is_string($valor) ? trim($valor) : null;

        return ($valor === null || $valor === '') ? null : $valor;
    }

    public function create(array $data, ?UploadedFile $foto = null): Produto
    {
        // 'foto'/'remover_foto' não são colunas da tabela; tratados aqui.
        unset($data['foto'], $data['remover_foto']);

        $fotoPath = null;

        if ($foto) {
            $fotoPath = $this->storeFoto($foto);
            $data['foto_path'] = $fotoPath;
        }

        try {
            return Produto::create($data);
        } catch (\Throwable $e) {
            // Evita arquivo órfão: se a inserção falhar, remove a foto recém-gravada.
            $this->deleteFoto($fotoPath);

            throw $e;
        }
    }

    /**
     * Atualização parcial: só altera o que veio na requisição.
     * - Nova foto: grava a nova ANTES de apagar a antiga (evita perder a atual
     *   caso o upload falhe) e remove o arquivo antigo só após persistir.
     * - $removerFoto: apaga a foto atual e zera foto_path.
     */
    public function update(Produto $produto, array $data, ?UploadedFile $foto = null, bool $removerFoto = false): Produto
    {
        // 'foto'/'remover_foto' não são colunas da tabela; tratados aqui.
        unset($data['foto'], $data['remover_foto']);

        $fotoAntiga = $produto->foto_path;

        if ($foto) {
            $data['foto_path'] = $this->storeFoto($foto);
        } elseif ($removerFoto) {
            $data['foto_path'] = null;
        }

        $produto->update($data);

        // Só apaga o arquivo antigo depois que a mudança foi persistida.
        if ($fotoAntiga && $fotoAntiga !== $produto->foto_path) {
            $this->deleteFoto($fotoAntiga);
        }

        return $produto->fresh();
    }

    public function delete(Produto $produto): void
    {
        $fotoPath = $produto->foto_path;

        // Remove o registro primeiro; o arquivo só é apagado se o banco confirmar,
        // evitando perder a foto caso o delete do registro falhe.
        $produto->delete();

        $this->deleteFoto($fotoPath);
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
