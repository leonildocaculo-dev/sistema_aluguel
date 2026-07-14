import * as React from "react"
import { Helmet } from "react-helmet-async"
import { Filter, MapPin, List } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { PropertyCard } from "../components/cards/PropertyCard"
import { Checkbox } from "../components/ui/Checkbox"
import { Label } from "../components/ui/Label"
import { Slider } from "../components/ui/Slider"
import { Button } from "../components/ui/Button"
import { HeroSearchBar } from "../components/search/HeroSearchBar"
import { propertyService } from "../services/propertyService"
import { Skeleton } from "../components/ui/Skeleton"

// Dummy data for visual setup
const dummyResults = [
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
  },
  {
    id: 5,
    title: "Pousada das Quedas",
    location: "Kalandula, Malanje",
    price: 40000,
    rating: 4.6,
    reviews: 112,
    imageUrl: "https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&q=80&w=800",
  }
]

export function SearchResults() {
  const [priceRange, setPriceRange] = React.useState([20000, 150000])

  const { data: properties, isLoading } = useQuery({
    queryKey: ['searchProperties', priceRange],
    queryFn: () => propertyService.searchProperties({ 
      min_price: priceRange[0], 
      max_price: priceRange[1] 
    }),
    retry: 1
  })

  // Use API data if available, fallback to dummy data for MVP visual setup
  const displayProperties = properties?.data && properties.data.length > 0 ? properties.data : dummyResults

  return (
    <>
      <Helmet>
        <title>Resultados de Pesquisa | AngolaStay</title>
        <meta name="description" content="Resultados da sua pesquisa de alojamento em Angola." />
      </Helmet>

      <div className="w-full bg-muted/20 border-b border-border py-6 px-4">
        <div className="container mx-auto max-w-[var(--container-width)]">
          <HeroSearchBar />
        </div>
      </div>

      <div className="container mx-auto max-w-[var(--container-width)] py-8 px-4 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar (Filters) */}
        <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
          <div className="sticky top-24 bg-surface rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Filtros</h2>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="font-medium text-sm text-text mb-4">Preço por noite</h3>
              <Slider
                defaultValue={[20000, 150000]}
                max={300000}
                step={5000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-4"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(priceRange[0])}</span>
                <span>{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(priceRange[1])}</span>
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="mb-8">
              <h3 className="font-medium text-sm text-text mb-4">Tipo de Alojamento</h3>
              <div className="space-y-3">
                {['Hotel', 'Resort', 'Alojamento Local', 'Lodge', 'Bungalow'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={`type-${type}`} />
                    <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer leading-none">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Filter */}
            <div className="mb-8">
              <h3 className="font-medium text-sm text-text mb-4">Comodidades Populares</h3>
              <div className="space-y-3">
                {['Piscina', 'Wi-Fi Gratuito', 'Pequeno-almoço incluído', 'Estacionamento', 'Ar Condicionado'].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox id={`amenity-${amenity}`} />
                    <Label htmlFor={`amenity-${amenity}`} className="text-sm font-normal cursor-pointer leading-none">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Limpar Filtros
            </Button>
          </div>
        </aside>

        {/* Main Content (Results) */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text">
                {dummyResults.length} alojamentos encontrados
              </h1>
              <p className="text-muted-foreground text-sm flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                Angola • 12 Fev - 15 Fev • 2 hóspedes
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <select className="border border-border rounded-md bg-surface text-sm p-2 outline-none focus:border-primary">
                <option>Recomendado</option>
                <option>Preço (Mais baixo primeiro)</option>
                <option>Preço (Mais alto primeiro)</option>
                <option>Melhor avaliação</option>
              </select>
              <Button variant="outline" size="icon" className="hidden sm:flex ml-2">
                <List className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {isLoading ? (
               Array(6).fill(0).map((_, i) => (
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

          <div className="mt-10 flex justify-center">
             <Button variant="outline" size="lg" className="w-full sm:w-auto px-12">
               Carregar mais resultados
             </Button>
          </div>
        </main>
      </div>
    </>
  )
}
