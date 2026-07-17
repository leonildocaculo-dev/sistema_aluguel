"use client";

import React, { useEffect, useState } from 'react';
import { favoriteService } from '../../../services/favoriteService';
import { PropertyCard } from '../../../components/cards/PropertyCard';
import { Loader2, Heart } from 'lucide-react';
import { useFavoriteStore } from '../../../stores/favoriteStore';
import Link from 'next/link';

export function ClientFavoritesClient() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { initializeFavorites, favoriteIds } = useFavoriteStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      await initializeFavorites();
      const data = await favoriteService.getFavorites();
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar otimisticamente (caso o utilizador remova um favorito nesta view, ele desaparece)
  const displayedProperties = properties.filter(p => favoriteIds.includes(p.id));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (displayedProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Heart className="h-10 w-10 text-primary opacity-50" />
        </div>
        <h3 className="text-xl font-bold text-text mb-2">Sem favoritos ainda</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Comece a explorar propriedades e guarde as suas favoritas clicando no ícone do coração.
        </p>
        <Link href="/pesquisa" className="bg-primary text-white font-medium px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
          Explorar Propriedades
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Os Meus Favoritos</h2>
          <p className="text-muted-foreground mt-1">
            Propriedades que guardou para ver mais tarde.
          </p>
        </div>
        <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
          {displayedProperties.length} propriedades
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProperties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.name}
            location={`${property.province}, ${property.municipality}`}
            price={property.price_per_night}
            rating={property.rating || 5.0}
            reviews={property.reviews_count || 0}
            imageUrl={property.images?.[0]?.image_path || '/placeholder-property.jpg'}
          />
        ))}
      </div>
    </div>
  );
}
