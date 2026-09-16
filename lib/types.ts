// FlowPilot - TypeScript Type Definitions

// ============================================
// Core Entities
// ============================================

/** Unique identifier reference for locations */
export type LocationRef = string;

/** Coordinates for geographic calculations */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** Location entity representing depots, pickup points, and delivery points */
export interface Location {
  id: LocationRef;
  name: string;
  address: string;
  coordinates: Coordinates;
  type: 'depot' | 'pickup' | 'delivery';
}

/** Driver information */
export interface Driver {
  name: string;
  maxDrivingHours: number; // Default: 9 hours (EU regulation)
}

/** Truck entity with capacity and constraints */
export interface Truck {
  id: string;
  capacity: number; // Max number of cars
  weightLimit: number; // Max weight in kg
  driver: Driver;
  currentLocation: LocationRef; // Depot ID where truck is based
  status: 'available' | 'assigned' | 'in_transit';
}

/** Car entity representing vehicles to be transported */
export interface Car {
  vin: string; // Unique Vehicle Identification Number
  type: 'SUV' | 'car';
  weight: number; // kg
  pickupLocation: LocationRef;
  deliveryLocation: LocationRef;
  dueDate: string; // ISO date string
  assignedTruckId: string | null;
}

// ============================================
// Route & Optimization Types
// ============================================

/** A stop in a route (location with associated cars) */
export interface RouteStop {
  location: Location;
  cars: Car[]; // Cars to pickup or deliver at this stop
  type: 'pickup' | 'delivery';
}

/** Complete route for a truck */
export interface Route {
  truckId: string;
  stops: RouteStop[]; // Ordered list of stops
  totalDistance: number; // km
  totalTime: number; // hours
  totalWeight: number; // kg
  carCount: number; // Number of cars assigned
}

/** Result of route optimization */
export interface OptimizationResult {
  routes: Route[];
  unassignedCars: Car[];
  totalDistance: number; // km
  previousTotalDistance: number; // km (for comparison)
  savings: number; // km saved
}

/** Input for the optimization algorithm */
export interface OptimizationInput {
  trucks: Truck[];
  cars: Car[];
  locations: Location[];
}

// ============================================
// UI State Types
// ============================================

/** Filter options for truck list */
export type TruckFilter = 'all' | 'available' | 'assigned' | 'in_transit';

/** Filter options for car list */
export type CarFilter = 'all' | 'assigned' | 'unassigned';

/** View mode for the dashboard */
export type ViewMode = 'list' | 'map';

/** Assignment action */
export interface AssignmentAction {
  type: 'assign' | 'unassign';
  carVin: string;
  truckId?: string; // Required for assign, optional for unassign
}

// ============================================
// Helper Types
// ============================================

/** Truck with computed assignment info */
export interface TruckWithAssignment extends Truck {
  assignedCars: Car[];
  currentLoad: number; // Number of cars currently assigned
  currentWeight: number; // kg currently loaded
  utilization: number; // Percentage (0-100)
}

/** Car with resolved location names */
export interface CarWithDetails extends Car {
  pickupLocationName: string;
  deliveryLocationName: string;
  pickupCoordinates: Coordinates;
  deliveryCoordinates: Coordinates;
}

/** Group of cars by delivery location */
export interface CarGroup {
  locationId: LocationRef;
  locationName: string;
  cars: Car[];
  totalCars: number;
  totalWeight: number;
}

// ============================================
// Algorithm Types
// ============================================

/** Distance matrix for locations */
export type DistanceMatrix = Map<LocationRef, Map<LocationRef, number>>;

/** Cluster of cars grouped by destination */
export interface CarCluster {
  destination: LocationRef;
  cars: Car[];
  totalWeight: number;
  carCount: number;
}

/** TSP (Traveling Salesman Problem) solution */
export interface TSPSolution {
  order: LocationRef[]; // Ordered list of location IDs
  totalDistance: number;
}
