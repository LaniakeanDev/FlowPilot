// FlowPilot - Hardcoded Car Data (CEVA FVL MVP)

import type { Car } from '../types';

/**
 * Car weights (kg)
 * - Standard car: ~1500 kg
 * - SUV: ~2000 kg
 */
export const CAR_WEIGHTS_CONST = {
  car: 1500,
  SUV: 2000,
} as const;

/**
 * Static car data for MVP
 * Each car has deterministic data for consistent testing
 */
const cars: Car[] = [
  // Cars from PLANT-PARIS to various dealers
  {
    vin: 'VF1000001ABC123',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-PARIS-01',
    dueDate: '2026-09-20',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000002DEF456',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-PARIS-01',
    dueDate: '2026-09-20',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000003GHI789',
    type: 'SUV',
    weight: 2000,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-PARIS-02',
    dueDate: '2026-09-22',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000004JKL012',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-PARIS-02',
    dueDate: '2026-09-22',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000005MNO345',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-LYON',
    dueDate: '2026-09-18',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000006PQR678',
    type: 'SUV',
    weight: 2000,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-LYON',
    dueDate: '2026-09-18',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000007STU901',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-BORDEAUX',
    dueDate: '2026-09-25',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000008VWX234',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-BORDEAUX',
    dueDate: '2026-09-25',
    assignedTruckId: null,
  },
  // Cars from PLANT-RENNES to various dealers
  {
    vin: 'VF1000009YZA567',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-NANTES',
    dueDate: '2026-09-20',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000010BCD890',
    type: 'SUV',
    weight: 2000,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-NANTES',
    dueDate: '2026-09-20',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000011EFG123',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-LILLE',
    dueDate: '2026-09-22',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000012HIJ456',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-LILLE',
    dueDate: '2026-09-22',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000013KLM789',
    type: 'SUV',
    weight: 2000,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-TOULOUSE',
    dueDate: '2026-09-25',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000014NOP012',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-TOULOUSE',
    dueDate: '2026-09-25',
    assignedTruckId: null,
  },
  // More cars for Marseille
  {
    vin: 'VF1000015QRS345',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-MARSEILLE',
    dueDate: '2026-09-30',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000016TUV678',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-MARSEILLE',
    dueDate: '2026-09-30',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000017WXY901',
    type: 'SUV',
    weight: 2000,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-MARSEILLE',
    dueDate: '2026-09-30',
    assignedTruckId: null,
  },
  // Additional cars for testing edge cases
  {
    vin: 'VF1000018ABC234',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-LYON',
    dueDate: '2026-09-15',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000019DEF567',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-LYON',
    dueDate: '2026-09-15',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000020GHI890',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-BORDEAUX',
    dueDate: '2026-09-16',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000021JKL123',
    type: 'SUV',
    weight: 2000,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-BORDEAUX',
    dueDate: '2026-09-16',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000022MNO456',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-NANTES',
    dueDate: '2026-09-17',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000023PQR789',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-NANTES',
    dueDate: '2026-09-17',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000024STU012',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-LILLE',
    dueDate: '2026-09-18',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000025VWX345',
    type: 'SUV',
    weight: 2000,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-LILLE',
    dueDate: '2026-09-18',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000026YZA678',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-TOULOUSE',
    dueDate: '2026-09-28',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000027BCD901',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-TOULOUSE',
    dueDate: '2026-09-28',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000028EFG234',
    type: 'SUV',
    weight: 2000,
    pickupLocation: 'PLANT-PARIS',
    deliveryLocation: 'DEALER-PARIS-01',
    dueDate: '2026-09-29',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000029HIJ567',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-MARSEILLE',
    dueDate: '2026-09-29',
    assignedTruckId: null,
  },
  {
    vin: 'VF1000030KLM890',
    type: 'car',
    weight: 1500,
    pickupLocation: 'PLANT-RENNES',
    deliveryLocation: 'DEALER-MARSEILLE',
    dueDate: '2026-09-29',
    assignedTruckId: null,
  },
];

/**
 * Get all cars
 */
export function getAllCars(): Car[] {
  return [...cars];
}

/**
 * Get car by VIN
 */
export function getCarByVIN(vin: string): Car | undefined {
  return cars.find(car => car.vin === vin);
}

/**
 * Get unassigned cars
 */
export function getUnassignedCars(): Car[] {
  return cars.filter(car => car.assignedTruckId === null);
}

/**
 * Get assigned cars
 */
export function getAssignedCars(): Car[] {
  return cars.filter(car => car.assignedTruckId !== null);
}

/**
 * Get cars by truck ID
 */
export function getCarsByTruckId(truckId: string): Car[] {
  return cars.filter(car => car.assignedTruckId === truckId);
}

/**
 * Get cars by delivery location
 */
export function getCarsByDeliveryLocation(locationId: string): Car[] {
  return cars.filter(car => car.deliveryLocation === locationId);
}

/**
 * Get cars by pickup location
 */
export function getCarsByPickupLocation(locationId: string): Car[] {
  return cars.filter(car => car.pickupLocation === locationId);
}

export default cars;
