"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "../../services/propertyService";
import { HeroSearchBar } from "../../components/search/HeroSearchBar";
import { PropertyCard } from "../../components/cards/PropertyCard";
import { Skeleton } from "../../components/ui/skeleton";
import { Star, ShieldCheck, MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "../../i18n/useTranslation";

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
];

export function HomeClient() {
  const router = useRouter();
  const { t } = useTranslation();
  const [scrollY, setScrollY] = React.useState(0);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: propertyService.getFeaturedProperties,
    retry: 1
  });

  const [activeProvince, setActiveProvince] = React.useState('Todas');

  const displayProperties = properties && properties.length > 0 ? properties : dummyProperties;

  const filteredProperties = React.useMemo(() => {
    let filtered = displayProperties;
    if (activeProvince !== 'Todas') {
      filtered = displayProperties.filter((p: any) => 
        (p.province || p.location || '').toLowerCase().includes(activeProvince.toLowerCase())
      );
    }
    return filtered.slice(0, 4);
  }, [displayProperties, activeProvince]);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section with Video Parallax */}
      <section className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ transform: `translateY(${scrollY * 0.35}px)` }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-[130%] object-cover"
            poster="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1920"
          >
            <source
              src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-[1]"></div>
        
        {/* Content */}
        <div className="container mx-auto max-w-[var(--container-width)] relative z-10 flex flex-col items-center text-center px-4 py-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl font-['Outfit'] drop-shadow-xl">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl drop-shadow-md font-medium">
            {t('hero.subtitle')}
          </p>
          
          {/* Hero Search */}
          <div className="w-full max-w-5xl mx-auto relative z-20 mt-8">
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
             <h3 className="text-xl font-bold mb-2">{t('benefits.secure.title')}</h3>
             <p className="text-muted-foreground">{t('benefits.secure.desc')}</p>
           </div>
           <div className="flex flex-col items-center p-6 rounded-2xl bg-muted/30">
             <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
               <Star className="w-8 h-8 text-secondary" />
             </div>
             <h3 className="text-xl font-bold mb-2">{t('benefits.quality.title')}</h3>
             <p className="text-muted-foreground">{t('benefits.quality.desc')}</p>
           </div>
           <div className="flex flex-col items-center p-6 rounded-2xl bg-muted/30">
             <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
               <MapPin className="w-8 h-8 text-success" />
             </div>
             <h3 className="text-xl font-bold mb-2">{t('benefits.destinations.title')}</h3>
             <p className="text-muted-foreground">{t('benefits.destinations.desc')}</p>
           </div>
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="w-full py-16 px-4 bg-background">
        <div className="container mx-auto max-w-[var(--container-width)]">
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl text-white">
            <div className="flex-1 max-w-xl">
              <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold mb-6 backdrop-blur-md">
                {t('promo.badge')}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight font-['Outfit']">
                {t('promo.title')} <br/>{t('promo.title2')}
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                {t('promo.desc')}
              </p>
              <button 
                onClick={() => router.push('/pesquisa')}
                className="bg-secondary text-white font-bold py-3 px-8 rounded-xl hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
              >
                {t('promo.button')}
              </button>
            </div>
            <div className="flex-1 w-full relative hidden md:block overflow-hidden rounded-2xl shadow-2xl border-4 border-white/10 h-80">
              <Image src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800" alt="Resort Angola" fill sizes="50vw" className="object-cover" />
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
                {t('featured.title')}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t('featured.subtitle')}
              </p>
            </div>
            <button onClick={() => router.push('/pesquisa')} className="text-primary font-semibold hover:underline flex items-center text-lg">
              {t('featured.viewAll')} <span className="ml-2">&rarr;</span>
            </button>
          </div>
          
          {/* Tabs for cities */}
          <div className="flex space-x-8 border-b border-border mb-10 overflow-x-auto pb-3 scrollbar-hide text-lg">
            <button onClick={() => setActiveProvince('Todas')} className={`${activeProvince === 'Todas' ? 'text-primary font-bold border-b-2 border-primary' : 'text-muted-foreground hover:text-text'} pb-3 whitespace-nowrap transition-colors`}>{t('featured.allProvinces')}</button>
            <button onClick={() => setActiveProvince('Luanda')} className={`${activeProvince === 'Luanda' ? 'text-primary font-bold border-b-2 border-primary' : 'text-muted-foreground hover:text-text'} pb-3 whitespace-nowrap transition-colors`}>Luanda</button>
            <button onClick={() => setActiveProvince('Benguela')} className={`${activeProvince === 'Benguela' ? 'text-primary font-bold border-b-2 border-primary' : 'text-muted-foreground hover:text-text'} pb-3 whitespace-nowrap transition-colors`}>Benguela</button>
            <button onClick={() => setActiveProvince('Huíla')} className={`${activeProvince === 'Huíla' ? 'text-primary font-bold border-b-2 border-primary' : 'text-muted-foreground hover:text-text'} pb-3 whitespace-nowrap transition-colors`}>Huíla</button>
            <button onClick={() => setActiveProvince('Cabinda')} className={`${activeProvince === 'Cabinda' ? 'text-primary font-bold border-b-2 border-primary' : 'text-muted-foreground hover:text-text'} pb-3 whitespace-nowrap transition-colors`}>Cabinda</button>
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
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((prop: any) => {
                let img = prop.images?.[0]?.path || prop.imageUrl;
                if (!img || !img.startsWith('http')) {
                  img = dummyProperties[prop.id % 4]?.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800";
                }
                return (
                  <PropertyCard 
                    key={prop.id}
                    id={prop.id}
                    title={prop.name || prop.title}
                    location={`${prop.municipality || ''}, ${prop.province || prop.location}`.replace(/^, /, '')}
                    price={prop.price_per_night || prop.price}
                    oldPrice={prop.oldPrice}
                    rating={prop.rating || 4.8}
                    reviews={prop.reviews || 42}
                    imageUrl={img}
                  />
                );
              })
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-10">
                <p className="text-muted-foreground text-lg">Nenhuma propriedade encontrada em {activeProvince}.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
