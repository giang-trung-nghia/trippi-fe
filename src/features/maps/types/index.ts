/**
 * Map Types
 * Type definitions for map-related features
 */

import type { TripItem } from "@/types/trip"

// Map Type IDs supported by Google Maps
export type MapTypeId = "roadmap" | "satellite" | "hybrid" | "terrain"

// Map configuration
export type MapConfig = {
  defaultCenter: google.maps.LatLngLiteral
  defaultZoom: number
  mapTypeId: MapTypeId
}

// Marker data for trip items
export type MarkerData = {
  item: TripItem
  position: google.maps.LatLngLiteral
  dayIndex: number
  itemOrder: number
}

// Route statistics
export type RouteStats = {
  distance: string
  duration: string
}

// Place search result
export type PlaceResult = {
  placeId: string
  name: string
  formattedAddress: string
  location: google.maps.LatLngLiteral
  viewport?: {
    northeast: google.maps.LatLngLiteral
    southwest: google.maps.LatLngLiteral
  }
  types?: string[]
  rating?: number
  userRatingsTotal?: number
  phoneNumber?: string
  website?: string
  photos?: Array<{
    name: string
    photoUri?: string
    widthPx?: number
    heightPx?: number
  }>
  currentOpeningHours?: Array<{
    day: number
    time: string
  }>
}

// Route polyline configuration
export type RoutePolylineConfig = {
  strokeColor: string
  strokeWeight: number
  strokeOpacity: number
}

// Map view state
export type MapViewState = {
  showRoutes: boolean
  showLegend: boolean
  mapType: MapTypeId
  routeStats: RouteStats | null
}

// Google Routes API types
export type RoutesAPIRequest = {
  origin: {
    location: {
      latLng: {
        latitude: number
        longitude: number
      }
    }
  }
  destination: {
    location: {
      latLng: {
        latitude: number
        longitude: number
      }
    }
  }
  intermediates?: Array<{
    location: {
      latLng: {
        latitude: number
        longitude: number
      }
    }
  }>
  travelMode: "DRIVE" | "BICYCLE" | "WALK" | "TWO_WHEELER"
  routingPreference?: "TRAFFIC_AWARE" | "TRAFFIC_AWARE_OPTIMAL" | "TRAFFIC_UNAWARE"
  computeAlternativeRoutes?: boolean
  routeModifiers?: {
    avoidTolls?: boolean
    avoidHighways?: boolean
    avoidFerries?: boolean
  }
  languageCode?: string
  units?: "METRIC" | "IMPERIAL"
}

export type RoutesAPIResponse = {
  routes: Array<{
    distanceMeters: number
    duration: string
    polyline: {
      encodedPolyline: string
    }
    legs?: Array<{
      distanceMeters: number
      duration: string
    }>
  }>
}

