'use client';

// FlowPilot - Planning Context
// Central state management for the application

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { Truck, Car, Location, Route, OptimizationResult, ViewMode, TruckFilter, CarFilter } from '../lib/types';
import { getAllTrucks, getTruckById, TRUCK_CONSTANTS } from '../lib/data/trucks';
import { getAllCars, getCarByVIN, CAR_WEIGHTS_CONST } from '../lib/data/cars';
import { getAllLocations, getLocationById } from '../lib/data/locations';

// ============================================
// Context Types
// ============================================

interface PlanningState {
  // Data
  trucks: Truck[];
  cars: Car[];
  locations: Location[];
  
  // UI State
  viewMode: ViewMode;
  truckFilter: TruckFilter;
  carFilter: CarFilter;
  selectedTruckId: string | null;
  selectedCarVin: string | null;
  
  // Optimization
  routes: Route[];
  optimizationResult: OptimizationResult | null;
  isOptimizing: boolean;
  
  // Search
  searchQuery: string;
}

interface PlanningActions {
  // Truck actions
  setTruckFilter: (filter: TruckFilter) => void;
  selectTruck: (truckId: string | null) => void;
  
  // Car actions
  setCarFilter: (filter: CarFilter) => void;
  selectCar: (vin: string | null) => void;
  
  // Assignment actions
  assignCarToTruck: (carVin: string, truckId: string) => { success: boolean; message: string };
  unassignCarFromTruck: (carVin: string) => void;
  
  // View actions
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  
  // Optimization actions
  runOptimization: () => Promise<void>;
  applyOptimization: () => void;
  
  // Reset
  resetAllAssignments: () => void;
}

interface PlanningContextType extends PlanningState, PlanningActions {
  // Computed values
  filteredTrucks: Truck[];
  filteredCars: Car[];
  carsByDeliveryLocation: Record<string, Car[]>;
  getTruckLoadInfo: (truckId: string) => any | null;
  getAssignedCarsForTruck: (truckId: string) => Car[];
}

// ============================================
// Context Creation
// ============================================

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate the current load for a truck
 */
function calculateTruckLoad(truckId: string, cars: Car[]): { count: number; weight: number } {
  const assignedCars = cars.filter(car => car.assignedTruckId === truckId);
  const count = assignedCars.length;
  const weight = assignedCars.reduce((sum, car) => sum + car.weight, 0);
  return { count, weight };
}

/**
 * Check if a car can be assigned to a truck
 */
function canAssignCarToTruck(car: Car | undefined, truck: Truck | undefined, cars: Car[]): { canAssign: boolean; message: string } {
  if (!car || !truck) {
    return { canAssign: false, message: 'Car or truck not found' };
  }
  
  const { count, weight } = calculateTruckLoad(truck.id, cars);
  
  // Check capacity
  if (count >= truck.capacity) {
    return { canAssign: false, message: `Truck ${truck.id} is at full capacity (${truck.capacity} cars)` };
  }
  
  // Check weight limit
  if (weight + car.weight > truck.weightLimit) {
    return { canAssign: false, message: `Truck ${truck.id} would exceed weight limit (${truck.weightLimit} kg)` };
  }
  
  // Check if car is already assigned to this truck
  if (car.assignedTruckId === truck.id) {
    return { canAssign: false, message: `Car ${car.vin} is already assigned to ${truck.id}` };
  }
  
  // Check if car is already assigned to another truck
  if (car.assignedTruckId) {
    return { canAssign: false, message: `Car ${car.vin} is already assigned to ${car.assignedTruckId}` };
  }
  
  return { canAssign: true, message: '' };
}

// ============================================
// Context Provider
// ============================================

interface PlanningProviderProps {
  children: ReactNode;
}

