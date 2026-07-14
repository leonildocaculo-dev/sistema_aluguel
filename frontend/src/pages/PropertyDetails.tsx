import * as React from "react"
import { Helmet } from "react-helmet-async"
import { MapPin, Star, Share, Heart, Check, Wifi, Car, Coffee, Wind } from "lucide-react"

import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"

// Dummy data for visual setup
const property = {
  id: 1,
  title: "Resort Épico Luanda Sul",
  location: "Talatona, Luanda, Angola",
  price: 85000,
  rating: 4.8,
  reviews: 124,
  description: "Descubra o luxo e conforto no coração de Talatona. O nosso resort oferece vistas incríveis, serviço de quarto 24 horas, e fácil acesso aos principais centros de negócios e lazer de Luanda. Perfeito para viagens de negócios ou escapadelas românticas.",
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800"
  ],
  amenities: [
    { name: "Piscina", icon: <Check className="h-5 w-5 text-primary" /> },
    { name: "Wi-Fi Gratuito", icon: <Wifi className="h-5 w-5 text-primary" /> },
    { name: "Estacionamento", icon: <Car className="h-5 w-5 text-primary" /> },
    { name: "Pequeno-almoço", icon: <Coffee className="h-5 w-5 text-primary" /> },
    { name: "Ar Condicionado", icon: <Wind className="h-5 w-5 text-primary" /> },
  ]
}

export function PropertyDetails() {
  return (
    <>
      <Helmet>
        <title>{property.title} | AngolaStay</title>
        <meta name="description" content={property.description} />
      </Helmet>

      <div className="container mx-auto max-w-[var(--container-width)] py-8 px-4">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4">
              <span className="flex items-center text-text font-medium">
                <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                {property.rating} ({property.reviews} avaliações)
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="gap-2">
              <Share className="h-4 w-4" />
              Partilhar
            </Button>
            <Button variant="outline" className="gap-2">
              <Heart className="h-4 w-4" />
              Guardar
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
          <div className="md:col-span-2 row-span-2 relative">
            <img src={property.images[0]} alt="Principal" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block relative">
            <img src={property.images[1]} alt="Foto 2" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block relative">
            <img src={property.images[2]} alt="Foto 3" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block relative">
            <img src={property.images[3]} alt="Foto 4" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block relative">
            <img src={property.images[4]} alt="Foto 5" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Details (Left) */}
          <div className="flex-1">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-text mb-4">Sobre este espaço</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </section>

            <hr className="border-border my-8" />

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-text mb-6">O que este lugar oferece</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 text-text">
                    {amenity.icon}
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-6">
                Mostrar todas as comodidades
              </Button>
            </section>
            
            <hr className="border-border my-8" />
            
            {/* Map Placeholder */}
            <section className="mb-10">
               <h2 className="text-2xl font-bold text-text mb-6">Localização</h2>
               <div className="w-full h-[300px] bg-muted rounded-xl flex items-center justify-center border border-border">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Mapa (Integração Google/Mapbox futuramente)
                  </span>
               </div>
            </section>
          </div>

          {/* Booking Sidebar (Right) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <Card className="shadow-lg border-border/60">
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-bold text-text">
                      {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(property.price)}
                    </span>
                    <span className="text-muted-foreground text-sm">/ noite</span>
                  </div>

                  <div className="border border-border rounded-xl mb-6 overflow-hidden">
                    <div className="flex border-b border-border">
                      <div className="flex-1 p-3 border-r border-border cursor-pointer hover:bg-muted/30">
                        <span className="block text-xs font-bold text-text uppercase">Check-in</span>
                        <span className="text-sm text-muted-foreground">Adicionar data</span>
                      </div>
                      <div className="flex-1 p-3 cursor-pointer hover:bg-muted/30">
                        <span className="block text-xs font-bold text-text uppercase">Check-out</span>
                        <span className="text-sm text-muted-foreground">Adicionar data</span>
                      </div>
                    </div>
                    <div className="p-3 cursor-pointer hover:bg-muted/30 flex justify-between items-center">
                      <div>
                        <span className="block text-xs font-bold text-text uppercase">Hóspedes</span>
                        <span className="text-sm text-muted-foreground">1 hóspede</span>
                      </div>
                      <span className="text-xl text-muted-foreground">&#8964;</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full text-lg h-12 mb-4">
                    Reservar
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground mb-6">
                    Ainda não será cobrado nenhum valor
                  </p>

                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between text-text">
                      <span className="underline cursor-pointer">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(property.price)} x 5 noites</span>
                      <span>{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(property.price * 5)}</span>
                    </div>
                    <div className="flex justify-between text-text">
                      <span className="underline cursor-pointer">Taxa de limpeza</span>
                      <span>15.000,00 Kz</span>
                    </div>
                    <div className="flex justify-between text-text">
                      <span className="underline cursor-pointer">Taxa de serviço AngolaStay</span>
                      <span>12.500,00 Kz</span>
                    </div>
                  </div>

                  <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg text-text">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format((property.price * 5) + 15000 + 12500)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 border border-border rounded-xl p-4 flex gap-4 items-center bg-surface">
                 <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    A
                 </div>
                 <div>
                    <h4 className="font-semibold text-sm">Alojamento Raro</h4>
                    <p className="text-xs text-muted-foreground">O preço de propriedades deste anfitrião costuma estar esgotado.</p>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
