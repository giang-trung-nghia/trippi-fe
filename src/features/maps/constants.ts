export const DEFAULT_MAP_CONFIG = {
  center: {
    lat: 22.8237,
    lng: 104.9784,
  },
  zoom: 10,
  mapTypeId: "roadmap" as const,
}

export const FALLBACK_LOCATIONS = {
  HANOI: { lat: 21.0285, lng: 105.8542 },
  HO_CHI_MINH: { lat: 10.8231, lng: 106.6297 },
  DA_NANG: { lat: 16.0544, lng: 108.2022 },
  HA_GIANG: { lat: 22.8237, lng: 104.9784 },
}

export const DEFAULT_ROUTE_CONFIG = {
  strokeColor: "#3b82f6",
  strokeWeight: 3,
  strokeOpacity: 0.8,
}

// API configuration
export const API_CONFIG = {
  ROUTES_API_URL: "https://routes.googleapis.com/directions/v2:computeRoutes",
  PLACES_API_URL: "https://places.googleapis.com/v1",
  FIELD_MASK: "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
}

// Map control positions
export const CONTROL_POSITIONS = {
  TOP_RIGHT: { top: 16, right: 16 },
  BOTTOM_RIGHT: { bottom: 24, right: 16 },
  BOTTOM_CENTER: { bottom: 24, left: "50%", transform: "translateX(-50%)" },
  TOP_LEFT: { top: 16, left: 16 },
}

// Sidebar configuration
export const SIDEBAR_CONFIG = {
  width: 384, // w-96
  minWidth: 320,
  maxWidth: 480,
}

// Marker configuration
export const MARKER_CONFIG = {
  scale: 15,
  strokeWeight: 2,
  strokeColor: "#ffffff",
}

// Route calculation limits
export const ROUTE_LIMITS = {
  MAX_WAYPOINTS: 25,
  MIN_WAYPOINTS: 2,
  REQUEST_TIMEOUT: 10000, // 10 seconds
}

