'use client';

// FlowPilot - Details Panel Component
// Shows detailed information about selected truck or car

import { usePlanning, useTrucks, useCars } from '../context/PlanningContext';
import { getLocationById } from '../lib/data/locations';
import { getTruckById } from '../lib/data/trucks';
import { getCarByVIN } from '../lib/data/cars';
import type { Route } from '../lib/types';

export default function DetailsPanel() {
  const { selectedTruckId, selectedCarVin, routes } = usePlanning();
  const { getTruckLoadInfo } = useTrucks();
  const { locations } = usePlanning();

  // Find if selected truck has a route
  const selectedTruckRoute = selectedTruckId
    ? routes.find((r: Route) => r.truckId === selectedTruckId)
    : null;

  // Find if selected car has a route
  const selectedCarRoute = selectedCarVin
    ? routes.find((r: Route) =>
        r.stops.some(stop => stop.cars.some(car => car.vin === selectedCarVin))
      )
    : null;

  // Get truck or car details
  const truck = selectedTruckId ? getTruckById(selectedTruckId) : null;
  const car = selectedCarVin ? getCarByVIN(selectedCarVin) : null;

  if (!selectedTruckId && !selectedCarVin) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">Select a truck or car to view details</p>
          <p className="text-xs text-gray-400 mt-2">Click any row to see optimization results</p>
        </div>
      </div>
    );
  }

  // ===== TRUCK DETAILS =====
  if (truck) {
    const loadInfo = getTruckLoadInfo(truck.id);
    const currentLocation = getLocationById(truck.currentLocation);

    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
          <h3 className="text-xl font-bold">{truck.id}</h3>
          <p className="text-sm text-blue-100 mt-1">Truck Details</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Basic Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Driver</span>
                <span className="font-medium">{truck.driver.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Location</span>
                <span className="font-medium">
                  {currentLocation ? currentLocation.name : truck.currentLocation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Driving Hours</span>
                <span className="font-medium">{truck.driver.maxDrivingHours}h</span>
              </div>
            </div>
          </div>

          {/* Capacity Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Capacity</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Cars</span>
                  <span className="font-medium">
                    {loadInfo ? `${loadInfo.count}/${truck.capacity}` : '0/0'}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${loadInfo ? Math.min(loadInfo.utilization, 100) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium">
                    {loadInfo ? `${loadInfo.weight}/${truck.weightLimit}` : '0/0'} kg
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      loadInfo && loadInfo.isOverWeight ? 'bg-red-600' : 'bg-green-600'
                    }`}
                    style={{
                      width: `${loadInfo ? Math.min(loadInfo.weightUtilization, 100) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  truck.status === 'available'
                    ? 'bg-green-600'
                    : truck.status === 'assigned'
                    ? 'bg-blue-600'
                    : 'bg-orange-600'
                }`}
              ></div>
              <span className="text-sm font-medium capitalize">
                {truck.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Route Info */}
          {selectedTruckRoute ? (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">Optimized Route</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Distance</span>
                  <span className="font-medium">{selectedTruckRoute.totalDistance.toFixed(1)} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time</span>
                  <span className="font-medium">{selectedTruckRoute.totalTime.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Weight</span>
                  <span className="font-medium">{selectedTruckRoute.totalWeight} kg</span>
                </div>

                {/* Stops */}
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="font-semibold text-gray-900 mb-2">Stops ({selectedTruckRoute.stops.length})</p>
                  <div className="space-y-2">
                    {selectedTruckRoute.stops.map((stop, idx) => (
                      <div key={idx} className="text-xs">
                        <p className="font-medium">
                          {stop.type === 'pickup' ? '📦' : '✓'} {stop.location.name}
                        </p>
                        <p className="text-gray-600 ml-4">{stop.cars.length} car(s)</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                No optimized route yet. Run optimization to see route details.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== CAR DETAILS =====
  if (car) {
    const pickupLocation = getLocationById(car.pickupLocation);
    const deliveryLocation = getLocationById(car.deliveryLocation);
    const assignedTruck = car.assignedTruckId ? getTruckById(car.assignedTruckId) : null;

    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4">
          <h3 className="text-xl font-bold font-mono">{car.vin}</h3>
          <p className="text-sm text-purple-100 mt-1">Car Details</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Basic Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{car.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight</span>
                <span className="font-medium">{car.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date</span>
                <span className="font-medium">{car.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Route Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Route</h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Pickup</p>
                <p className="font-medium">{pickupLocation ? pickupLocation.name : car.pickupLocation}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {pickupLocation?.address}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Delivery</p>
                <p className="font-medium">{deliveryLocation ? deliveryLocation.name : car.deliveryLocation}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {deliveryLocation?.address}
                </p>
              </div>
            </div>
          </div>

          {/* Assignment Status */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Assignment</h4>
            {assignedTruck ? (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium">Assigned</span>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Truck</p>
                  <p className="font-medium">{assignedTruck.id}</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-sm font-medium">Unassigned</span>
                </div>
                <p className="text-xs text-red-600">This car is not assigned to any truck</p>
              </div>
            )}
          </div>

          {/* Optimization Info */}
          {selectedCarRoute ? (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-3">In Optimized Route</h4>
              <div className="text-sm">
                <p className="text-gray-600">Truck</p>
                <p className="font-medium">{selectedCarRoute.truckId}</p>
                <p className="text-xs text-gray-600 mt-2">
                  Route distance: {selectedCarRoute.totalDistance.toFixed(1)} km
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                Not included in optimized route yet. Run optimization to see details.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
