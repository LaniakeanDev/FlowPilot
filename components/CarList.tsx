'use client';

// FlowPilot - Car List Component

import { useState } from 'react';
import { useCars, useAssignments } from '../context/PlanningContext';
import { getLocationById } from '../lib/data/locations';
import type { Car } from '../lib/types';

export default function CarList() {
  const {
    filteredCars,
    carFilter,
    setCarFilter,
    carsByDeliveryLocation,
  } = useCars();
  
  const { assignCarToTruck } = useAssignments();
  
  // Expand/collapse state for location groups
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedCarVin, setSelectedCarVin] = useState<string | null>(null);

  // Toggle group expansion
  const toggleGroup = (locationId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(locationId)) {
        newSet.delete(locationId);
      } else {
        newSet.add(locationId);
      }
      return newSet;
    });
  };

  // Status color mapping
  const statusColors: Record<string, string> = {
    assigned: 'bg-green-100 text-green-800',
    unassigned: 'bg-red-100 text-red-800',
  };

  // Type icons
  const typeIcons: Record<'car' | 'SUV', string> = {
    car: '🚗',
    SUV: '🚙',
  };

  // Handle car selection for assignment
  const handleCarSelect = (vin: string) => {
    setSelectedCarVin(prev => prev === vin ? null : vin);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Cars ({filteredCars.length})
        </h2>
        
        {/* Filter */}
        <select
          value={carFilter}
          onChange={(e) => setCarFilter(e.target.value as 'all' | 'assigned' | 'unassigned')}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Cars</option>
          <option value="assigned">Assigned Only</option>
          <option value="unassigned">Unassigned Only</option>
        </select>
      </div>

      {/* Car List by Location Groups */}
      <div className="flex-1 overflow-y-auto card">
        {Object.entries(carsByDeliveryLocation).length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No cars match your filters
          </div>
        ) : (
          Object.entries(carsByDeliveryLocation).map(([locationId, carsInGroup]) => {
            const location = getLocationById(locationId);
            const locationName = location ? location.name : locationId;
            const isExpanded = expandedGroups.has(locationId);
            const assignedCount = carsInGroup.filter((c: Car) => c.assignedTruckId).length;
            const unassignedCount = carsInGroup.length - assignedCount;

            return (
              <div key={locationId} className="border-b border-gray-200 last:border-0">
                {/* Group Header */}
                <div
                  onClick={() => toggleGroup(locationId)}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      {isExpanded ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                    <div>
                      <h3 className="font-semibold text-gray-900">{locationName}</h3>
                      <p className="text-xs text-gray-500">
                        {carsInGroup.length} cars ({assignedCount} assigned, {unassignedCount} unassigned)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="badge bg-blue-100 text-blue-800">
                      {carsInGroup.length}
                    </span>
                  </div>
                </div>

                {/* Group Content */}
                {isExpanded && (
                  <div className="px-3 pb-3">
                    <table className="table w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="w-8"></th>
                          <th>VIN</th>
                          <th>Type</th>
                          <th>Pickup</th>
                          <th>Delivery</th>
                          <th>Due Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {carsInGroup.map((car: Car) => {
                          const isAssigned = car.assignedTruckId !== null;
                          const typeIcon = typeIcons[car.type];

                          return (
                            <tr
                              key={car.vin}
                              onClick={() => handleCarSelect(car.vin)}
                              className={`cursor-pointer transition-colors ${
                                selectedCarVin === car.vin ? 'bg-blue-50' : ''
                              }`}
                            >
                              <td>
                                <input
                                  type="radio"
                                  checked={selectedCarVin === car.vin}
                                  onChange={() => handleCarSelect(car.vin)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-4 w-4 text-blue-600"
                                />
                              </td>
                              <td className="font-mono text-sm max-w-[120px] truncate">{car.vin}</td>
                              <td className="text-sm text-gray-600">{car.type}</td>
                              <td className="text-sm text-gray-600 max-w-[100px] truncate">
                                {car.pickupLocation}
                              </td>
                              <td className="text-sm text-gray-600 max-w-[100px] truncate">
                                {car.deliveryLocation}
                              </td>
                              <td className="text-sm text-gray-600">{car.dueDate}</td>
                              <td>
                                <span className={`badge ${isAssigned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {isAssigned ? 'Assigned' : 'Unassigned'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Cars</span>
          <span className="font-medium">{filteredCars.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Assigned</span>
          <span className="font-medium text-green-600">
            {filteredCars.filter((c: Car) => c.assignedTruckId).length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Unassigned</span>
          <span className="font-medium text-red-600">
            {filteredCars.filter((c: Car) => !c.assignedTruckId).length}
          </span>
        </div>
      </div>
    </div>
  );
}
