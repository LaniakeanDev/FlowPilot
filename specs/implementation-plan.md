# FlowPilot - Implementation Plan

## Overview

| Item | Value |
|------|-------|
| **Total Estimated Time** | 8-12 days (for 1 developer) |
| **Priority** | MVP: Dashboard + Algorithm first, AI Chat as stretch |
| **Approach** | Iterative, feature-by-feature |
| **Risk** | Algorithm complexity; keep it simple for MVP |

---

## Phase Breakdown

### Phase 0: Project Setup (0.5 day)
**Goal:** Bootstrap the Next.js + TypeScript project with all dependencies.

| Task | Description | Time | Status |
|------|-------------|------|--------|
| P0-1 | Initialize Next.js 14 project with TypeScript | 1h | pending |
| P0-2 | Install dependencies (React, Tailwind, Leaflet, react-dnd) | 1h | pending |
| P0-3 | Configure Tailwind CSS and global styles | 2h | pending |
| P0-4 | Set up ESLint + Prettier | 1h | pending |
| P0-5 | Create project folder structure | 1h | pending |

**Deliverables:**
- Working Next.js dev environment
- `package.json` with all dependencies
- Basic styling setup

---

### Phase 1: Data Model & Hardcoded Data (1 day)
**Goal:** Define TypeScript interfaces and create MVP data.

| Task | Description | Time | Status |
|------|-------------|------|--------|
| P1-1 | Create `lib/types.ts` with all interfaces (Truck, Car, Location, Route) | 2h | pending |
| P1-2 | Create `lib/data/locations.ts` with 5-10 French locations | 2h | pending |
| P1-3 | Create `lib/data/trucks.ts` with 5-10 trucks (CEVA defaults) | 2h | pending |
| P1-4 | Create `lib/data/cars.ts` with 20-30 cars | 2h | pending |
| P1-5 | Create `lib/data/index.ts` exporting all data | 1h | pending |

**Deliverables:**
- Complete TypeScript type definitions
- Hardcoded data files ready for use

---

### Phase 2: Core State Management (1 day)
**Goal:** Set up React Context for global state.

| Task | Description | Time | Status |
|------|-------------|------|--------|
| P2-1 | Create `context/PlanningContext.tsx` | 3h | pending |
| P2-2 | Implement providers for trucks, cars, assignments | 2h | pending |
| P2-3 | Create custom hooks (`useTrucks`, `useCars`, `useAssignments`) | 3h | pending |
| P2-4 | Add state persistence helpers (optional, for refresh) | 2h | pending |

**Deliverables:**
- Working context API for the entire app
- Custom hooks for easy state access

---

### Phase 3: Dashboard Layout & Truck List (1.5 days)
**Goal:** Build the three-panel layout and truck list component.

| Task | Description | Time | Status |
|------|-------------|------|--------|
| P3-1 | Create main layout (`app/layout.tsx`) with header | 2h | pending |
| P3-2 | Create dashboard page (`app/(dashboard)/page.tsx`) | 2h | pending |
| P3-3 | Build `TruckList.tsx` component | 4h | pending |
| P3-4 | Add filtering (by status) to Truck List | 2h | pending |
| P3-5 | Add status badges with colors | 2h | pending |
| P3-6 | Style with Tailwind CSS | 2h | pending |

**Deliverables:**
- Functional three-panel layout
- Truck list displaying all trucks with status

---

### Phase 4: Car List with Grouping (1.5 days)
**Goal:** Build car list component grouped by delivery location.

| Task | Description | Time | Status |
|------|-------------|------|--------|
| P4-1 | Build `CarList.tsx` component | 4h | pending |
| P4-2 | Implement grouping by delivery location | 3h | pending |
| P4-3 | Add collapsible sections for each group | 2h | pending |
| P4-4 | Add filtering (by assignment status) | 2h | pending |
| P4-5 | Add status badges (assigned/unassigned) | 1h | pending |
| P4-6 | Style with Tailwind CSS | 2h | pending |

**Deliverables:**
- Car list with grouping by destination
- Visual distinction between assigned/unassigned cars

---

### Phase 5: Manual Assignment (2 days)
**Goal:** Implement both drag-and-drop and form-based assignment.

| Task | Description | Time | Status |
|------|-------------|------|--------|
| P5-1 | Set up react-dnd in the project | 2h | pending |
| P5-2 | Make Car List items draggable | 3h | pending |
| P5-3 | Make Truck List items drop targets | 3h | pending |
| P5-4 | Implement assignment logic in context | 2h | pending |
| P5-5 | Add validation (capacity, weight) | 3h | pending |
| P5-6 | Create assignment modal/form | 3h | pending |
| P5-7 | Add visual feedback on assignment | 2h | pending |
| P5-8 | Implement "Remove from Truck" functionality | 2h | pending |

**Deliverables:**
- Drag-and-drop assignment working
- Form-based assignment working
- Validation preventing invalid assignments

---

### Phase 6: Map Visualization (1.5 days)
**Goal:** Add interactive map view.

| Task | Description | Time | Status |
|------|-------------|------|--------|
| P6-1 | Set up Leaflet with React-Leaflet | 3h | pending |
| P6-2 | Create `MapView.tsx` component | 4h | pending |
| P6-3 | Add markers for all locations | 2h | pending |
| P6-4 | Implement route drawing (polylines) | 3h | pending |
| P6-5 | Color-code routes by truck | 2h | pending |
| P6-6 | Add toggle between List View and Map View | 2h | pending |
| P6-7 | Add click handlers for map elements | 2h | pending |

**Deliverables:**
- Functional map view
- Routes visualized on map
- Toggle between list and map

---

### Phase 7: Route Optimization Algorithm (2.5 days)
**Goal:** Implement the optimization logic.

