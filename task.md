# Project: FlowPilot

## Overview
- **Purpose**: Create a react app, that can be used to schedule the cars, on trucks, and give proposition for optimizing the routes of the FVL logistics regarding the costs.
- **Target users**: CEVA FVL planner
- **Tech stack**: React, nextjs, this will be an mvp
---

## Features

- A planning dashboard, where i can see the trucks that can be loaded, i can give him an itiniraire, and assign the new cars as cargo, we can see all the cars needed to be delivered, and already pre-grouped, per destination
- We need and algorithm that calculates the best routes, and how to laod the cargo (Disjkstra for example, but you can propose better)
- We need an ai that takes into account the already planned cargo, runs the algorithm, and propose optimizations, that the user can approve, decline, or modify in a chat. (We will not connect the ai for now, just need the texhinput placeholder first)


## Notes

- Truuck data: truck_id, capacity, weight limit, driver info (you can make up those for the mvp with the same characteristics that define a most common CEVA FVL truck)
- Car data: VIN number, type(SUV or car), pickup and delivery locations, due date
- Locations:
  - Deprtures
  - Destination
- Cost factors: just distance for now
- Objective: miniize total cost
- Constrains: truck capacity, max driving time
- On change: re-run the algo
- List/table view first, and map characteristics
- Truck assigment: both
- AI cgat us a floating sidebar, and the ai respond, and can change the plannig accordingly
- Data is hardcoded for mvp
- No need for backend for now, this is more  apoc, so it can lice in the sidebar
- no auth needed

MVP priority: the planning dashboard, and the algorithm
