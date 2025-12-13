/**
 * Maps Services
 * API calls for Google Maps features
 */

import { routesApiClient, placesApiClient, geocodingApiClient } from "@/configs/google-maps-axios"
import type { RoutesAPIRequest, RoutesAPIResponse } from "@/features/maps/types"
import { API_CONFIG } from "@/features/maps/constants"
import { getCurrentLocale, getCurrentLanguageCode } from "@/store/use-locale-store"

// ============================================================================
// Routes API
// ============================================================================

/**
 * Calculate route using Google Routes API (New)
 * @param waypoints Array of lat/lng coordinates
 * @param options Route calculation options
 * @returns Route data with distance, duration, and polyline
 */
export const calculateRoute = async (
  waypoints: google.maps.LatLngLiteral[],
  options?: {
    travelMode?: "DRIVE" | "BICYCLE" | "WALK" | "TWO_WHEELER"
    routingPreference?: "TRAFFIC_AWARE" | "TRAFFIC_AWARE_OPTIMAL" | "TRAFFIC_UNAWARE"
    avoidTolls?: boolean
    avoidHighways?: boolean
    avoidFerries?: boolean
  }
): Promise<RoutesAPIResponse> => {
  if (waypoints.length < 2) {
    throw new Error("At least 2 waypoints are required")
  }

  const origin = {
    location: {
      latLng: {
        latitude: waypoints[0].lat,
        longitude: waypoints[0].lng,
      },
    },
  }

  const destination = {
    location: {
      latLng: {
        latitude: waypoints[waypoints.length - 1].lat,
        longitude: waypoints[waypoints.length - 1].lng,
      },
    },
  }

  const intermediates = waypoints.slice(1, -1).map((point) => ({
    location: {
      latLng: {
        latitude: point.lat,
        longitude: point.lng,
      },
    },
  }))

  const requestBody: RoutesAPIRequest = {
    origin,
    destination,
    intermediates: intermediates.length > 0 ? intermediates : undefined,
    travelMode: options?.travelMode || "DRIVE",
    routingPreference: options?.routingPreference || "TRAFFIC_AWARE",
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: options?.avoidTolls || false,
      avoidHighways: options?.avoidHighways || false,
      avoidFerries: options?.avoidFerries || false,
    },
    languageCode: getCurrentLocale(),
    units: "METRIC",
  }

  const response = await routesApiClient.post<RoutesAPIResponse>(
    "/directions/v2:computeRoutes",
    requestBody,
    {
      headers: {
        "X-Goog-FieldMask": API_CONFIG.FIELD_MASK,
      },
    }
  )

  return response.data
}

/**
 * Calculate multiple routes for alternative options
 */
export const calculateAlternativeRoutes = async (
  waypoints: google.maps.LatLngLiteral[],
  options?: Parameters<typeof calculateRoute>[1]
): Promise<RoutesAPIResponse> => {
  const origin = {
    location: {
      latLng: {
        latitude: waypoints[0].lat,
        longitude: waypoints[0].lng,
      },
    },
  }

  const destination = {
    location: {
      latLng: {
        latitude: waypoints[waypoints.length - 1].lat,
        longitude: waypoints[waypoints.length - 1].lng,
      },
    },
  }

  const intermediates = waypoints.slice(1, -1).map((point) => ({
    location: {
      latLng: {
        latitude: point.lat,
        longitude: point.lng,
      },
    },
  }))

  const requestBody: RoutesAPIRequest = {
    origin,
    destination,
    intermediates: intermediates.length > 0 ? intermediates : undefined,
    travelMode: options?.travelMode || "DRIVE",
    routingPreference: options?.routingPreference || "TRAFFIC_AWARE",
    computeAlternativeRoutes: true, // Request alternatives
    routeModifiers: {
      avoidTolls: options?.avoidTolls || false,
      avoidHighways: options?.avoidHighways || false,
      avoidFerries: options?.avoidFerries || false,
    },
    languageCode: getCurrentLocale(),
    units: "METRIC",
  }

  const response = await routesApiClient.post<RoutesAPIResponse>(
    "/directions/v2:computeRoutes",
    requestBody,
    {
      headers: {
        "X-Goog-FieldMask":
          "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.description",
      },
    }
  )

  return response.data
}

// ============================================================================
// Places API (New)
// ============================================================================

export type PlaceSearchResult = {
  places: Array<{
    id: string
    formattedAddress: string
    displayName: {
      text: string
      languageCode: string
    }
    location: {
      latitude: number
      longitude: number
    }
    types?: string[]
    rating?: number
    userRatingCount?: number
  }>
}

/**
 * Search for places using Text Search (New)
 */
export const searchPlaces = async (
  query: string,
  options?: {
    location?: google.maps.LatLngLiteral
    radius?: number
    maxResultCount?: number
  }
): Promise<PlaceSearchResult> => {
  // Get current locale - ensure it's Vietnamese by default
  const locale = getCurrentLocale()
  
  // Debug log to verify locale is correct
  if (process.env.NODE_ENV === "development") {
    console.log("[searchPlaces] Using locale:", locale, "for query:", query)
  }

  const requestBody = {
    textQuery: query,
    locationBias: options?.location
      ? {
          circle: {
            center: {
              latitude: options.location.lat,
              longitude: options.location.lng,
            },
            radius: options?.radius || 5000,
          },
        }
      : undefined,
    maxResultCount: options?.maxResultCount || 10,
    languageCode: locale,
  }

  const response = await placesApiClient.post<PlaceSearchResult>(
    "/places:searchText",
    requestBody,
    {
      headers: {
        "X-Goog-FieldMask":
          "places.id,places.formattedAddress,places.displayName,places.location,places.types,places.rating,places.userRatingCount",
      },
    }
  )

  return response.data
}

/**
 * Get place details by ID
 */
export const getPlaceDetails = async (placeId: string) => {
  const response = await placesApiClient.get(`/places/${placeId}`, {
    headers: {
      "X-Goog-FieldMask":
        "id,formattedAddress,displayName,location,types,rating,userRatingCount,websiteUri,internationalPhoneNumber,currentOpeningHours",
    },
  })

  return response.data
}

// ============================================================================
// Geocoding API
// ============================================================================

export type GeocodingResult = {
  results: Array<{
    formatted_address: string
    geometry: {
      location: {
        lat: number
        lng: number
      }
      location_type: string
    }
    place_id: string
    types: string[]
  }>
  status: string
}

/**
 * Geocode an address to coordinates
 */
export const geocodeAddress = async (address: string): Promise<GeocodingResult> => {
  const language = getCurrentLanguageCode() // Geocoding API uses language code only (e.g., "vi" or "en")
  
  const response = await geocodingApiClient.get<GeocodingResult>("/geocode/json", {
    params: {
      address,
      language,
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  })

  return response.data
}

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<GeocodingResult> => {
  const language = getCurrentLanguageCode() // Geocoding API uses language code only (e.g., "vi" or "en")
  
  const response = await geocodingApiClient.get<GeocodingResult>("/geocode/json", {
    params: {
      latlng: `${lat},${lng}`,
      language,
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  })

  return response.data
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Decode Google's encoded polyline format
 */
export function decodePolyline(encoded: string): google.maps.LatLngLiteral[] {
  const poly: google.maps.LatLngLiteral[] = []
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b
    let shift = 0
    let result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lng += dlng

    const point = {
      lat: lat / 1e5,
      lng: lng / 1e5,
    }
    poly.push(point)
  }

  return poly
}

/**
 * Format distance in readable format
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`
  }
  return `${meters} m`
}

/**
 * Format duration in readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

