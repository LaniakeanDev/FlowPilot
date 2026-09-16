// FlowPilot - Data Module Index
// Exports all data-related functionality

export * from './locations';
export * from './trucks';
export * from './cars';

// Re-export types for convenience
export type { Location, Truck, Car, Coordinates, LocationRef } from '../types';
