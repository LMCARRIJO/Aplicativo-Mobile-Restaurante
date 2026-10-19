<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoItem extends Model
{
    use HasFactory;

    /**
     * O plural em português ("itens") não é o que o Eloquent infere ("items").
     */
    protected $table = 'pedido_itens';

    protected $fillable = [
        'pedido_id',
        'produto_id',
        'produto_nome',
        'quantidade',
        'preco_unitario',
        'observacao',
    ];

    protected $casts = [
        'quantidade' => 'integer',
        'preco_unitario' => 'decimal:2',
    ];

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }

    /**
     * Pode ser null se o produto saiu do cardápio (o nome fica no snapshot).
     */
    public function produto(): BelongsTo
    {
        return $this->belongsTo(Produto::class);
    }

    public function subtotal(): float
    {
        return round(((float) $this->preco_unitario) * $this->quantidade, 2);
    }
}
