<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use App\Models\Accommodation;
use App\Models\PropertyImage;

class ShortStaySeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::firstOrCreate(
            ['email' => 'shortstay.manager@angolastay.com'],
            ['name' => 'ShortStay Angola', 'password' => 'password', 'role_id' => 2]
        );

        $properties = [
            // Luanda - 6 Casas
            [
                'name' => 'Apartamento T1 Ilha do Cabo',
                'description' => 'Acolhedor apartamento T1 na Ilha do Cabo, ideal para escapadas de fim de semana com vista para a baía.',
                'province' => 'Luanda',
                'municipality' => 'Luanda',
                'address' => 'Rua Murtala Mohamed, Ilha do Cabo',
                'price_per_night' => 35000,
                'status' => 'approved',
                'image' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
                'acc_name' => 'T1 Vista Baía',
                'capacity' => 2
            ],
            [
                'name' => 'T2 Executivo Talatona',
                'description' => 'Moderno T2 em condomínio fechado em Talatona. Segurança 24h e piscina.',
                'province' => 'Luanda',
                'municipality' => 'Talatona',
                'address' => 'Via S8, Talatona',
                'price_per_night' => 60000,
                'status' => 'approved',
                'image' => 'https://images.unsplash.com/photo-1502672260266-1c1e5250ad11?auto=format&fit=crop&q=80&w=800',
                'acc_name' => 'T2 Premium',
                'capacity' => 4
            ],
            [
                'name' => 'Estúdio T1 Mutamba',
                'description' => 'Perfeito para viagens de negócios. No coração financeiro de Luanda.',
                'province' => 'Luanda',
                'municipality' => 'Luanda',
                'address' => 'Mutamba, Centro',
                'price_per_night' => 30000,
                'status' => 'approved',
                'image' => 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
                'acc_name' => 'T1 Executivo',
                'capacity' => 2
            ],
            [
                'name' => 'Moradia T3 Nova Vida',
                'description' => 'Casa espaçosa com quintal, ideal para famílias grandes.',
                'province' => 'Luanda',
                'municipality' => 'Belas',
                'address' => 'Projecto Nova Vida',
                'price_per_night' => 85000,
                'status' => 'approved',
                'image' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
                'acc_name' => 'T3 Familiar',
                'capacity' => 6
            ],
            [
                'name' => 'T2 Praia do Mussulo',
                'description' => 'Casa rústica T2 de frente para a praia no Mussulo. Inclui transporte de barco.',
                'province' => 'Luanda',
                'municipality' => 'Talatona',
                'address' => 'Mussulo',
                'price_per_night' => 90000,
                'status' => 'approved',
                'image' => 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800',
                'acc_name' => 'T2 Praia',
                'capacity' => 4
            ],
            [
                'name' => 'T1 Económico Viana',
                'description' => 'Apartamento simples e limpo em Viana, perto da via expressa.',
                'province' => 'Luanda',
                'municipality' => 'Viana',
                'address' => 'Zango 0',
                'price_per_night' => 30000,
                'status' => 'approved',
                'image' => 'https://images.unsplash.com/photo-1522771731478-44114d023f2b?auto=format&fit=crop&q=80&w=800',
                'acc_name' => 'T1 Económico',
                'capacity' => 2
            ],
            
            // Benguela - 2 Casas
            [
                'name' => 'T2 Restinga Lobito',
                'description' => 'Elegante apartamento T2 na Restinga. Desfrute do melhor peixe fresco a pé.',
                'province' => 'Benguela',
                'municipality' => 'Lobito',
                'address' => 'Restinga, Lobito',
                'price_per_night' => 50000,
                'status' => 'approved',
                'image' => 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800',
                'acc_name' => 'T2 Restinga',
                'capacity' => 4
            ],
            [
                'name' => 'T1 Praia Morena',
                'description' => 'Pequeno apartamento ideal para solteiros ou casais a 5 minutos da Praia Morena.',
                'province' => 'Benguela',
                'municipality' => 'Benguela',
                'address' => 'Praia Morena',
                'price_per_night' => 35000,
                'status' => 'approved',
                'image' => 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800',
                'acc_name' => 'T1 Praia',
                'capacity' => 2
            ],

            // Huíla - 1 Casa
            [
                'name' => 'T3 Rústico Tundavala',
                'description' => 'Casa rústica grande (T3) perto da Fenda da Tundavala. Lareira e muito frio!',
                'province' => 'Huíla',
                'municipality' => 'Lubango',
                'address' => 'Tundavala, Lubango',
                'price_per_night' => 75000,
                'status' => 'approved',
                'image' => 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800',
                'acc_name' => 'T3 Rústico',
                'capacity' => 6
            ],

            // Cabinda - 1 Casa
            [
                'name' => 'T1 Floresta Maiombe',
                'description' => 'Acomodação curta duração T1, perto do centro de Cabinda.',
                'province' => 'Cabinda',
                'municipality' => 'Cabinda',
                'address' => 'Centro',
                'price_per_night' => 40000,
                'status' => 'approved',
                'image' => 'https://images.unsplash.com/photo-1440151050977-247552660a3b?auto=format&fit=crop&q=80&w=800',
                'acc_name' => 'T1 Maiombe',
                'capacity' => 2
            ]
        ];

        foreach ($properties as $propData) {
            $prop = Property::create([
                'user_id' => $owner->id,
                'name' => $propData['name'],
                'description' => $propData['description'],
                'province' => $propData['province'],
                'municipality' => $propData['municipality'],
                'address' => $propData['address'],
                'price_per_night' => $propData['price_per_night'],
                'status' => $propData['status'],
                'latitude' => 0,
                'longitude' => 0,
            ]);

            PropertyImage::create([
                'property_id' => $prop->id,
                'path' => $propData['image'],
                'is_primary' => true
            ]);

            Accommodation::create([
                'property_id' => $prop->id,
                'name' => $propData['acc_name'],
                'description' => 'Acomodação de curta duração.',
                'capacity' => $propData['capacity'],
                'price_per_night' => $propData['price_per_night'],
                'quantity' => 1
            ]);
        }
    }
}
