"use client";

import * as React from "react";
import { Filter, MapPin, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { PropertyCard } from "../../../components/cards/PropertyCard";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import { Slider } from "../../../components/ui/slider";
import { Button } from "../../../components/ui/button";
import { HeroSearchBar } from "../../../components/search/HeroSearchBar";
import { propertyService } from "../../../services/propertyService";
import { Skeleton } from "../../../components/ui/skeleton";

export function SearchResultsClient() {
  const router = import("next/navigation").then(m => m.useRouter); // Or just use the hook
  const { useRouter } = require("next/navigation");
  const navRouter = useRouter();
  
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query') || "";
  const guestsParam = searchParams.get('guests') || "0";
  const checkinParam = searchParams.get('checkin') || "";
  const checkoutParam = searchParams.get('checkout') || "";

  // Local state for sidebar filters
  const [priceRange, setPriceRange] = React.useState([0, 300000]); // Reset base price
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);
  const [sortOrder, setSortOrder] = React.useState('recommended');
  
  // Pagination State
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['searchProperties', queryParam, guestsParam, checkinParam, checkoutParam, priceRange, selectedTypes, selectedAmenities, sortOrder, page, perPage],
    queryFn: () => propertyService.searchProperties({ 
      query: queryParam,
      guests: guestsParam,
      checkin: checkinParam,
      checkout: checkoutParam,
      min_price: priceRange[0], 
      max_price: priceRange[1],
      types: selectedTypes,
      amenities: selectedAmenities,
      sort: sortOrder,
      page: page,
      per_page: perPage
    }),
    retry: 1
  });

  const displayProperties = propertiesData?.data || [];
  const totalCount = propertiesData?.total || displayProperties.length;

  const getSubtitle = () => {
    let parts: string[] = [];
    if (queryParam) parts.push(queryParam);
    else parts.push('Angola');
    
    if (checkinParam && checkoutParam) {
      parts.push(`${checkinParam} - ${checkoutParam}`);
    }
    
    if (Number(guestsParam) > 0) {
      parts.push(`≥ ${guestsParam} ${Number(guestsParam) === 1 ? 'hóspede' : 'hóspedes'}`);
    }
    
    return parts.join(' • ');
  };

  return (
    <>
      <div className="w-full bg-muted/20 border-b border-border py-6 px-4 relative z-50">
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
                    <Checkbox 
                      id={`type-${type}`} 
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => handleTypeToggle(type)}
                    />
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
                    <Checkbox 
                      id={`amenity-${amenity}`} 
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label htmlFor={`amenity-${amenity}`} className="text-sm font-normal cursor-pointer leading-none">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setPriceRange([0, 300000]);
                setSelectedTypes([]);
                setSelectedAmenities([]);
                navRouter.push('/pesquisa');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </aside>

        {/* Main Content (Results) */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text">
                {isLoading ? "A procurar..." : `${totalCount} alojamentos encontrados`}
              </h1>
              <p className="text-muted-foreground text-sm flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {getSubtitle()}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">Exibir:</span>
                <select 
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border border-border rounded-md bg-surface text-sm p-2 outline-none focus:border-primary"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline">Ordenar por:</span>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border border-border rounded-md bg-surface text-sm p-2 outline-none focus:border-primary"
                >
                  <option value="recommended">Recomendado</option>
                  <option value="price_asc">Preço (Mais baixo primeiro)</option>
                  <option value="price_desc">Preço (Mais alto primeiro)</option>
                </select>
              </div>
              <Button variant="outline" size="icon" className="hidden lg:flex">
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
            ) : displayProperties.length > 0 ? (
              displayProperties.map((prop: any) => {
                const imagePath = prop.images?.[0]?.path;
                const coverImage = imagePath 
                  ? (imagePath.startsWith('http') ? imagePath : `http://localhost:8000/storage/${imagePath}`)
                  : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800";
                  
                return (
                  <PropertyCard 
                    key={prop.id}
                    id={prop.id}
                    title={prop.name}
                    location={`${prop.municipality}, ${prop.province}`}
                    price={Number(prop.price_per_night) || 0}
                    rating={4.5} // Add later
                    reviews={0}  // Add later
                    imageUrl={coverImage}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <Filter className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-text">Nenhum alojamento encontrado</h3>
                <p className="text-muted-foreground mt-2 max-w-md">Não conseguimos encontrar alojamentos com os filtros selecionados. Tente ajustar os seus critérios ou limpar os filtros.</p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => {
                    setPriceRange([0, 300000]);
                    setSelectedTypes([]);
                    setSelectedAmenities([]);
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-between items-center bg-surface p-4 rounded-2xl border border-border">
             <div className="text-sm text-muted-foreground hidden sm:block">
               Página {propertiesData?.current_page || 1} de {propertiesData?.last_page || 1}
             </div>
             <div className="flex gap-2 w-full sm:w-auto">
               <Button 
                 variant="outline" 
                 disabled={!propertiesData?.prev_page_url}
                 onClick={() => setPage(p => Math.max(1, p - 1))}
               >
                 Anterior
               </Button>
               <Button 
                 variant="outline" 
                 disabled={!propertiesData?.next_page_url}
                 onClick={() => setPage(p => p + 1)}
               >
                 Próxima
               </Button>
             </div>
          </div>
        </main>
      </div>
    </>
  );
}
