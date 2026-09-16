# FlowPilot - Detailed Specification

## 1. Overview

| Field | Value |
|-------|-------|
| **Project Name** | FlowPilot |
| **Purpose** | FVL (Finished Vehicle Logistics) planning tool to schedule cars on trucks and optimize routes based on distance/cost |
| **Target Users** | CEVA FVL Planners |
| **Type** | MVP, Client-side React/Next.js application |
| **Tech Stack** | React 18+, Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| **Backend** | None (hardcoded data, client-side only) |
| **Authentication** | None |

---

## 2. Data Model

### 2.1 Entity Definitions

#### Truck
```typescript
interface Truck {
  id: string;           // Unique identifier, e.g., "TRK-001"
  capacity: number;     // Max number of cars (default: 8-10 for CEVA FVL)
  weightLimit: number;  // Max weight in kg (default: 40,000 kg)
  driver: {
    name: string;
    maxDrivingHours: number; // Default: 9 (EU regulation)
  };
  currentLocation: LocationRef; // Depot ID where truck is based
  status: 'available' | 'assigned' | 'in_transit';
}
```

#### Car
```typescript
interface Car {
  vin: string;          // Unique Vehicle Identification Number
  type: 'SUV' | 'car';
  weight: number;       // kg (SUV: ~2000kg, car: ~1500kg)
  pickupLocation: LocationRef;
  deliveryLocation: LocationRef;
  dueDate: Date;        // ISO string
  assignedTruckId: string | null;
}
```

#### Location
```typescript
interface Location {
  id: string;           // Unique identifier, e.g., "DEPOT-001", "DEALER-001"
  name: string;         // Human-readable name
  address: string;      // Full address
  coordinates: { lat: number; lng: number };
  type: 'depot' | 'pickup' | 'delivery';
}
```

#### Route
```typescript
interface Route {
  truckId: string;
  stops: Location[];    // Ordered list of stops (pickup -> delivery)
  assignedCars: Car[];  // Cars assigned to this route
  totalDistance: number; // km
  totalTime: number;    // hours
}
```

#### Optimization Result
```typescript
interface OptimizationResult {
  routes: Route[];
  unassignedCars: Car[];
  totalDistance: number; // km
  previousTotalDistance: number; // km (for comparison)
  savings: number;       // km saved
}
```

### 2.2 MVP Hardcoded Data

**Default Truck Profile (CEVA FVL Standard):**
- Capacity: 10 cars
- Weight Limit: 40,000 kg
- Max Driving Hours: 9 hours

**Sample Data Size:**
- 5-10 trucks
- 20-30 cars
- 5-10 locations (2-3 depots, 5-7 dealerships)

**Location Coordinates:**
Use realistic French coordinates (CEVA operates heavily in France):
- Depot: Paris (48.8566, 2.3522)
- Dealerships: Lyon, Marseille, Bordeaux, Lille, Toulouse

---

## 3. Features

### 3.1 Planning Dashboard (F-001)

**Description:**
Central workspace where planners can view, manage, and optimize truck and car assignments.

**Requirements:**
- Three-panel layout (Trucks | Cars | AI Chat)
- Responsive design (adapt to desktop screens)
- Real-time updates when data changes

**Sub-features:**

| ID | Feature | Description |
|----|---------|-------------|
| F-001-1 | Truck List Panel | Table view of all trucks with status indicators |
| F-001-2 | Car List Panel | Table view of all cars, grouped by delivery location |
| F-001-3 | Assignment Visualization | Highlight assigned/unassigned items |
| F-001-4 | Filtering | Filter trucks by status; filter cars by assignment status |
| F-001-5 | Search | Search by VIN, truck ID, location name |

### 3.2 Manual Assignment (F-002)

**Description:**
Allow planners to manually assign cars to trucks.

**Requirements:**
- **Drag-and-drop:** Drag car from Car List to Truck in Truck List
- **Form-based:** Select car, select truck, click "Assign"
- **Validation:** Prevent assignments that violate constraints (capacity, weight)
- **Feedback:** Visual confirmation of successful assignment
- **Undo:** Ability to remove car from truck

