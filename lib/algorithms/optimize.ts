// FlowPilot - Route Optimization Algorithm

import type { Truck, Car, Location, Route, OptimizationResult, OptimizationInput, RouteStop } from '../../lib/types';
import { clusterCarsByDestination, sortClustersBySize, filterFittingClusters } from './cluster';
import { solveTSPNearestNeighbor, calculateTotalDistanceForAllRoutes } from './route';
import { estimateDrivingTime } from './distance';

/**
 * Create a location to coordinates map for quick lookup
 */
function createLocationMap(locations: Location[]): Map<string, Location> {
  const map = new Map<string, Location>();
  for (const loc of locations) {
    map.set(loc.id, loc);
  }
  return map;
}

/**
 * Get coordinates for a location ID
 */
function getCoordinates(locations: Location[], locationId: string): { lat: number; lng: number } | undefined {
  const loc = locations.find(l => l.id === locationId);
  return loc ? loc.coordinates : undefined;
}

/**
 * Assign clusters to trucks using First-Fit Decreasing algorithm
 * Largest clusters are assigned first to maximize efficiency
 */
function assignClustersToTrucks(
  clusters: ReturnType<typeof clusterCarsByDestination>,
  trucks: Truck[],
  locations: Location[]
): Map<string, { truck: Truck; cluster: ReturnType<typeof clusterCarsByDestination>[number] }> {
  const assignments = new Map<string, { truck: Truck; cluster: ReturnType<typeof clusterCarsByDestination>[number] }>();
  const sortedClusters = sortClustersBySize(clusters);
  const availableTrucks = [...trucks].sort((a, b) => {
    // Prefer trucks that are already at the cluster's pickup location
    // For simplicity, sort by ID for now
    return a.id.localeCompare(b.id);
  });

  // Track remaining capacity for each truck
  const truckCapacity: Map<string, { remainingSlots: number; remainingWeight: number }> = new Map();
  for (const truck of availableTrucks) {
    truckCapacity.set(truck.id, {
      remainingSlots: truck.capacity,
      remainingWeight: truck.weightLimit,
    });
  }

  for (const cluster of sortedClusters) {
    // Find fitting trucks
    const fittingTrucks = availableTrucks.filter(truck => {
      const capacity = truckCapacity.get(truck.id);
      if (!capacity) return false;
      return (
        cluster.carCount <= capacity.remainingSlots &&
        cluster.totalWeight <= capacity.remainingWeight
      );
    });

    if (fittingTrucks.length === 0) {
      // No truck can fit this cluster, skip it
      continue;
    }

    // For now, just assign to the first fitting truck
    // In a more advanced version, we'd consider proximity
    const selectedTruck = fittingTrucks[0];
    const capacity = truckCapacity.get(selectedTruck.id)!;

    assignments.set(cluster.destination, { truck: selectedTruck, cluster });

    // Update truck capacity
    truckCapacity.set(selectedTruck.id, {
      remainingSlots: capacity.remainingSlots - cluster.carCount,
      remainingWeight: capacity.remainingWeight - cluster.totalWeight,
    });
  }

  return assignments;
}

/**
 * Build routes from cluster assignments
 */
function buildRoutes(
  assignments: Map<string, { truck: Truck; cluster: ReturnType<typeof clusterCarsByDestination>[number] }>,
  locations: Location[]
): Route[] {
  const routes: Route[] = [];
  const locationMap = createLocationMap(locations);

  for (const [destination, assignment] of assignments) {
    const { truck, cluster } = assignment;
    
    // Create stops for this route
    // For now, simple approach: depot -> pickup -> delivery -> depot
    // In a real implementation, we'd have multiple pickups/deliveries
    
    const depot = locationMap.get(truck.currentLocation);
    const deliveryLoc = locationMap.get(destination);
    
    if (!depot || !deliveryLoc) continue;

    // For simplicity, assume all cars in the cluster are picked up from the same location
    // and delivered to the same location
    const pickupLoc = locationMap.get(cluster.cars[0].pickupLocation);
    
    const stops: RouteStop[] = [];
    
    // Pickup stop
    if (pickupLoc) {
      stops.push({
        location: pickupLoc,
        cars: cluster.cars,
        type: 'pickup',
      });
    }

    // Delivery stop
    stops.push({
      location: deliveryLoc,
      cars: cluster.cars,
      type: 'delivery',
    });

    // Calculate route distance
    const coordinates = [
      depot.coordinates,
      ...stops.map(s => s.location.coordinates),
      depot.coordinates, // Return to depot
    ];

    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const dist = calculateDistanceBetweenCoords(coordinates[i], coordinates[i + 1]);
      totalDistance += dist;
    }

    const totalTime = estimateDrivingTime(totalDistance);

    routes.push({
      truckId: truck.id,
      stops,
      totalDistance,
      totalTime,
      totalWeight: cluster.totalWeight,
      carCount: cluster.carCount,
    });
  }

  return routes;
}

