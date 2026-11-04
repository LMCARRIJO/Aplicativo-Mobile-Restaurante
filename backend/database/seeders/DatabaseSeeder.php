<?php

namespace Database\Seeders;

<<<<<<< HEAD
=======
use App\Models\User;
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
<<<<<<< HEAD
        $this->call(UserSeeder::class);
=======
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
        $this->call(ProdutoSeeder::class);
        $this->call(MesaSeeder::class);
    }
}
