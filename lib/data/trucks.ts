// FlowPilot - Hardcoded Truck Data (CEVA FVL MVP)

import type { Truck } from '../types';

/**
 * CEVA FVL Standard Truck Profile
 * - Capacity: 10 cars (typical for car carrier trucks)
 * - Weight Limit: 40,000 kg (standard for heavy transport in EU)
 * - Max Driving Hours: 9 hours (EU regulation)
 */
const TRUCK_CAPACITY = 10;
const TRUCK_WEIGHT_LIMIT = 40000; // kg
const MAX_DRIVING_HOURS = 9; // hours

/**
 * Driver names for MVP
 */
const drivers = [
  { name: 'Pierre Martin', maxDrivingHours: MAX_DRIVING_HOURS },
  { name: 'Jean Dupont', maxDrivingHours: MAX_DRIVING_HOURS },
  { name: 'Marie Leroy', maxDrivingHours: MAX_DRIVING_HOURS },
  { name: 'Paul Bernard', maxDrivingHours: MAX_DRIVING_HOURS },
  { name: 'Sophie Moreau', maxDrivingHours: MAX_DRIVING_HOURS },
  { name: 'Luc Dubois', maxDrivingHours: MAX_DRIVING_HOURS },
  { name: 'Nicolas Petit', maxDrivingHours: MAX_DRIVING_HOURS },
  { name: 'Thomas Lambert', maxDrivingHours: MAX_DRIVING_HOURS },
  { name: 'Cécile Faure', maxDrivingHours: MAX_DRIVING_HOURS },
  { name: 'Antoine Roussel', maxDrivingHours: MAX_DRIVING_HOURS },
];

/**
 * Trucks based at different depots
 */
const trucks: Truck[] = [
  // Trucks based at Paris Depot
  {
    id: 'TRK-001',
    capacity: TRUCK_CAPACITY,
    weightLimit: TRUCK_WEIGHT_LIMIT,
    driver: drivers[0],
    currentLocation: 'DEPOT-PARIS',
    status: 'available',
  },
  {
    id: 'TRK-002',
    capacity: TRUCK_CAPACITY,
    weightLimit: TRUCK_WEIGHT_LIMIT,
    driver: drivers[1],
    currentLocation: 'DEPOT-PARIS',
    status: 'available',
  },
  {
    id: 'TRK-003',
    capacity: TRUCK_CAPACITY,
    weightLimit: TRUCK_WEIGHT_LIMIT,
    driver: drivers[2],
    currentLocation: 'DEPOT-PARIS',
    status: 'available',
  },
  // Trucks based at Lyon Depot
  {
    id: 'TRK-004',
    capacity: TRUCK_CAPACITY,
    weightLimit: TRUCK_WEIGHT_LIMIT,
    driver: drivers[3],
    currentLocation: 'DEPOT-LYON',
    status: 'available',
  },
  {
    id: 'TRK-005',
    capacity: TRUCK_CAPACITY,
    weightLimit: TRUCK_WEIGHT_LIMIT,
    driver: drivers[4],
    currentLocation: 'DEPOT-LYON',
    status: 'available',
  },
  // Trucks based at Marseille Depot
  {
    id: 'TRK-006',
    capacity: TRUCK_CAPACITY,
    weightLimit: TRUCK_WEIGHT_LIMIT,
    driver: drivers[5],
    currentLocation: 'DEPOT-MARSEILLE',
    status: 'available',
  },
  {
    id: 'TRK-007',
    capacity: TRUCK_CAPACITY,
    weightLimit: TRUCK_WEIGHT_LIMIT,
    driver: drivers[6],
    currentLocation: 'DEPOT-MARSEILLE',
    status: 'available',
  },
  // Additional trucks for larger scenarios
  {
    id: 'TRK-008',
    capacity: TRUCK_CAPACITY,
    weightLimit: TRUCK_WEIGHT_LIMIT,
    driver: drivers[7],
    currentLocation: 'DEPOT-PARIS',
    status: 'available',
  },
  {
    id: 'TRK-009',
    capacity: TRUCK_CAPACITY,
    weightLimit: TRUCK_WEIGHT_LIMIT,
    driver: drivers[8],
    currentLocation: 'DEPOT-LYON',
    status: 'available',
  },
  {
    id: 'TRK-010',
    capacity: TRUCK_CAPACITY,
    weightLimit: TRUCK_WEIGHT_LIMIT,
    driver: drivers[9],
    currentLocation: 'DEPOT-PARIS',
    status: 'available',
  },
];

/**
 * Get all trucks
 */
export function getAllTrucks(): Truck[] {
  return [...trucks];
}

/**
 * Get truck by ID
 */
export function getTruckById(id: string): Truck | undefined {
  return trucks.find(truck => truck.id === id);
}

/**
 * Get trucks by depot/location
 */
export function getTrucksByLocation(locationId: string): Truck[] {
  return trucks.filter(truck => truck.currentLocation === locationId);
}

/**
 * Get available trucks
 */
export function getAvailableTrucks(): Truck[] {
  return trucks.filter(truck => truck.status === 'available');
}

/**
 * Default truck constants
 */
export const TRUCK_CONSTANTS = {
  CAPACITY: TRUCK_CAPACITY,
  WEIGHT_LIMIT: TRUCK_WEIGHT_LIMIT,
  MAX_DRIVING_HOURS,
};

export default trucks;
