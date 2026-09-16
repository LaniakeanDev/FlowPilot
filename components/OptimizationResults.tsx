'use client';

// FlowPilot - Optimization Results Component

import { useOptimization, usePlanning } from '../context/PlanningContext';
import { useState } from 'react';

export default function OptimizationResults() {
  const { optimizationResult, applyOptimization } = useOptimization();
  const { locations } = usePlanning();
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

  if (!optimizationResult) {
    return null;
  }

  const getLocationName = (locationId: string) => {
    return locations.find(loc => loc.id === locationId)?.name || locationId;
  };

  const routes = optimizationResult.routes;
  const hasUnassigned = optimizationResult.unassignedCars.length > 0;

  // Only show savings if there's a meaningful comparison
  const hasMeaningfulSavings = optimizationResult.previousTotalDistance > 0;
  const showSavings = hasMeaningfulSavings && Math.abs(optimizationResult.savings) > 0.1;

  // Carbon emissions calculation (approximate)
  // Average truck CO2 emissions: ~2.5 kg CO2 per km
  const CO2_PER_KM = 1.5;
  const totalCO2 = optimizationResult.totalDistance * CO2_PER_KM;
  const previousCO2 = optimizationResult.previousTotalDistance * CO2_PER_KM;
  const co2Savings = previousCO2 - totalCO2;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Optimization Results</h2>
          <button
            onClick={() => setExpandedRoute(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Summary Stats */}
          <div className={`grid gap-4 mb-6 ${showSavings ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600">Total Routes</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{routes.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {optimizationResult.totalDistance.toFixed(1)} km
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">CO₂ Emissions</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {totalCO2.toFixed(0)} kg
              </p>
            </div>
            {showSavings && (
              <div className={`rounded-lg p-4 border ${
                optimizationResult.savings > 0
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <p className="text-sm text-gray-600">Savings</p>
                <p className={`text-3xl font-bold mt-1 ${
                  optimizationResult.savings > 0
                    ? 'text-emerald-600'
                    : 'text-orange-600'
                }`}>
                  {optimizationResult.savings > 0 ? '+' : ''}{optimizationResult.savings.toFixed(1)} km
                </p>
              </div>
            )}
          </div>

          {/* CO2 Savings Info - Show if there's a comparison */}
          {hasMeaningfulSavings && Math.abs(co2Savings) > 0.1 && (
            <div className={`rounded-lg p-4 mb-6 border ${
              co2Savings > 0
                ? 'bg-green-50 border-green-200'
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 ${
                    co2Savings > 0 ? 'text-green-600' : 'text-orange-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                <div>
                  <p className={`font-semibold ${
                    co2Savings > 0 ? 'text-green-900' : 'text-orange-900'
                  }`}>
                    {co2Savings > 0 ? 'CO₂ Reduced' : 'CO₂ Increased'}
                  </p>
                  <p className={`text-sm ${
                    co2Savings > 0 ? 'text-green-800' : 'text-orange-800'
                  }`}>
                    {co2Savings > 0 ? '-' : '+'}{Math.abs(co2Savings).toFixed(0)} kg CO₂ {
                      co2Savings > 0 ? 'saved' : 'added'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Previous Distance - Only show if there's previous distance to compare */}
          {hasMeaningfulSavings && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Previous Distance</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">
                    {optimizationResult.previousTotalDistance.toFixed(1)} km
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ({previousCO2.toFixed(0)} kg CO₂)
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">New Distance</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">
                    {optimizationResult.totalDistance.toFixed(1)} km
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ({totalCO2.toFixed(0)} kg CO₂)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {hasUnassigned && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4v2m0 4v2m0-14a9 9 0 1 1 0 18 9 9 0 0 1 0-18z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-orange-900">
                    {optimizationResult.unassignedCars.length} cars could not be assigned
                  </p>
                  <p className="text-sm text-orange-800 mt-1">
                    These cars exceed truck capacity or weight limits. You may need more trucks or adjust constraints.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Routes List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Routes by Truck</h3>
            <div className="space-y-3">
              {routes.map((route, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Route Header */}
                  <button
                    onClick={() =>
                      setExpandedRoute(expandedRoute === route.truckId ? null : route.truckId)
                    }
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{route.truckId}</p>
                        <p className="text-sm text-gray-600">
                          {route.carCount} cars • {route.totalDistance.toFixed(1)} km • {route.totalTime.toFixed(1)}h
                        </p>
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedRoute === route.truckId ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </button>

                  {/* Route Details */}
                  {expandedRoute === route.truckId && (
                    <div className="px-4 py-4 bg-white border-t border-gray-200 space-y-4">
                      {/* Load Info */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide">Weight</p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {route.totalWeight} kg
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide">Time</p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {route.totalTime.toFixed(1)}h
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide">CO₂</p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {(route.totalDistance * CO2_PER_KM).toFixed(0)} kg
                          </p>
                        </div>
                      </div>

                      {/* Stops */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">Stops</p>
                        <div className="space-y-2">
                          {route.stops.map((stop, stopIndex) => (
                            <div
                              key={stopIndex}
                              className="bg-gray-50 rounded p-3 border border-gray-200"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  {stop.type === 'pickup' ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-5 h-5 text-blue-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-5 h-5 text-green-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">
                                    {stop.type === 'pickup' ? 'Pickup' : 'Delivery'}: {stop.location.name}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">{stop.location.address}</p>
                                  <p className="text-sm text-gray-600 mt-2">
                                    {stop.cars.length} car{stop.cars.length !== 1 ? 's' : ''}:
                                  </p>
                                  <div className="mt-2 space-y-1">
                                    {stop.cars.slice(0, 3).map((car) => (
                                      <p key={car.vin} className="text-xs text-gray-700">
                                        • {car.vin} ({car.type})
                                      </p>
                                    ))}
                                    {stop.cars.length > 3 && (
                                      <p className="text-xs text-gray-600">
                                        • +{stop.cars.length - 3} more
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Unassigned Cars */}
          {hasUnassigned && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Unassigned Cars</h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {optimizationResult.unassignedCars.map((car) => (
                    <div key={car.vin} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{car.vin}</p>
                        <p className="text-xs text-gray-600">
                          {getLocationName(car.pickupLocation)} → {getLocationName(car.deliveryLocation)}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                        {car.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={() => setExpandedRoute(null)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              applyOptimization();
              setExpandedRoute(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Apply Routes
          </button>
        </div>
      </div>
    </div>
  );
}