### 3.3 Map Visualization (F-003)

**Description:**
Visual representation of locations and routes.

**Requirements:**
- Display all locations on an interactive map
- Draw routes between stops for each truck
- Color-code routes by truck
- Toggle between List View and Map View
- Click on map elements to see details

**Technical Note:**
- Use Leaflet.js (open-source) for MVP
- Map tiles: OpenStreetMap (free)

### 3.4 Route Optimization Algorithm (F-004)

**Description:**
Automatically calculate optimal routes to minimize total distance.

**Requirements:**

**Objective:**
- Minimize total distance traveled by all trucks

**Constraints:**
- Truck capacity (max cars) must not be exceeded
- Truck weight limit must not be exceeded
- Max driving time per truck must not be exceeded (9 hours)
- Each car must be assigned to exactly one truck

**Algorithm Approach:**
1. **Clustering Phase:** Group cars by delivery location
2. **Assignment Phase:** Assign groups to trucks respecting capacity/weight
3. **Routing Phase:** For each truck, solve Traveling Salesman Problem (TSP)
   - Use Nearest Neighbor heuristic for TSP (O(n²) complexity)
   - Calculate distances using Haversine formula (great-circle distance)
4. **Validation:** Ensure all constraints are satisfied

**Trigger:**
- Auto-run on any change (car added/removed, manual assignment, location change)
- Manual trigger via "Optimize" button

**Output:**
- Optimized routes for each truck
- Total distance before/after
- Savings in km
- List of unassigned cars (if any)

**Performance:**
- Must handle 30 cars + 10 trucks in < 2 seconds (client-side)

### 3.5 AI Chat Placeholder (F-005)

**Description:**
Floating sidebar for AI optimization suggestions (MVP: mock responses only).

**Requirements:**
- Floating sidebar on right side of screen
- Text input field: "Describe your optimization goal..."
- "Get Suggestions" button
- Display mock optimization suggestions:
  - Summary of proposed changes
  - Estimated distance savings
  - "Apply All" button (runs algorithm)
  - "Modify" button (opens suggestion for editing)
  - "Dismiss" button
- Placeholder responses (no actual AI connection)

**Example Interaction:**
```
User: "Optimize for minimal distance"
AI: "I can save 150km by reassigning TRK-002 to handle Marseille deliveries 
     and TRK-003 to handle Lyon. Apply? [Apply All] [Modify] [Dismiss]"
```

---

## 4. User Interface

### 4.1 Layout

```
+-----------------------------------------------------+
| HEADER: FlowPilot                                    |
+-----------------------------------------------------+
|                                                     |
| +--------------+ +----------------+ +---------------+ |
| | TRUCK LIST   | |   CAR LIST     | |   AI CHAT      | |
| | (Left, 30%)  | | (Center, 50%)  | | (Right, 20%)  | |
| |              | |                | |   Sidebar      | |
| | - Table view | | - Table view   | |   Floating     | |
| | - Status     | | - Grouped by   | |   (can toggle) | |
| | - Capacity   | |   destination  | |               | |
| +--------------+ +----------------+ +---------------+ |
|                                                     |
+-----------------------------------------------------+
| [Map View Toggle] [Optimize Button]                  |
+-----------------------------------------------------+
```

### 4.2 Truck List Panel

**Columns:**
- Truck ID
- Capacity (e.g., "8/10")
- Weight Load (e.g., "12,000/40,000 kg")
- Driver
- Status (color-coded)
- Actions (View Details)

**Features:**
- Click row to select truck (highlight assigned cars in Car List)
- Status badge colors:
  - Green: available
  - Blue: assigned
  - Orange: in_transit

### 4.3 Car List Panel

**Columns:**
- VIN
- Type (SUV/Car icon)
- Pickup Location
- Delivery Location
- Due Date
- Assigned Truck
- Status

**Features:**
- Group by Delivery Location (collapsible sections)
- Drag cars to Truck List for assignment
- Click row to see details
- Status badge colors:
  - Red: unassigned
  - Green: assigned

### 4.4 Map View