export function PlanningProvider({ children }: PlanningProviderProps) {
  // Initialize with hardcoded data
  const [trucks, setTrucks] = useState<Truck[]>(getAllTrucks());
  const [cars, setCars] = useState<Car[]>(getAllCars());
  const [locations, setLocations] = useState<Location[]>(getAllLocations());
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [truckFilter, setTruckFilter] = useState<TruckFilter>('all');
  const [carFilter, setCarFilter] = useState<CarFilter>('all');
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [selectedCarVin, setSelectedCarVin] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Optimization State
  const [routes, setRoutes] = useState<Route[]>([]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // ============================================
  // Assignment Actions
  // ============================================

  const assignCarToTruck = useCallback((carVin: string, truckId: string): { success: boolean; message: string } => {
    const car = getCarByVIN(carVin);
    const truck = getTruckById(truckId);
    const check = canAssignCarToTruck(car, truck, cars);
    
    if (!check.canAssign) {
      return { success: false, message: check.message };
    }
    
    // Update cars state
    setCars(prevCars => {
      return prevCars.map(c => 
        c.vin === carVin ? { ...c, assignedTruckId: truckId } : c
      );
    });
    
    // Update truck status if it was available
    setTrucks(prevTrucks => {
      return prevTrucks.map(t => 
        t.id === truckId && t.status === 'available' 
          ? { ...t, status: 'assigned' as const }
          : t
      );
    });
    
    return { success: true, message: `Car ${carVin} assigned to ${truckId}` };
  }, [cars]);

  const unassignCarFromTruck = useCallback((carVin: string) => {
    const car = getCarByVIN(carVin);
    if (!car || !car.assignedTruckId) return;
    
    setCars(prevCars => {
      return prevCars.map(c => 
        c.vin === carVin ? { ...c, assignedTruckId: null } : c
      );
    });
    
    // Check if truck should go back to available
    const truckId = car.assignedTruckId;
    const stillHasCars = cars.some(c => c.assignedTruckId === truckId && c.vin !== carVin);
    
    if (!stillHasCars) {
      setTrucks(prevTrucks => {
        return prevTrucks.map(t => 
          t.id === truckId ? { ...t, status: 'available' as const } : t
        );
      });
    }
  }, [cars]);

  // ============================================
  // Selection Actions
  // ============================================

  const selectTruck = useCallback((truckId: string | null) => {
    setSelectedTruckId(truckId);
  }, []);

  const selectCar = useCallback((vin: string | null) => {
    setSelectedCarVin(vin);
  }, []);

  // ============================================
  // Filter Actions
  // ============================================

  const setTruckFilterHandler = useCallback((filter: TruckFilter) => {
    setTruckFilter(filter);
  }, []);

  const setCarFilterHandler = useCallback((filter: CarFilter) => {
    setCarFilter(filter);
  }, []);

  // ============================================
  // View Actions
  // ============================================

  const setViewModeHandler = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const setSearchQueryHandler = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // ============================================
  // Reset Actions
  // ============================================

  const resetAllAssignments = useCallback(() => {
    setCars(prevCars => {
      return prevCars.map(car => ({ ...car, assignedTruckId: null }));
    });
    setTrucks(prevTrucks => {
      return prevTrucks.map(truck => ({ ...truck, status: 'available' as const }));
    });
    setRoutes([]);
    setOptimizationResult(null);
  }, []);

  // ============================================
  // Optimization Actions
  // ============================================

  const runOptimization = useCallback(async () => {
    setIsOptimizing(true);
    console.log('Running optimization...');
    try {
      // Import optimization algorithm (lazy import to avoid circular dependencies)
      const { optimizeRoutes } = await import('../lib/algorithms/optimize');
      
      const result = optimizeRoutes({
        trucks,
        cars,
        locations,
      });
      console.log('Optimization result:', result);
      setRoutes(result.routes);
      setOptimizationResult(result);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [trucks, cars, locations]);

  const applyOptimization = useCallback(() => {
    if (!optimizationResult) return;
    
    // Apply assignments from optimization result
    // For now, just update the cars with assignments from routes
    const newCars = [...cars];
    
    optimizationResult.routes.forEach(route => {
      route.stops.forEach(stop => {
        stop.cars.forEach(car => {
          const carIndex = newCars.findIndex(c => c.vin === car.vin);
          if (carIndex !== -1) {
            newCars[carIndex] = { ...newCars[carIndex], assignedTruckId: route.truckId };
          }
        });
      });
    });
    
    setCars(newCars);
    
    // Update truck statuses
    setTrucks(prevTrucks => {
      return prevTrucks.map(truck => {
        const hasCars = newCars.some(car => car.assignedTruckId === truck.id);
        return { ...truck, status: hasCars ? 'assigned' : 'available' as const };
      });
    });
    
    // Clear optimization result
    setOptimizationResult(null);
  }, [optimizationResult, cars]);

  // ============================================
  // Memoized Values
  // ============================================

  // Filtered trucks based on filter and search
  const filteredTrucks = useMemo(() => {
    let result = [...trucks];
    
    // Apply filter
    if (truckFilter !== 'all') {
      result = result.filter(truck => truck.status === truckFilter);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        truck => 
          truck.id.toLowerCase().includes(query) ||
          truck.driver.name.toLowerCase().includes(query) ||
          truck.currentLocation.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [trucks, truckFilter, searchQuery]);

  // Filtered cars based on filter and search
  const filteredCars = useMemo(() => {
    let result = [...cars];
    
    // Apply filter
    if (carFilter === 'assigned') {
      result = result.filter(car => car.assignedTruckId !== null);
    } else if (carFilter === 'unassigned') {
      result = result.filter(car => car.assignedTruckId === null);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        car => 
          car.vin.toLowerCase().includes(query) ||
          car.type.toLowerCase().includes(query) ||
          car.pickupLocation.toLowerCase().includes(query) ||
          car.deliveryLocation.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [cars, carFilter, searchQuery]);

  // Group cars by delivery location
  const carsByDeliveryLocation = useMemo(() => {
    const groups: Record<string, Car[]> = {};
    
    filteredCars.forEach(car => {
      if (!groups[car.deliveryLocation]) {
        groups[car.deliveryLocation] = [];
      }
      groups[car.deliveryLocation].push(car);
    });
    
    return groups;
  }, [filteredCars]);

  // Get truck load information
  const getTruckLoadInfo = useCallback((truckId: string) => {
    const { count, weight } = calculateTruckLoad(truckId, cars);
    const truck = getTruckById(truckId);
    
    if (!truck) return null;
    
    return {
      count,
      weight,
      capacity: truck.capacity,
      weightLimit: truck.weightLimit,
      utilization: (count / truck.capacity) * 100,
      weightUtilization: (weight / truck.weightLimit) * 100,
      isFull: count >= truck.capacity,
      isOverWeight: weight >= truck.weightLimit,
    };
  }, [cars]);

  // Get assigned cars for a truck
  const getAssignedCarsForTruck = useCallback((truckId: string): Car[] => {
    return cars.filter(car => car.assignedTruckId === truckId);
  }, [cars]);

  // Context value
  const contextValue: PlanningContextType = {
    // Data
    trucks,
    cars,
    locations,
    
    // UI State
    viewMode,
    truckFilter,
    carFilter,
    selectedTruckId,
    selectedCarVin,
    
    // Optimization
    routes,
    optimizationResult,
    isOptimizing,
    
    // Search
    searchQuery,
    
    // Computed values
    filteredTrucks,
    filteredCars,
    carsByDeliveryLocation,
    getTruckLoadInfo,
    getAssignedCarsForTruck,
    
    // Actions
    setTruckFilter: setTruckFilterHandler,
    selectTruck,
    setCarFilter: setCarFilterHandler,
    selectCar,
    assignCarToTruck,
    unassignCarFromTruck,
    setViewMode: setViewModeHandler,
    setSearchQuery: setSearchQueryHandler,
    runOptimization,
    applyOptimization,
    resetAllAssignments,
  };

  return (
    <PlanningContext.Provider value={contextValue}>
      {children}
    </PlanningContext.Provider>
  );
}

// ============================================
// Custom Hook
// ============================================

export function usePlanning() {
  const context = useContext(PlanningContext);
  
  if (context === undefined) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  
  return context;
}

// ============================================
// Individual Hooks for convenience
// ============================================

export function useTrucks() {
  const { trucks, filteredTrucks, truckFilter, setTruckFilter, selectedTruckId, selectTruck, getTruckLoadInfo, getAssignedCarsForTruck } = usePlanning();
  return {
    trucks,
    filteredTrucks,
    truckFilter,
    setTruckFilter,
    selectedTruckId,
    selectTruck,
    getTruckLoadInfo,
    getAssignedCarsForTruck,
  };
}

export function useCars() {
  const { cars, filteredCars, carFilter, setCarFilter, selectedCarVin, selectCar, carsByDeliveryLocation } = usePlanning();
  return {
    cars,
    filteredCars,
    carFilter,
    setCarFilter,
    selectedCarVin,
    selectCar,
    carsByDeliveryLocation,
  };
}

export function useLocations() {
  const { locations } = usePlanning();
  return { locations };
}

export function useAssignments() {
  const { assignCarToTruck, unassignCarFromTruck, resetAllAssignments } = usePlanning();
  return {
    assignCarToTruck,
    unassignCarFromTruck,
    resetAllAssignments,
  };
}

export function useOptimization() {
  const { routes, optimizationResult, isOptimizing, runOptimization, applyOptimization } = usePlanning();
  return {
    routes,
    optimizationResult,
    isOptimizing,
    runOptimization,
    applyOptimization,
  };
}

export function useViewMode() {
  const { viewMode, setViewMode } = usePlanning();
  return { viewMode, setViewMode };
}

export function useSearch() {
  const { searchQuery, setSearchQuery } = usePlanning();
  return { searchQuery, setSearchQuery };
}

export default PlanningContext;
