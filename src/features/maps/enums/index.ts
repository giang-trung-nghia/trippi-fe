// Travel modes for routing
export enum TravelMode {
  DRIVE = "DRIVE",
  BICYCLE = "BICYCLE",
  WALK = "WALK",
  TWO_WHEELER = "TWO_WHEELER",
}

// Routing preferences
export enum RoutingPreference {
  TRAFFIC_AWARE = "TRAFFIC_AWARE",
  TRAFFIC_AWARE_OPTIMAL = "TRAFFIC_AWARE_OPTIMAL",
  TRAFFIC_UNAWARE = "TRAFFIC_UNAWARE",
}

// Map type identifiers
export enum MapType {
  ROADMAP = "roadmap",
  SATELLITE = "satellite",
  HYBRID = "hybrid",
  TERRAIN = "terrain",
}

// Unit systems
export enum UnitSystem {
  METRIC = "METRIC",
  IMPERIAL = "IMPERIAL",
}

// Marker colors for different trip item types
export const MarkerColors = {
  HOTEL: "#8b5cf6", // purple
  MEAL: "#f97316", // orange
  TRANSPORT: "#06b6d4", // cyan
  ACTIVITY: "#10b981", // green
  PLACE: "#3b82f6", // blue
  NOTE: "#6b7280", // gray
} as const

// Route polyline colors
export const RouteColors = {
  DEFAULT: "#3b82f6", // blue
  ACTIVE: "#10b981", // green
  COMPLETED: "#9ca3af", // gray
  TRAFFIC_HEAVY: "#ef4444", // red
  TRAFFIC_MEDIUM: "#f59e0b", // orange
  TRAFFIC_LIGHT: "#10b981", // green
} as const

