// FlowPilot - Distance Calculation (Haversine Formula)

import type { Coordinates } from '../../lib/types';

/**
 * Earth radius in kilometers
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * 
 * @param coord1 - First coordinate (lat, lng)
 * @param coord2 - Second coordinate (lat, lng)
 * @returns Distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const lat1 = toRadians(coord1.lat);
  const lon1 = toRadians(coord1.lng);
  const lat2 = toRadians(coord2.lat);
  const lon2 = toRadians(coord2.lng);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return distance;
}

/**
 * Calculate total distance for a route (list of coordinates)
 * 
 * @param coordinates - Array of coordinates in order
 * @returns Total distance in kilometers
 */
export function calculateRouteDistance(coordinates: Coordinates[]): number {
  if (coordinates.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += calculateDistance(coordinates[i], coordinates[i + 1]);
  }
  return totalDistance;
}

/**
 * Estimate driving time based on distance
 * Average speed: 80 km/h (realistic for truck transport in Europe)
 * 
 * @param distanceKm - Distance in kilometers
 * @returns Time in hours
 */
export function estimateDrivingTime(distanceKm: number): number {
  const AVERAGE_SPEED_KMH = 80;
  return distanceKm / AVERAGE_SPEED_KMH;
}

/**
 * Create a distance matrix for a list of locations
 * This pre-computes all pairwise distances for optimization
 * 
 * @param coordinates - Array of coordinate objects with IDs
 * @returns Distance matrix as nested Map
 */
export function createDistanceMatrix(
  locationsWithCoords: Array<{ id: string; coordinates: Coordinates }>
): Map<string, Map<string, number>> {
  const matrix = new Map<string, Map<string, number>>();

  for (const loc1 of locationsWithCoords) {
    const row = new Map<string, number>();
    for (const loc2 of locationsWithCoords) {
      const distance = calculateDistance(loc1.coordinates, loc2.coordinates);
      row.set(loc2.id, distance);
    }
    matrix.set(loc1.id, row);
  }

  return matrix;
}

export default {
  calculateDistance,
  calculateRouteDistance,
  estimateDrivingTime,
  createDistanceMatrix,
};