**Features:**
- Full-width map display (when toggled)
- Markers for all locations
- Polylines for routes (color-coded by truck)
- Click marker to see location details
- Click route to see truck details
- Zoom to fit all locations

### 4.5 AI Chat Sidebar

**Components:**
- Input: `<Textarea placeholder="Ask for optimization suggestions..." />`
- Button: `<Button>Get Suggestions</Button>`
- Response Card:
  ```
  +------------------------------------+
  | Optimization Suggestions          |
  |------------------------------------|
  | • Reassign 5 cars from TRK-001    |
  | • Save: 120km total                |
  |------------------------------------|
  | [Apply All] [Modify] [Dismiss]      |
  +------------------------------------+
  ```

---

## 5. Technical Specification

### 5.1 Project Structure

```
flowpilot/
├── app/
│   ├── (dashboard)/
│   │   └── page.tsx          # Main dashboard
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── TruckList.tsx
│   ├── CarList.tsx
│   ├── MapView.tsx
│   ├── AIChatSidebar.tsx
│   └── shared/
│       ├── AssignmentModal.tsx
│       └── ...
├── lib/
│   ├── data/
│   │   ├── trucks.ts         # Hardcoded truck data
│   │   ├── cars.ts           # Hardcoded car data
│   │   └── locations.ts      # Hardcoded location data
│   ├── algorithms/
│   │   ├── distance.ts       # Haversine formula
│   │   ├── cluster.ts        # Group by destination
│   │   ├── assign.ts         # Assign to trucks
│   │   └── route.ts          # TSP solver
│   └── types.ts             # TypeScript interfaces
├── hooks/
│   ├── useOptimization.ts
│   └── useAssignments.ts
├── specs/                   # This file and implementation-plan.md
└── package.json
```

### 5.2 Dependencies

**Required:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "14.2.0",
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "react-dnd": "^16.0.0",
    "react-dnd-html5-backend": "^16.0.0",
    "leaflet": "^1.9.0",
    "react-leaflet": "^4.2.0"
  }
}
```

### 5.3 State Management

- Use React Context for global state (assignments, trucks, cars)
- Use local state for UI interactions
- Optimization results stored in context

---

## 6. Acceptance Criteria

### Dashboard
- [ ] Planner can see all trucks with their status and capacity
- [ ] Planner can see all cars grouped by delivery location
- [ ] Planner can filter trucks by status (available/assigned/in_transit)
- [ ] Planner can filter cars by assignment status
- [ ] Planner can search for specific trucks/cars

### Manual Assignment
- [ ] Planner can drag a car and drop it on a truck to assign
- [ ] Planner can use form to assign car to truck
- [ ] System prevents assigning car if truck is at capacity
- [ ] System prevents assigning car if truck weight limit exceeded
- [ ] Planner can remove car from truck
- [ ] Visual feedback shows successful assignment

### Map Visualization
- [ ] All locations displayed on map
- [ ] Routes drawn between stops for each truck
- [ ] Routes color-coded by truck
- [ ] Planner can toggle between list and map view

### Route Optimization
- [ ] Algorithm runs automatically when data changes
- [ ] Algorithm can be triggered manually
- [ ] Optimization respects all constraints (capacity, weight, time)
- [ ] Optimization minimizes total distance
- [ ] Results show savings compared to previous state
- [ ] Unassigned cars are clearly identified

### AI Chat Placeholder
- [ ] Floating sidebar visible on dashboard
- [ ] Planner can type optimization request
- [ ] System shows mock optimization suggestions
- [ ] Planner can apply suggestions (runs algorithm)
- [ ] Planner can dismiss suggestions

---

## 7. Out of Scope

- Real AI integration (MVP only has placeholder)
- Backend server or database
- User authentication/authorization
- Real-time data synchronization
- Multi-user collaboration
- Mobile responsiveness (desktop-first)
- Historical data or reporting
- Export functionality (CSV, PDF)
- Advanced constraints (time windows, traffic, tolls)

---

## 8. Open Questions

- Should the map default to France/Europe region?
- What are typical CEVA truck capacities and weight limits?
- Should we include a "reset all assignments" button?
- Should optimization be debounced (e.g., wait 1 second after last change)?
