<?php

namespace Database\Seeders;

use App\Models\User;
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
        // User::factory(10)->create();

        $this->call([
            RoleSeeder::class,
            AngolaDataSeeder::class,
            ShortStaySeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'admin@angolastay.com',
            'password' => 'password',
            'role_id' => 1, // Admin role
        ]);
    }
}
