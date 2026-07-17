"use client";

import * as React from "react"
import { useRouter } from "next/navigation"
import { Star, MapPin, Heart } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import { useFavoriteStore } from "../../stores/favoriteStore"
import { useAuthStore } from "../../stores/authStore"

export interface PropertyCardProps {
  id: number
  title: string
  location: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  imageUrl: string
  isFavorite?: boolean
  className?: string
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  oldPrice,
  rating,
  reviews,
  imageUrl,
  isFavorite = false,
  className
}: PropertyCardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { favoriteIds, toggleFavorite } = useFavoriteStore()
  const [imgSrc, setImgSrc] = React.useState(imageUrl)
  
  // Use global store state if initialized, otherwise fallback to prop
  const isActualFavorite = React.useMemo(() => {
    if (!isAuthenticated) return false;
    // If the store is empty but prop is true, it might be before initialization
    if (favoriteIds.length === 0 && isFavorite) return true;
    return favoriteIds.includes(id);
  }, [favoriteIds, id, isAuthenticated, isFavorite]);

  React.useEffect(() => {
    setImgSrc(imageUrl);
  }, [imageUrl]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    await toggleFavorite(id);
  };

  return (
    <Card 
      onClick={() => router.push(`/propriedade/${id}`)}
      className={cn("overflow-hidden group cursor-pointer border-border/50 hover:border-primary/30 transition-colors", className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* Optimized Image with lazy loading */}
        <Image 
          src={imgSrc} 
          alt={title} 
          fill
          onError={() => setImgSrc("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-surface/80 hover:bg-surface backdrop-blur-sm transition-colors text-muted-foreground hover:text-danger z-10"
        >
          <Heart className={cn("h-5 w-5", isActualFavorite && "fill-danger text-danger")} />
        </button>
      </div>

      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 text-text">{title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
          <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-semibold">
            <Star className="h-3.5 w-3.5 fill-primary mr-1" />
            {rating}
          </div>
        </div>

        <div className="flex items-end justify-between mt-2 pt-2 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Preço por noite</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-text">
                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(price)}
              </span>
              {oldPrice && (
                <span className="text-sm line-through text-muted-foreground">
                  {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(oldPrice)}
                </span>
              )}
            </div>
          </div>
          <Button variant="secondary" size="sm" className="hidden sm:flex font-semibold shadow-sm">
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