/**
 * Simple Haversine distance calculation (duplicated to avoid import)
 */
function calculateDistanceBetweenCoords(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
  const toRadians = (deg: number) => deg * (Math.PI / 180);
  const lat1 = toRadians(coord1.lat);
  const lon1 = toRadians(coord1.lng);
  const lat2 = toRadians(coord2.lat);
  const lon2 = toRadians(coord2.lng);
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c; // Earth radius in km
}

/**
 * Main optimization function
 */
export function optimizeRoutes(input: OptimizationInput): OptimizationResult {
  const { trucks, cars, locations } = input;

  // Step 1: Cluster cars by destination
  const clusters = clusterCarsByDestination(cars);

  // Step 2: Assign clusters to trucks
  const assignments = assignClustersToTrucks(clusters, trucks, locations);

  // Step 3: Build routes from assignments
  const routes = buildRoutes(assignments, locations);

  // Calculate total distance
  const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);

  // Calculate previous total distance (current assignments)
  const previousTotalDistance = calculatePreviousDistance(cars, trucks, locations);

  // Find unassigned cars
  const assignedVins = new Set<string>();
  routes.forEach(route => {
    route.stops.forEach(stop => {
      stop.cars.forEach(car => {
        assignedVins.add(car.vin);
      });
    });
  });

  const unassignedCars = cars.filter(car => !assignedVins.has(car.vin));

  return {
    routes,
    unassignedCars,
    totalDistance,
    previousTotalDistance,
    savings: previousTotalDistance - totalDistance,
  };
}

/**
 * Calculate the total distance of current assignments (for comparison)
 */
function calculatePreviousDistance(cars: Car[], trucks: Truck[], locations: Location[]): number {
  const locationMap = createLocationMap(locations);
  const truckMap = new Map<string, Truck>();
  for (const truck of trucks) {
    truckMap.set(truck.id, truck);
  }

  let totalDistance = 0;

  // Group assigned cars by truck
  const carsByTruck: Map<string, Car[]> = new Map();
  for (const car of cars) {
    if (car.assignedTruckId) {
      if (!carsByTruck.has(car.assignedTruckId)) {
        carsByTruck.set(car.assignedTruckId, []);
      }
      carsByTruck.get(car.assignedTruckId)!.push(car);
    }
  }

  // Calculate distance for each truck's route
  for (const [truckId, truckCars] of carsByTruck) {
    const truck = truckMap.get(truckId);
    if (!truck) continue;

    const depot = locationMap.get(truck.currentLocation);
    if (!depot) continue;

    // Simple calculation: depot -> pickup -> delivery -> depot
    // This is a simplified version; real implementation would be more complex
    for (const car of truckCars) {
      const pickupLoc = locationMap.get(car.pickupLocation);
      const deliveryLoc = locationMap.get(car.deliveryLocation);

      if (pickupLoc && deliveryLoc) {
        // Depot to pickup
        totalDistance += calculateDistanceBetweenCoords(depot.coordinates, pickupLoc.coordinates);
        // Pickup to delivery
        totalDistance += calculateDistanceBetweenCoords(pickupLoc.coordinates, deliveryLoc.coordinates);
        // Delivery to depot (only once per truck, not per car)
      }
    }

    // Add return to depot for each truck (simplified)
    if (truckCars.length > 0) {
      const lastCar = truckCars[truckCars.length - 1];
      const lastDelivery = locationMap.get(lastCar.deliveryLocation);
      if (lastDelivery) {
        totalDistance += calculateDistanceBetweenCoords(lastDelivery.coordinates, depot.coordinates);
      }
    }
  }

  return totalDistance;
}

export default {
  optimizeRoutes,
};
