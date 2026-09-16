'use client';

// FlowPilot - Client-side Map View Component
// Uses Leaflet for interactive maps

import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Truck, Car, Route } from '../lib/types';
import { getAllLocations } from '../lib/data/locations';

// Fix for Leaflet icon path issue
// @ts-ignore - Leaflet icon types issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

// Color palette for routes
const routeColors = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#84cc16', // lime
  '#eab308', // yellow
  '#14b8a6', // teal
  '#f97316', // orange
];

interface MapViewClientProps {
  trucks: Truck[];
  cars: Car[];
  routes: Route[];
}

export default function MapViewClient({ trucks, cars, routes }: MapViewClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routesRef = useRef<L.LayerGroup | null>(null);

  // Memoize locations
  const locations = useMemo(() => getAllLocations(), []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !leafletMapRef.current) {
      // Initialize Leaflet map
      const map = L.map(mapRef.current!, {
        center: [48.8566, 2.3522], // Default to Paris
        zoom: 6,
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      leafletMapRef.current = map;
      markersRef.current = L.layerGroup().addTo(map);
      routesRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update map with locations and routes
  useEffect(() => {
    if (!leafletMapRef.current || !markersRef.current || !routesRef.current) return;

    // Clear existing layers
    if (markersRef.current) markersRef.current.clearLayers();
    if (routesRef.current) routesRef.current.clearLayers();

    const allLatLngs: L.LatLng[] = [];

    // Add markers for all locations
    locations.forEach((location) => {
      const marker = L.marker([location.coordinates.lat, location.coordinates.lng], {
        title: location.name,
      });
      
      // Custom popup
      const popupContent = `<b>${location.name}</b><br>${location.address}`;
      marker.bindPopup(popupContent);
      if (markersRef.current) marker.addTo(markersRef.current);
      
      allLatLngs.push(L.latLng(location.coordinates.lat, location.coordinates.lng));
    });

    // Add routes
    if (routes.length > 0) {
      routes.forEach((route, index) => {
        const color = routeColors[index % routeColors.length];
        
        // Find truck location
        const truck = trucks.find(t => t.id === route.truckId);
        if (!truck) return;

        const truckLocation = locations.find(loc => loc.id === truck.currentLocation);
        if (!truckLocation) return;

        // Build route coordinates: depot -> stops -> depot
        const routeCoordinates: L.LatLng[] = [
          L.latLng(truckLocation.coordinates.lat, truckLocation.coordinates.lng),
        ];

        route.stops.forEach((stop) => {
          routeCoordinates.push(L.latLng(stop.location.coordinates.lat, stop.location.coordinates.lng));
        });

        // Return to depot
        routeCoordinates.push(L.latLng(truckLocation.coordinates.lat, truckLocation.coordinates.lng));

        // Create polyline
        const polyline = L.polyline(routeCoordinates, {
          color,
          weight: 4,
          opacity: 0.8,
        });
        
        polyline.bindPopup(`<b>Route ${route.truckId}</b><br>Distance: ${route.totalDistance.toFixed(1)} km<br>Cars: ${route.carCount}`);
        if (routesRef.current) polyline.addTo(routesRef.current);
      });
    }

    // Fit map to all locations
    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      leafletMapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [trucks, cars, routes, locations]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (leafletMapRef.current) {
        setTimeout(() => {
          leafletMapRef.current?.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div
        ref={mapRef}
        className="absolute inset-0"
        style={{ minHeight: '600px' }}
      />
      
      {/* Map Controls */}
      <div className="absolute top-2 right-2 z-10 bg-white rounded shadow">
        <button
          onClick={() => {
            if (leafletMapRef.current) {
              leafletMapRef.current.setView([48.8566, 2.3522], 6);
            }
          }}
          className="p-2 hover:bg-gray-100"
          title="Reset View"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 z-10 bg-white rounded shadow p-2 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span>📍</span>
          <span>Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-blue-600 rounded"></div>
          <span>Route</span>
        </div>
      </div>
    </>
  );
}
