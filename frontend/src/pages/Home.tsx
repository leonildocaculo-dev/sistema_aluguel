import * as React from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { propertyService } from "../services/propertyService"
import { HeroSearchBar } from "../components/search/HeroSearchBar"
import { PropertyCard } from "../components/cards/PropertyCard"
import { Skeleton } from "../components/ui/Skeleton"

// Dummy data for MVP visual setup
const dummyProperties = [
  {
    id: 1,
    title: "Resort Épico Luanda Sul",
    location: "Talatona, Luanda",
    price: 85000,
    oldPrice: 120000,
    rating: 4.8,
    reviews: 124,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Lodge Baía Azul",
    location: "Baía Azul, Benguela",
    price: 45000,
    rating: 4.9,
    reviews: 89,
    imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Hotel Central Huambo",
    location: "Centro, Huambo",
    price: 35000,
    oldPrice: 40000,
    rating: 4.5,
    reviews: 210,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c0d5b9af?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Bungalows da Fenda",
    location: "Tundavala, Huíla",
    price: 55000,
    rating: 4.9,
    reviews: 56,
    imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800",
  }
]

export function Home() {
  const { data: properties, isLoading, isError } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: propertyService.getFeaturedProperties,
    retry: 1
  })

  // Use API data if available, fallback to dummy data for UI display if backend fails
  const displayProperties = properties && properties.length > 0 ? properties : dummyProperties

  return (
    <>
      <Helmet>
        <title>AngolaStay | Reserve Alojamentos em Angola</title>
        <meta name="description" content="Encontre e reserve os melhores hotéis, resorts e alojamentos locais em Angola com as melhores ofertas." />
      </Helmet>
      
      <div className="w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-r from-primary to-primary/90 py-16 md:py-24 px-4 text-center overflow-hidden">
          {/* Background Pattern/Image overlay could go here */}
          <div className="container mx-auto max-w-[var(--container-width)] relative z-10 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight max-w-4xl">
              Economize até 40% na sua próxima estadia
            </h1>
            <p className="text-lg md:text-xl text-primary-50 mb-10 md:mb-12 max-w-2xl">
              Comparamos preços de hotéis, resorts e alojamentos locais em todo o país.
            </p>
            
            <div className="w-full mt-2 -mb-28 md:-mb-32 relative z-20">
              <HeroSearchBar />
            </div>
          </div>
        </section>

        {/* Partners / Trust Section */}
        <section className="w-full bg-surface pt-36 pb-12 px-4 border-b border-border/50">
          <div className="container mx-auto max-w-[var(--container-width)] flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
             {/* Dummy logos for partners */}
             <span className="font-bold text-xl md:text-2xl text-muted-foreground">Booking.com</span>
             <span className="font-bold text-xl md:text-2xl text-muted-foreground">Expedia</span>
             <span className="font-bold text-xl md:text-2xl text-muted-foreground">Hoteis.com</span>
             <span className="font-bold text-xl md:text-2xl text-muted-foreground">Trip.com</span>
             <span className="text-sm font-medium text-muted-foreground ml-4">100+ outros sites</span>
          </div>
        </section>

        {/* Promo Banner Section (Like Trivago's main banner) */}
        <section className="w-full py-12 px-4 bg-background">
          <div className="container mx-auto max-w-[var(--container-width)]">
            <div className="bg-surface border border-border/60 rounded-2xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
              <div className="flex-1 max-w-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-text mb-4 leading-tight">
                  O seu atalho para encontrar uma ótima oferta
                </h2>
                <p className="text-muted-foreground mb-6">
                  Descubra opções incríveis com cancelamento gratuito e preços imbatíveis.
                </p>
                <button className="text-primary font-semibold hover:underline">
                  Ver todas as ofertas &rarr;
                </button>
              </div>
              <div className="flex-1 w-full relative">
                {/* Visual representation of comparing prices */}
                <div className="relative rounded-xl overflow-hidden shadow-card max-w-md ml-auto">
                   <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800" alt="Hotel Promo" className="w-full h-auto object-cover" />
                   <div className="absolute top-4 left-4 bg-surface px-3 py-2 rounded-lg shadow-md flex flex-col">
                     <span className="text-xs text-muted-foreground">Site oficial</span>
                     <span className="font-bold text-lg text-text">170.000 Kz</span>
                   </div>
                   <div className="absolute bottom-4 right-4 bg-secondary text-white px-4 py-2 rounded-lg shadow-lg flex flex-col items-end">
                     <span className="text-xs text-white/90">AngolaStay</span>
                     <span className="font-bold text-xl">120.000 Kz</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations / Recommendations */}
        <section className="w-full py-12 px-4 bg-background">
          <div className="container mx-auto max-w-[var(--container-width)]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">
                  Grandes ofertas em cidades populares
                </h2>
                <p className="text-muted-foreground">
                  Alojamentos altamente recomendados pelos nossos utilizadores.
                </p>
              </div>
              <button className="text-primary font-semibold hover:underline flex items-center">
                Ver mais ofertas <span className="ml-1">&rarr;</span>
              </button>
            </div>
            
            {/* Tabs for cities (Simplified for MVP) */}
            <div className="flex space-x-6 border-b border-border mb-8 overflow-x-auto pb-2 scrollbar-hide">
              <button className="text-primary font-semibold border-b-2 border-primary pb-2 whitespace-nowrap">Todas as ofertas</button>
              <button className="text-muted-foreground hover:text-text pb-2 whitespace-nowrap">Luanda</button>
              <button className="text-muted-foreground hover:text-text pb-2 whitespace-nowrap">Benguela</button>
              <button className="text-muted-foreground hover:text-text pb-2 whitespace-nowrap">Huíla</button>
              <button className="text-muted-foreground hover:text-text pb-2 whitespace-nowrap">Namibe</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between mt-4">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                  </div>
                ))
              ) : (
                displayProperties.map((prop: any) => (
                  <PropertyCard 
                    key={prop.id}
                    id={prop.id}
                    title={prop.title}
                    location={prop.location || prop.address || 'Angola'}
                    price={prop.base_price || prop.price}
                    oldPrice={prop.oldPrice}
                    rating={prop.rating || 4.5}
                    reviews={prop.reviews || 0}
                    imageUrl={prop.images?.[0]?.url || prop.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
