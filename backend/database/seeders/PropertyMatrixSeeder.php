<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use App\Models\Accommodation;
use App\Models\PropertyImage;

class PropertyMatrixSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::whereHas('role', function($q) { $q->where('name', 'owner'); })->first();
        if (!$owner) return;

        $provinces = [
            'Luanda' => 'Luanda', 'Benguela' => 'Benguela', 'Huíla' => 'Lubango',
            'Huambo' => 'Huambo', 'Namibe' => 'Moçâmedes', 'Cabinda' => 'Cabinda',
            'Zaire' => 'Mbanza Kongo', 'Uíge' => 'Uíge', 'Malanje' => 'Malanje',
            'Kwanza Sul' => 'Sumbe', 'Kwanza Norte' => 'Ndalatando', 'Bengo' => 'Caxito',
            'Lunda Norte' => 'Dundo', 'Lunda Sul' => 'Saurimo', 'Moxico' => 'Luena',
            'Bié' => 'Kuito', 'Cunene' => 'Ondjiva', 'Kuando Kubango' => 'Menongue'
        ];

        $types = ['Hotel', 'Resort', 'Lodge', 'Alojamento Local', 'Bungalow'];

        $images = [
            'https://images.unsplash.com/photo-1542314831-c53cd45301b6?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1618773928120-22c608149806?q=80&w=1000&auto=format&fit=crop',
        ];

        $counter = 1;

        foreach ($provinces as $province => $municipality) {
            // 4 properties per province
            for ($i = 0; $i < 4; $i++) {
                $type = $types[array_rand($types)];
                $price = rand(15000, 150000);
                
                $property = Property::create([
                    'user_id' => $owner->id,
                    'name' => "{$type} Premium {$province} " . rand(10, 99),
                    'type' => strtolower(str_replace(' ', '_', $type)),
                    'description' => "Uma experiência inesquecível em {$province}. Este maravilhoso {$type} oferece todo o conforto e luxo que você merece, com vistas deslumbrantes e serviço de excelência. Ideal para casais e famílias que procuram tranquilidade.",
                    'province' => $province,
                    'municipality' => $municipality,
                    'address' => "Rua Principal do {$municipality}, Lote {$counter}",
                    'price_per_night' => $price,
                    'status' => 'approved',
                    'contact_phone' => '9' . rand(10000000, 99999999),
                    'contact_email' => "reservas{$counter}@" . strtolower(str_replace(' ', '', $province)) . ".com"
                ]);

                // Create 3 public images
                for ($img = 0; $img < 3; $img++) {
                    PropertyImage::create([
                        'property_id' => $property->id,
                        'path' => $images[array_rand($images)],
                        'is_primary' => $img === 0
                    ]);
                }

                // Create 2 Accommodations (Rooms)
                Accommodation::create([
                    'property_id' => $property->id,
                    'name' => 'Quarto Standard',
                    'description' => 'Quarto confortável com cama de casal e vista para a cidade.',
                    'capacity' => 2,
                    'price_per_night' => $price,
                    'quantity' => rand(2, 5),
                    'rental_type' => 'both',
                    'hourly_packages' => json_encode(["2h" => $price * 0.2, "5h" => $price * 0.4])
                ]);

                Accommodation::create([
                    'property_id' => $property->id,
                    'name' => 'Suite Master',
                    'description' => 'Suite de luxo com varanda panorâmica, jacuzzi e sala de estar.',
                    'capacity' => 4,
                    'price_per_night' => $price * 1.5,
                    'quantity' => 1,
                    'rental_type' => 'daily',
                    'hourly_packages' => null
                ]);

                $counter++;
            }
        }
    }
}
