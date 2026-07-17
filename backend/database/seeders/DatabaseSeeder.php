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
        $this->call([
            RoleSeeder::class,
            AngolaDataSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Admin AngolaStay',
            'email' => 'admin@angolastay.com',
            'password' => 'password',
            'role_id' => 1, // Admin role
        ]);

        User::factory()->create([
            'name' => 'Proprietário AngolaStay',
            'email' => 'owner@angolastay.com',
            'password' => 'password',
            'role_id' => 2, // Owner role
        ]);

        User::factory()->create([
            'name' => 'Cliente AngolaStay',
            'email' => 'client@angolastay.com',
            'password' => 'password',
            'role_id' => 3, // Client role
        ]);

        // $this->call([
        //     ShortStaySeeder::class,
        //     PropertyMatrixSeeder::class,
        // ]);
    }
}
