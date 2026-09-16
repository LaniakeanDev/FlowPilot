// FlowPilot - Hardcoded Location Data (French Locations for MVP)

import type { Location } from '../types';

/**
 * French locations for CEVA FVL MVP
 * Includes depots and major dealership cities
 */
const locations: Location[] = [
  // ============================================
  // Depots (Starting points for trucks)
  // ============================================
  {
    id: 'DEPOT-PARIS',
    name: 'CEVA Depot Paris',
    address: '123 Rue de la Logistique, 75012 Paris, France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    type: 'depot',
  },
  {
    id: 'DEPOT-LYON',
    name: 'CEVA Depot Lyon',
    address: '456 Avenue des Transports, 69000 Lyon, France',
    coordinates: { lat: 45.7640, lng: 4.8357 },
    type: 'depot',
  },
  {
    id: 'DEPOT-MARSEILLE',
    name: 'CEVA Depot Marseille',
    address: '789 Boulevard de la Mer, 13000 Marseille, France',
    coordinates: { lat: 43.2965, lng: 5.3698 },
    type: 'depot',
  },
  
  // ============================================
  // Pickup Locations (Manufacturing plants)
  // ============================================
  {
    id: 'PLANT-PARIS',
    name: 'Paris Manufacturing Plant',
    address: 'Zone Industrielle Paris Nord, 93420 Villepinte, France',
    coordinates: { lat: 48.9686, lng: 2.5206 },
    type: 'pickup',
  },
  {
    id: 'PLANT-RENNES',
    name: 'Rennes Manufacturing Plant',
    address: 'Usine Renault, 35000 Rennes, France',
    coordinates: { lat: 48.1147, lng: -1.6794 },
    type: 'pickup',
  },
  
  // ============================================
  // Delivery Locations (Dealerships)
  // ============================================
  {
    id: 'DEALER-PARIS-01',
    name: 'Paris Dealership Central',
    address: '55 Avenue des Champs-Élysées, 75008 Paris, France',
    coordinates: { lat: 48.8699, lng: 2.3086 },
    type: 'delivery',
  },
  {
    id: 'DEALER-PARIS-02',
    name: 'Paris Dealership West',
    address: '123 Boulevard de la République, 92000 Nanterre, France',
    coordinates: { lat: 48.8918, lng: 2.1876 },
    type: 'delivery',
  },
  {
    id: 'DEALER-LYON',
    name: 'Lyon Dealership',
    address: 'Place Antonin Poncet, 69002 Lyon, France',
    coordinates: { lat: 45.7589, lng: 4.8414 },
    type: 'delivery',
  },
  {
    id: 'DEALER-MARSEILLE',
    name: 'Marseille Dealership',
    address: 'La Canebière, 13001 Marseille, France',
    coordinates: { lat: 43.2964, lng: 5.3700 },
    type: 'delivery',
  },
  {
    id: 'DEALER-BORDEAUX',
    name: 'Bordeaux Dealership',
    address: 'Place de la Bourse, 33000 Bordeaux, France',
    coordinates: { lat: 44.8378, lng: -0.5792 },
    type: 'delivery',
  },
  {
    id: 'DEALER-LILLE',
    name: 'Lille Dealership',
    address: 'Grand Place, 59800 Lille, France',
    coordinates: { lat: 50.6292, lng: 3.0573 },
    type: 'delivery',
  },
  {
    id: 'DEALER-TOULOUSE',
    name: 'Toulouse Dealership',
    address: 'Place du Capitole, 31000 Toulouse, France',
    coordinates: { lat: 43.6045, lng: 1.4442 },
    type: 'delivery',
  },
  {
    id: 'DEALER-NANTES',
    name: 'Nantes Dealership',
    address: 'Place du Bouffay, 44000 Nantes, France',
    coordinates: { lat: 47.2184, lng: -1.5536 },
    type: 'delivery',
  },
];

/**
 * Get a location by its ID
 */
export function getLocationById(id: string): Location | undefined {
  return locations.find(loc => loc.id === id);
}

/**
 * Get all locations
 */
export function getAllLocations(): Location[] {
  return [...locations];
}

/**
 * Get depots only
 */
export function getDepots(): Location[] {
  return locations.filter(loc => loc.type === 'depot');
}

/**
 * Get delivery locations only
 */
export function getDeliveryLocations(): Location[] {
  return locations.filter(loc => loc.type === 'delivery');
}

/**
 * Get pickup locations only
 */
export function getPickupLocations(): Location[] {
  return locations.filter(loc => loc.type === 'pickup');
}

export default locations;
