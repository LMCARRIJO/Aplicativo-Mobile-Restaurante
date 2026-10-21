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

    public const STATUS_FECHADO = 'fechado';

    /**
     * Status que ainda ocupam a mesa. Apenas `fechado` e `cancelado` liberam.
     */
    public const STATUS_ATIVOS = [
        self::STATUS_ABERTO,
        self::STATUS_EM_PREPARO,
        self::STATUS_PRONTO,
        self::STATUS_ENTREGUE,
    ];

    /**
     * Fluxo da comanda: aberto -> em_preparo -> pronto -> entregue -> fechado.
     * `cancelado` é possível enquanto não houver itens entregues na conta.
     */
    public const TRANSICOES = [
        self::STATUS_ABERTO => [self::STATUS_EM_PREPARO, self::STATUS_CANCELADO],
        self::STATUS_EM_PREPARO => [self::STATUS_PRONTO, self::STATUS_CANCELADO],
        self::STATUS_PRONTO => [self::STATUS_ENTREGUE, self::STATUS_CANCELADO],
        self::STATUS_ENTREGUE => [self::STATUS_FECHADO],
        self::STATUS_FECHADO => [],
        self::STATUS_CANCELADO => [],
    ];

    protected $fillable = [
        'mesa_id',
        'status',
        'observacao',
        'total',
        'enviado_em',
        'pronto_em',
        'fechado_em',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'enviado_em' => 'datetime',
        'pronto_em' => 'datetime',
        'fechado_em' => 'datetime',
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
     * Só é possível editar/remover itens pendentes enquanto a rodada está aberta.
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
