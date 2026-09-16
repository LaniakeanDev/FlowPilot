'use client';

// FlowPilot - Truck List Component

import { useTrucks } from '../context/PlanningContext';
import { getLocationById } from '../lib/data/locations';
import type { Truck } from '../lib/types';

export default function TruckList() {
  const {
    filteredTrucks,
    truckFilter,
    setTruckFilter,
    selectedTruckId,
    selectTruck,
    getTruckLoadInfo,
    getAssignedCarsForTruck,
  } = useTrucks();

  // Status color mapping
  const statusColors: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-orange-100 text-orange-800',
  };

  // Status labels
  const statusLabels: Record<string, string> = {
    available: 'Available',
    assigned: 'Assigned',
    in_transit: 'In Transit',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Trucks ({filteredTrucks.length}/{filteredTrucks.length || 0})</h2>
        
        {/* Filter */}
        <select
          value={truckFilter}
          onChange={(e) => setTruckFilter(e.target.value as 'all' | 'available' | 'assigned' | 'in_transit')}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="assigned">Assigned</option>
          <option value="in_transit">In Transit</option>
        </select>
      </div>

      {/* Truck Table */}
      <div className="flex-1 overflow-y-auto table-container card">
        <table className="table w-full">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="w-8"></th>
              <th>Truck ID</th>
              <th>Driver</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrucks.map((truck: Truck) => {
              const loadInfo = getTruckLoadInfo(truck.id);
              const assignedCars = getAssignedCarsForTruck(truck.id);
              const location = getLocationById(truck.currentLocation);

              return (
                <tr
                  key={truck.id}
                  onClick={() => selectTruck(truck.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedTruckId === truck.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <td>
                    <input
                      type="radio"
                      checked={selectedTruckId === truck.id}
                      onChange={() => selectTruck(truck.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="font-mono text-sm">{truck.id}</td>
                  <td className="text-sm text-gray-600">{truck.driver.name}</td>
                  <td className="text-sm text-gray-600">
                    {location ? location.name : truck.currentLocation}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${loadInfo ? Math.min(loadInfo.utilization, 100) : 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {loadInfo ? `${loadInfo.count}/${truck.capacity}` : '0/0'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${statusColors[truck.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[truck.status] || truck.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Trucks</span>
          <span className="font-medium">{filteredTrucks.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Available</span>
          <span className="font-medium text-green-600">
            {filteredTrucks.filter((t: Truck) => t.status === 'available').length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Assigned</span>
          <span className="font-medium text-blue-600">
            {filteredTrucks.filter((t: Truck) => t.status === 'assigned').length}
          </span>
        </div>
      </div>
    </div>
  );
}
