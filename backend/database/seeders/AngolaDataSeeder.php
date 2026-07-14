<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use App\Models\Accommodation;
use App\Models\PropertyImage;

class AngolaDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Criar utilizadores (Proprietários)
        $owner1 = User::firstOrCreate(
            ['email' => 'hoteis.luanda@angolastay.com'],
            ['name' => 'Hotéis Luanda SA', 'password' => bcrypt('password'), 'role_id' => 2]
        );

        $owner2 = User::firstOrCreate(
            ['email' => 'benguela.resorts@angolastay.com'],
            ['name' => 'Benguela Resorts', 'password' => bcrypt('password'), 'role_id' => 2]
        );

        $owner3 = User::firstOrCreate(
            ['email' => 'huila.lodges@angolastay.com'],
            ['name' => 'Huíla Lodges e Turismo', 'password' => bcrypt('password'), 'role_id' => 2]
        );

        // 2. Criar Propriedades e Acomodações
        
        // Propriedade 1: Luanda
        $prop1 = Property::create([
            'user_id' => $owner1->id,
            'name' => 'Hotel Trópico Luanda',
            'description' => 'Um oásis de luxo no coração de Luanda. Perfeito para negócios e lazer, com piscina, ginásio e restaurantes de classe mundial.',
            'province' => 'Luanda',
            'municipality' => 'Luanda',
            'address' => 'Rua da Missão, Luanda',
            'price_per_night' => 125000,
            'status' => 'approved',
            'latitude' => -8.8159,
            'longitude' => 13.2306,
        ]);

        PropertyImage::create(['property_id' => $prop1->id, 'path' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200', 'is_primary' => true]);
        PropertyImage::create(['property_id' => $prop1->id, 'path' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800', 'is_primary' => false]);
        PropertyImage::create(['property_id' => $prop1->id, 'path' => 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800', 'is_primary' => false]);

        Accommodation::create([
            'property_id' => $prop1->id,
            'name' => 'Quarto Standard',
            'description' => 'Quarto confortável com cama de casal e vista para a cidade.',
            'capacity' => 2,
            'price_per_night' => 125000,
            'quantity' => 20
        ]);
        
        Accommodation::create([
            'property_id' => $prop1->id,
            'name' => 'Suite Presidencial',
            'description' => 'Luxuosa suite com sala de estar e vista panorâmica.',
            'capacity' => 4,
            'price_per_night' => 350000,
            'quantity' => 2
        ]);

        // Propriedade 2: Luanda Sul (Talatona)
        $prop2 = Property::create([
            'user_id' => $owner1->id,
            'name' => 'Resort Épico Talatona',
            'description' => 'O resort definitivo em Luanda Sul, oferecendo villas privadas, campos de ténis e um ambiente exclusivo.',
            'province' => 'Luanda',
            'municipality' => 'Talatona',
            'address' => 'Via S8, Talatona, Luanda Sul',
            'price_per_night' => 150000,
            'status' => 'approved',
            'latitude' => -8.9130,
            'longitude' => 13.1873,
        ]);

        PropertyImage::create(['property_id' => $prop2->id, 'path' => 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200', 'is_primary' => true]);
        PropertyImage::create(['property_id' => $prop2->id, 'path' => 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800', 'is_primary' => false]);

        Accommodation::create([
            'property_id' => $prop2->id,
            'name' => 'Villa T2',
            'description' => 'Villa espaçosa com duas suites, sala e kitchenette.',
            'capacity' => 4,
            'price_per_night' => 150000,
            'quantity' => 10
        ]);

        // Propriedade 3: Benguela (Baía Azul)
        $prop3 = Property::create([
            'user_id' => $owner2->id,
            'name' => 'Lodge Baía Azul',
            'description' => 'Situado na famosa Baía Azul, este lodge oferece bungalows literalmente em cima da areia, com águas cristalinas.',
            'province' => 'Benguela',
            'municipality' => 'Baía Farta',
            'address' => 'Praia da Baía Azul, Benguela',
            'price_per_night' => 85000,
            'status' => 'approved',
            'latitude' => -12.6333,
            'longitude' => 13.2167,
        ]);

        PropertyImage::create(['property_id' => $prop3->id, 'path' => 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1200', 'is_primary' => true]);
        PropertyImage::create(['property_id' => $prop3->id, 'path' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', 'is_primary' => false]);

        Accommodation::create([
            'property_id' => $prop3->id,
            'name' => 'Bungalow Vista Mar',
            'description' => 'Bungalow privado com varanda virada para o oceano.',
            'capacity' => 2,
            'price_per_night' => 85000,
            'quantity' => 15
        ]);

        // Propriedade 4: Huíla (Lubango)
        $prop4 = Property::create([
            'user_id' => $owner3->id,
            'name' => 'Serra da Chela Lodge',
            'description' => 'Relaxe no clima ameno do Lubango. O lodge fica próximo à Fenda da Tundavala e ao Cristo Rei.',
            'province' => 'Huíla',
            'municipality' => 'Lubango',
            'address' => 'Bairro da Senhora do Monte, Lubango',
            'price_per_night' => 65000,
            'status' => 'approved',
            'latitude' => -14.9172,
            'longitude' => 13.4925,
        ]);

        PropertyImage::create(['property_id' => $prop4->id, 'path' => 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&q=80&w=1200', 'is_primary' => true]);
        PropertyImage::create(['property_id' => $prop4->id, 'path' => 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800', 'is_primary' => false]);

        Accommodation::create([
            'property_id' => $prop4->id,
            'name' => 'Quarto Duplo Rústico',
            'description' => 'Quarto com lareira e decoração inspirada nas etnias locais.',
            'capacity' => 2,
            'price_per_night' => 65000,
            'quantity' => 12
        ]);
        
        Accommodation::create([
            'property_id' => $prop4->id,
            'name' => 'Casa Familiar',
            'description' => 'Casa completa para famílias que visitam a Serra da Chela.',
            'capacity' => 6,
            'price_per_night' => 120000,
            'quantity' => 3
        ]);

        // Propriedade 5: Cabinda
        $prop5 = Property::create([
            'user_id' => $owner1->id,
            'name' => 'Maiombe Eco-Resort',
            'description' => 'Descubra a floresta do Maiombe neste eco-resort sustentável.',
            'province' => 'Cabinda',
            'municipality' => 'Buco-Zau',
            'address' => 'Reserva Florestal do Maiombe',
            'price_per_night' => 45000,
            'status' => 'approved',
            'latitude' => -4.9667,
            'longitude' => 12.3500,
        ]);

        PropertyImage::create(['property_id' => $prop5->id, 'path' => 'https://images.unsplash.com/photo-1440151050977-247552660a3b?auto=format&fit=crop&q=80&w=1200', 'is_primary' => true]);

        Accommodation::create([
            'property_id' => $prop5->id,
            'name' => 'Tenda Safari Luxo',
            'description' => 'Glamping na floresta com todas as comodidades.',
            'capacity' => 2,
            'price_per_night' => 45000,
            'quantity' => 8
        ]);
    }
}
