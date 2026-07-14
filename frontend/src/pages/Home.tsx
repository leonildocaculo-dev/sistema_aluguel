import * as React from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { propertyService } from "../services/propertyService"
import { HeroSearchBar } from "../components/search/HeroSearchBar"
import { PropertyCard } from "../components/cards/PropertyCard"
import { Skeleton } from "../components/ui/Skeleton"
import { Star, ShieldCheck, MapPin } from "lucide-react"

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
  const { data: properties, isLoading } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: propertyService.getFeaturedProperties,
    retry: 1
  })

  const displayProperties = properties && properties.length > 0 ? properties : dummyProperties

  return (
    <>
      <Helmet>
        <title>AngolaStay | Reserve Alojamentos Exclusivos em Angola</title>
        <meta name="description" content="Encontre e reserve diretamente os melhores hotéis, resorts e alojamentos locais em Angola." />
      </Helmet>
      
      <div className="w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-br from-primary to-primary/80 py-20 px-4 text-center">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"></div>
          
          <div className="container mx-auto max-w-[var(--container-width)] relative z-10 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl font-['Outfit'] drop-shadow-md">
              Encontre o Alojamento Perfeito em Angola
            </h1>
            <p className="text-lg md:text-xl text-primary-50 mb-12 max-w-2xl drop-shadow-sm font-medium">
              Reserve diretamente com os proprietários. Hotéis de luxo, resorts de praia e retiros naturais.
            </p>
            
            {/* Hero Search - Fixed Layout */}
            <div className="w-full max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white relative z-20">
              <HeroSearchBar />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full bg-surface py-16 px-4 border-b border-border/50">
          <div className="container mx-auto max-w-[var(--container-width)] grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="flex flex-col items-center p-6 rounded-2xl bg-muted/30">
               <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                 <ShieldCheck className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-xl font-bold mb-2">Reserva Segura</h3>
               <p className="text-muted-foreground">Pagamentos encriptados e suporte dedicado 24/7 para garantir a sua tranquilidade.</p>
             </div>
             <div className="flex flex-col items-center p-6 rounded-2xl bg-muted/30">
               <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                 <Star className="w-8 h-8 text-secondary" />
               </div>
               <h3 className="text-xl font-bold mb-2">Qualidade Premium</h3>
               <p className="text-muted-foreground">Alojamentos rigorosamente selecionados e validados pela nossa equipa de especialistas.</p>
             </div>
             <div className="flex flex-col items-center p-6 rounded-2xl bg-muted/30">
               <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                 <MapPin className="w-8 h-8 text-success" />
               </div>
               <h3 className="text-xl font-bold mb-2">Melhores Destinos</h3>
               <p className="text-muted-foreground">Descubra lugares incríveis de Cabinda ao Cunene, com experiências autênticas.</p>
             </div>
          </div>
        </section>

        {/* Promo Banner Section (Direct Booking) */}
        <section className="w-full py-16 px-4 bg-background">
          <div className="container mx-auto max-w-[var(--container-width)]">
            <div className="bg-gradient-to-r from-primary to-primary/90 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl text-white">
              <div className="flex-1 max-w-xl">
                <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold mb-6 backdrop-blur-md">
                  Vantagem AngolaStay
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight font-['Outfit']">
                  Sem intermediários. <br/>Apenas grandes estadias.
                </h2>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  Ao reservar através do AngolaStay, garante uma comunicação direta com o anfitrião e usufrui das melhores tarifas disponíveis no mercado, apoiando o turismo local.
                </p>
                <button className="bg-secondary text-white font-bold py-3 px-8 rounded-xl hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200">
                  Explorar Propriedades
                </button>
              </div>
              <div className="flex-1 w-full relative hidden md:block">
                <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800" alt="Resort Angola" className="w-full h-80 object-cover rounded-2xl shadow-2xl border-4 border-white/10" />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations / Recommendations */}
        <section className="w-full py-16 px-4 bg-surface border-t border-border/50">
          <div className="container mx-auto max-w-[var(--container-width)]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-text mb-3 font-['Outfit']">
                  Alojamentos em Destaque
                </h2>
                <p className="text-muted-foreground text-lg">
                  Propriedades altamente recomendadas pelos nossos hóspedes em Angola.
                </p>
              </div>
              <button className="text-primary font-semibold hover:underline flex items-center text-lg">
                Ver todas <span className="ml-2">&rarr;</span>
              </button>
            </div>
            
            {/* Tabs for cities */}
            <div className="flex space-x-8 border-b border-border mb-10 overflow-x-auto pb-3 scrollbar-hide text-lg">
              <button className="text-primary font-bold border-b-2 border-primary pb-3 whitespace-nowrap">Todas as províncias</button>
              <button className="text-muted-foreground hover:text-text pb-3 whitespace-nowrap font-medium transition-colors">Luanda</button>
              <button className="text-muted-foreground hover:text-text pb-3 whitespace-nowrap font-medium transition-colors">Benguela</button>
              <button className="text-muted-foreground hover:text-text pb-3 whitespace-nowrap font-medium transition-colors">Huíla</button>
              <button className="text-muted-foreground hover:text-text pb-3 whitespace-nowrap font-medium transition-colors">Cabinda</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <Skeleton className="h-[250px] w-full rounded-2xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between mt-4">
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-10 w-28 rounded-full" />
                    </div>
                  </div>
                ))
              ) : (
                displayProperties.map((prop: any) => (
                  <PropertyCard 
                    key={prop.id}
                    id={prop.id}
                    title={prop.name || prop.title}
                    location={`${prop.municipality || ''}, ${prop.province || prop.location}`.replace(/^, /, '')}
                    price={prop.price_per_night || prop.price}
                    oldPrice={prop.oldPrice}
                    rating={prop.rating || 4.8}
                    reviews={prop.reviews || 42}
                    imageUrl={prop.images?.[0]?.path || prop.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"}
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
