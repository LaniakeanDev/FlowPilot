// FlowPilot - Car Clustering by Destination

import type { Car, CarCluster, LocationRef } from '../../lib/types';

/**
 * Group cars by their delivery location
 * 
 * @param cars - Array of cars to cluster
 * @returns Array of car clusters grouped by destination
 */
export function clusterCarsByDestination(cars: Car[]): CarCluster[] {
  const clusters: Map<LocationRef, CarCluster> = new Map();

  for (const car of cars) {
    if (!clusters.has(car.deliveryLocation)) {
      clusters.set(car.deliveryLocation, {
        destination: car.deliveryLocation,
        cars: [],
        totalWeight: 0,
        carCount: 0,
      });
    }

    const cluster = clusters.get(car.deliveryLocation)!;
    cluster.cars.push(car);
    cluster.totalWeight += car.weight;
    cluster.carCount += 1;
  }

  return Array.from(clusters.values());
}

/**
 * Sort clusters by car count (descending) for First-Fit Decreasing algorithm
 * 
 * @param clusters - Array of car clusters
 * @returns Sorted clusters (largest first)
 */
export function sortClustersBySize(clusters: CarCluster[]): CarCluster[] {
  return [...clusters].sort((a, b) => b.carCount - a.carCount);
}

/**
 * Sort clusters by total weight (descending)
 * 
 * @param clusters - Array of car clusters
 * @returns Sorted clusters (heaviest first)
 */
export function sortClustersByWeight(clusters: CarCluster[]): CarCluster[] {
  return [...clusters].sort((a, b) => b.totalWeight - a.totalWeight);
}

/**
 * Filter clusters that can fit on a truck
 * 
 * @param clusters - Array of car clusters
 * @param capacity - Truck capacity (number of cars)
 * @param weightLimit - Truck weight limit (kg)
 * @returns Clusters that can fit on the truck
 */
export function filterFittingClusters(
  clusters: CarCluster[],
  capacity: number,
  weightLimit: number
): CarCluster[] {
  return clusters.filter(
    cluster => cluster.carCount <= capacity && cluster.totalWeight <= weightLimit
  );
}

/**
 * Find the best cluster for a truck based on proximity
 * 
 * @param clusters - Available clusters
 * @param truckLocation - Current location of the truck
 * @param distanceMatrix - Pre-computed distance matrix
 * @returns Best cluster or null if none available
 */
export function findBestClusterByProximity(
  clusters: CarCluster[],
  truckLocation: LocationRef,
  distanceMatrix: Map<LocationRef, Map<LocationRef, number>>
): CarCluster | null {
  if (clusters.length === 0) return null;

  // For each cluster, find the minimum distance from truck location to any location in the cluster
  let bestCluster: CarCluster | null = null;
  let minDistance = Infinity;

  for (const cluster of clusters) {
    // Get the delivery location of the cluster
    const deliveryLoc = cluster.destination;
    
    // Get distance from truck location to delivery location
    const truckRow = distanceMatrix.get(truckLocation);
    if (!truckRow) continue;
    
    const distance = truckRow.get(deliveryLoc);
    if (distance === undefined) continue;

    if (distance < minDistance) {
      minDistance = distance;
      bestCluster = cluster;
    }
  }

  return bestCluster;
}

/**
 * Group cars by both pickup and delivery locations for more granular clustering
 * 
 * @param cars - Array of cars
 * @returns Map of pickup->delivery->cars
 */
export function clusterCarsByPickupAndDelivery(cars: Car[]): Map<string, Map<string, Car[]>> {
  const clusters: Map<string, Map<string, Car[]>> = new Map();

  for (const car of cars) {
    if (!clusters.has(car.pickupLocation)) {
      clusters.set(car.pickupLocation, new Map());
    }
    
    const pickupCluster = clusters.get(car.pickupLocation)!;
    if (!pickupCluster.has(car.deliveryLocation)) {
      pickupCluster.set(car.deliveryLocation, []);
    }
    
    pickupCluster.get(car.deliveryLocation)!.push(car);
  }

  return clusters;
}

export default {
  clusterCarsByDestination,
  sortClustersBySize,
  sortClustersByWeight,
  filterFittingClusters,
  findBestClusterByProximity,
  clusterCarsByPickupAndDelivery,
};
