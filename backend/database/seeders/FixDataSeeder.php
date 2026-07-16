<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Support\Facades\Hash;

class FixDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Criar os Roles
        $adminRole = Role::firstOrCreate(['name' => 'admin'], ['description' => 'Administrador do Sistema']);
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin'], ['description' => 'Super Administrador com acesso total']);

        // 2. Criar utilizadores
        $admin = User::firstOrCreate(
            ['email' => 'admin@angolastay.com'],
            [
                'name' => 'Admin AngolaStay',
                'password' => Hash::make('Admin@1234'),
                'role_id' => $adminRole->id
            ]
        );

        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@angolastay.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('SuperAdmin@2026!'),
                'role_id' => $superAdminRole->id
            ]
        );

        // 3. Colocar foto publica em propriedades sem foto
        $properties = Property::doesntHave('images')->get();
        
        $publicPhotos = [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1551882547-ff40c0d5b9af?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&q=80&w=800'
        ];

        foreach ($properties as $property) {
            $randomPhoto = $publicPhotos[array_rand($publicPhotos)];
            
            PropertyImage::create([
                'property_id' => $property->id,
                'path' => $randomPhoto,
                'is_primary' => true
            ]);
        }

        $this->command->info('Users created and Photos attached successfully!');
        $this->command->info("Admin: admin@angolastay.com / Admin@1234");
        $this->command->info("Super Admin: superadmin@angolastay.com / SuperAdmin@2026!");
    }
}
