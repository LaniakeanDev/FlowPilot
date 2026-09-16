'use client';

// FlowPilot - Map View Component (Simplified)
// Will use dynamic import for Leaflet to avoid SSR issues

import dynamic from 'next/dynamic';
import { usePlanning } from '../context/PlanningContext';

// Dynamically import the map component to avoid SSR issues with Leaflet
const DynamicMap = dynamic(
  () => import('./MapViewClient'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
          <p>Loading map...</p>
        </div>
      </div>
    ),
  }
);

export default function MapView() {
  const { trucks, cars, routes } = usePlanning();

  return (
    <div className="h-full bg-gray-100 rounded-lg relative overflow-hidden">
      <DynamicMap trucks={trucks} cars={cars} routes={routes} />
    </div>
  );
}
