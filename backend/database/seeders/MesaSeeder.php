<?php

namespace Database\Seeders;

use App\Models\Mesa;
use Illuminate\Database\Seeder;

class MesaSeeder extends Seeder
{
    public function run(): void
    {
        foreach (range(1, 12) as $numero) {
            Mesa::query()->updateOrCreate(
                ['numero' => $numero],
                ['capacidade' => $numero % 3 === 0 ? 6 : 4, 'ativa' => true],
            );
        }
    }
}