| Task | Description | Time | Status |
|------|-------------|------|--------|
| P7-1 | Create `lib/algorithms/distance.ts` with Haversine formula | 2h | pending |
| P7-2 | Create `lib/algorithms/cluster.ts` - group cars by destination | 3h | pending |
| P7-3 | Create `lib/algorithms/assign.ts` - assign to trucks respecting constraints | 4h | pending |
| P7-4 | Create `lib/algorithms/route.ts` - TSP solver (Nearest Neighbor) | 4h | pending |
| P7-5 | Create `lib/algorithms/optimize.ts` - main orchestrator | 3h | pending |
| P7-6 | Integrate algorithm with context (auto-run on changes) | 3h | pending |
| P7-7 | Add "Optimize" button for manual trigger | 1h | pending |
| P7-8 | Display optimization results (savings, unassigned cars) | 2h | pending |

**Deliverables:**
- Working optimization algorithm
- Auto-run on data changes
- Results displayed to user

**Algorithm Details:**
```
Input: trucks, cars, current assignments
1. Group cars by delivery location (cluster)
2. For each cluster:
   a. Calculate total weight and count
   b. Find trucks with available capacity/weight
3. Assign clusters to trucks using First-Fit Decreasing (largest cluster first)
4. For each truck with assignments:
   a. List all stops (depot -> pickups -> deliveries -> depot)
   b. Solve TSP using Nearest Neighbor:
      - Start at depot
      - Repeatedly visit nearest unvisited stop
      - Return to depot
5. Calculate total distance for each route
6. Validate all constraints
7. Return optimized routes
```

---

### Phase 8: AI Chat Placeholder (1 day)
**Goal:** Add floating sidebar with mock AI suggestions.

| Task | Description | Time | Status |
|------|-------------|------|--------|
| P8-1 | Create `AIChatSidebar.tsx` component | 2h | pending |
| P8-2 | Add floating sidebar styling | 2h | pending |
| P8-3 | Add text input and button | 2h | pending |
| P8-4 | Implement mock suggestion generator | 3h | pending |
| P8-5 | Add Apply/Modify/Dismiss buttons | 2h | pending |
| P8-6 | Connect Apply to optimization algorithm | 1h | pending |

**Deliverables:**
- Floating AI chat sidebar
- Mock optimization suggestions
- Integration with algorithm

---

### Phase 9: Polish & Testing (2 days)
**Goal:** Final touches and quality assurance.

| Task | Description | Time | Status |
|------|-------------|------|--------|
| P9-1 | Add loading states for algorithm runs | 2h | pending |
| P9-2 | Add error handling and notifications | 3h | pending |
| P9-3 | Improve responsive design | 3h | pending |
| P9-4 | Add tooltips/help text | 2h | pending |
| P9-5 | Test all assignment scenarios | 4h | pending |
| P9-6 | Test algorithm with edge cases | 4h | pending |
| P9-7 | Fix bugs identified during testing | 4h | pending |
| P9-8 | Performance optimization if needed | 2h | pending |

**Deliverables:**
- Polished, bug-free application
- All acceptance criteria met

---

## Task Priority Matrix

| Priority | Feature | Reason |
|----------|---------|--------|
| P0 | Dashboard + Manual Assignment | Core functionality |
| P0 | Algorithm | Primary value proposition |
| P1 | Map Visualization | Important for understanding routes |
| P1 | AI Chat Placeholder | Stretch goal, nice-to-have |
| P2 | Polish/Testing | Quality assurance |

---

## Dependencies Between Tasks

```
Phase 0: Setup
    |
    v
Phase 1: Data Model --> Phase 2: State Management
    |                                    |
    v                                    v
Phase 3: Truck List <-- Phase 4: Car List
    |                    |
    v                    v
Phase 5: Manual Assignment
    |
    v
Phase 6: Map Visualization
    |
    v
Phase 7: Algorithm (depends on Data Model + State)
    |
    v
Phase 8: AI Chat (depends on Algorithm)
    |
    v
Phase 9: Polish & Testing
```

---

## Milestones

| Milestone | Date | Criteria |
|-----------|------|----------|
| **M1: Foundation** | Day 2 | Project setup + Data model complete |
| **M2: Dashboard Ready** | Day 4 | Truck List + Car List functional |
| **M3: Assignment Works** | Day 6 | Manual assignment (both methods) working |
| **M4: Algorithm Integrated** | Day 9 | Optimization working with auto-run |
| **M5: AI Chat Added** | Day 10 | Sidebar with mock suggestions |
| **M6: MVP Complete** | Day 12 | All acceptance criteria met |

---

## Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Algorithm too slow for 30 cars | Medium | High | Start with simple heuristic, optimize later |
| Map integration complex | Low | Medium | Use well-documented Leaflet library |
| Drag-and-drop bugs | Medium | Medium | Test thoroughly, have form fallback |
| State management complexity | Medium | High | Use Context API, keep state flat |

---

## Testing Strategy

### Unit Tests
- Distance calculation (Haversine formula)
- Clustering logic
- Assignment validation
- TSP solver

### Integration Tests
- Drag-and-drop assignment flow
- Algorithm trigger and results
- Map rendering with routes

### Manual Tests
- All acceptance criteria
- Edge cases (full truck, overweight, etc.)
- UI responsiveness

---

## Deployment Notes

For MVP, deployment is optional but can be done via:
- **Vercel** (recommended for Next.js): 1-click deploy from GitHub
- **Netlify**: Alternative hosting
- **Local**: `npm run dev` for development

---

## Next Steps After MVP

1. Connect to real data source (API or CSV import)
2. Add backend for data persistence
3. Implement real AI integration
4. Add user authentication
5. Add more constraints (time windows, traffic)
6. Add reporting/export functionality
7. Mobile responsiveness
