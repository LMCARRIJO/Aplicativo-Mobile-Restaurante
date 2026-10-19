<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido extends Model
{
    use HasFactory;

    public const STATUS_ABERTO = 'aberto';

    public const STATUS_EM_PREPARO = 'em_preparo';

    public const STATUS_PRONTO = 'pronto';

    public const STATUS_ENTREGUE = 'entregue';

    public const STATUS_CANCELADO = 'cancelado';

    /**
     * Status que ainda ocupam a mesa. `entregue` e `cancelado` liberam.
     */
    public const STATUS_ATIVOS = [
        self::STATUS_ABERTO,
        self::STATUS_EM_PREPARO,
        self::STATUS_PRONTO,
    ];

    /**
     * Fluxo da comanda: aberto -> em_preparo -> pronto -> entregue.
     * `cancelado` é possível enquanto a comanda não foi entregue.
     */
    public const TRANSICOES = [
        self::STATUS_ABERTO => [self::STATUS_EM_PREPARO, self::STATUS_CANCELADO],
        self::STATUS_EM_PREPARO => [self::STATUS_PRONTO, self::STATUS_CANCELADO],
        self::STATUS_PRONTO => [self::STATUS_ENTREGUE, self::STATUS_CANCELADO],
        self::STATUS_ENTREGUE => [],
        self::STATUS_CANCELADO => [],
    ];

    protected $fillable = [
        'mesa_id',
        'status',
        'observacao',
        'total',
    ];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    protected $attributes = [
        'status' => self::STATUS_ABERTO,
        'total' => 0,
    ];

    public function mesa(): BelongsTo
    {
        return $this->belongsTo(Mesa::class);
    }

    public function itens(): HasMany
    {
        return $this->hasMany(PedidoItem::class)->orderBy('id');
    }

    /**
     * Só é possível mexer nos itens enquanto a comanda não foi enviada à cozinha.
     */
    public function estaAberto(): bool
    {
        return $this->status === self::STATUS_ABERTO;
    }

    public function podeTransicionarPara(string $status): bool
    {
        return in_array($status, self::TRANSICOES[$this->status] ?? [], true);
    }
}
