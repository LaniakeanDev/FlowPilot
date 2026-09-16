'use client';

// FlowPilot - Main Dashboard Page

import Header from '../components/Header';
import TruckList from '../components/TruckList';
import CarList from '../components/CarList';
import DetailsPanel from '../components/DetailsPanel';
import AIChatSidebar from '../components/AIChatSidebar';
import MapView from '../components/MapView';
import OptimizationResults from '../components/OptimizationResults';
import { useViewMode } from '../context/PlanningContext';

export default function DashboardPage() {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex p-4 gap-4">
        {/* Left Panel - Truck List */}
        <div className="w-1/4 min-w-[280px]">
          <TruckList />
        </div>

        {/* Center Panel - Car List or Map */}
        <div className="flex-1 min-w-[400px]">
          {viewMode === 'list' ? (
            <CarList />
          ) : (
            <MapView />
          )}
        </div>

        {/* Right Panel - Details + AI Sidebar */}
        <div className="w-1/3 min-w-[320px] flex flex-col gap-4">
          {/* Details Panel */}
          <div className="flex-1">
            <DetailsPanel />
          </div>

          {/* AI Chat Sidebar */}
          <div className="h-80">
            <AIChatSidebar />
          </div>
        </div>
      </main>

      {/* Optimization Results Modal */}
      <OptimizationResults />

      {/* View Toggle */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Map View
          </button>
        </div>
      </div>
    </div>
  );
}
