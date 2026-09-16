// FlowPilot - TSP Solver (Nearest Neighbor Heuristic)

import type { LocationRef, TSPSolution, Coordinates } from '../../lib/types';
import { calculateDistance } from './distance';

/**
 * Solve Traveling Salesman Problem using Nearest Neighbor heuristic
 * 
 * Algorithm:
 * 1. Start at the depot
 * 2. Repeatedly visit the nearest unvisited location
 * 3. Return to the depot
 * 
 * Time complexity: O(n²)
 * 
 * @param locations - Array of location IDs to visit (excluding depot)
 * @param depotLocation - The starting/ending depot location
 * @param getCoordinates - Function to get coordinates for a location ID
 * @returns TSP solution with ordered stops and total distance
 */
export function solveTSPNearestNeighbor(
  locations: LocationRef[],
  depotLocation: LocationRef,
  getCoordinates: (id: LocationRef) => Coordinates | undefined
): TSPSolution {
  if (locations.length === 0) {
    return { order: [depotLocation], totalDistance: 0 };
  }

  const unvisited = new Set(locations);
  const order: LocationRef[] = [depotLocation];
  let currentLocation = depotLocation;
  let totalDistance = 0;

  while (unvisited.size > 0) {
    const currentCoords = getCoordinates(currentLocation);
    if (!currentCoords) break;

    let nearestLocation: LocationRef | null = null;
    let minDistance = Infinity;

    for (const location of unvisited) {
      const coords = getCoordinates(location);
      if (!coords) continue;

      const distance = calculateDistance(currentCoords, coords);
      if (distance < minDistance) {
        minDistance = distance;
        nearestLocation = location;
      }
    }

    if (nearestLocation) {
      order.push(nearestLocation);
      totalDistance += minDistance;
      unvisited.delete(nearestLocation);
      currentLocation = nearestLocation;
    } else {
      break;
    }
  }

  // Return to depot
  const depotCoords = getCoordinates(depotLocation);
  const lastCoords = getCoordinates(currentLocation);
  if (depotCoords && lastCoords) {
    totalDistance += calculateDistance(lastCoords, depotCoords);
  }

  return { order, totalDistance };
}

/**
 * Solve TSP with multiple starting points (for each truck's depot)
 * 
 * @param locationGroups - Map of depot -> locations to visit
 * @param getCoordinates - Function to get coordinates
 * @returns Map of depot -> TSP solution
 */
export function solveTSPForMultipleDepots(
  locationGroups: Map<LocationRef, LocationRef[]>, 
  getCoordinates: (id: LocationRef) => Coordinates | undefined
): Map<LocationRef, TSPSolution> {
  const solutions = new Map<LocationRef, TSPSolution>();

  for (const [depot, locations] of locationGroups) {
    const solution = solveTSPNearestNeighbor(locations, depot, getCoordinates);
    solutions.set(depot, solution);
  }

  return solutions;
}

/**
 * Create a simple route from a list of stops
 * 
 * @param stops - Ordered list of location IDs
 * @param getCoordinates - Function to get coordinates
 * @returns Total distance of the route
 */
export function calculateSimpleRouteDistance(
  stops: LocationRef[],
  getCoordinates: (id: LocationRef) => Coordinates | undefined
): number {
  if (stops.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    const coords1 = getCoordinates(stops[i]);
    const coords2 = getCoordinates(stops[i + 1]);
    if (coords1 && coords2) {
      totalDistance += calculateDistance(coords1, coords2);
    }
  }
  return totalDistance;
}

/**
 * Calculate total distance for all routes starting and ending at their depots
 * 
 * @param routes - Map of depot -> ordered stops
 * @param getCoordinates - Function to get coordinates
 * @returns Total distance across all routes
 */
export function calculateTotalDistanceForAllRoutes(
  routes: Map<LocationRef, LocationRef[]>, 
  getCoordinates: (id: LocationRef) => Coordinates | undefined
): number {
  let totalDistance = 0;

  for (const [depot, stops] of routes) {
    // Create full route: depot -> stops -> depot
    const fullRoute = [depot, ...stops, depot];
    totalDistance += calculateSimpleRouteDistance(fullRoute, getCoordinates);
  }

  return totalDistance;
}

export default {
  solveTSPNearestNeighbor,
  solveTSPForMultipleDepots,
  calculateSimpleRouteDistance,
  calculateTotalDistanceForAllRoutes,
};
