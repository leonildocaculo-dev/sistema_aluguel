import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { api } from '../services/api';

// Usamos a chave do .env
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function MapSearch() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Tema escuro premium
      center: [13.2343, -8.8390], // Luanda por defeito
      zoom: 12
    });

    // Evento de Drag/Pan com Debounce
    let debounceTimer: any;
    map.current.on('moveend', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetchPropertiesInView();
      }, 500);
    });

    return () => map.current?.remove();
  }, []);

  const fetchPropertiesInView = async () => {
    if (!map.current) return;
    const bounds = map.current.getBounds();
    if (!bounds) return;

    try {
      // Pedimos ao backend as propriedades contidas no Bounding Box visível
      const response = await api.get('/search/geo', {
        params: {
          minLng: bounds.getWest(),
          minLat: bounds.getSouth(),
          maxLng: bounds.getEast(),
          maxLat: bounds.getNorth(),
        }
      });
      
      const newProperties = response.data;
      setProperties(newProperties);
      updateMarkers(newProperties);
    } catch (error) {
      console.error('Erro ao buscar propriedades do mapa:', error);
    }
  };

  const updateMarkers = (data: any[]) => {
    if (!map.current) return;

    // Limpar markers antigos
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Adicionar novos
    data.forEach(property => {
      // Usar latitude e longitude (as novas colunas sem PostGIS)
      if (!property.latitude || !property.longitude) return;

      // Criar elemento HTML personalizado para o Marker (ex: Preço)
      const el = document.createElement('div');
      el.className = 'bg-primary-500 text-white font-bold rounded-full px-3 py-1 text-sm shadow-lg border border-white cursor-pointer transform hover:scale-110 transition-transform';
      el.textContent = `${property.price_per_night}Kz`;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([property.longitude, property.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2 bg-background text-white rounded-lg">
            <h3 class="font-bold">${property.name}</h3>
            <p class="text-gray-400 text-xs">${property.municipality}</p>
          </div>
        `))
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  };

  return (
    <div className="w-full h-[400px] lg:h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
      <div className="absolute top-4 left-4 z-10 bg-surface/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <h3 className="text-white font-bold text-sm">Pesquisa Geoespacial</h3>
        <p className="text-gray-400 text-xs mt-1">Navegue no mapa para carregar propriedades.</p>
        <div className="mt-2 text-primary-400 text-xs font-mono">{properties.length} propriedades visíveis</div>
      </div>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
