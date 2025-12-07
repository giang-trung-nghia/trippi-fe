import axios from "axios"

/**
 * Google Maps API Client
 * Separate axios instance for Google Maps API calls
 */

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

// Routes API client
export const routesApiClient = axios.create({
  baseURL: "https://routes.googleapis.com",
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
  },
  timeout: 10000, // 10 seconds
})

// Places API client
export const placesApiClient = axios.create({
  baseURL: "https://places.googleapis.com/v1",
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
  },
  timeout: 10000, // 10 seconds
})

// Geocoding API client
export const geocodingApiClient = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor for logging (development only)
if (process.env.NODE_ENV === "development") {
  [routesApiClient, placesApiClient, geocodingApiClient].forEach((client) => {
    client.interceptors.request.use(
      (config) => {
        console.log(`[Google Maps API] ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error("[Google Maps API] Request error:", error)
        return Promise.reject(error)
      }
    )
  })
}

// Response interceptor for error handling
[routesApiClient, placesApiClient, geocodingApiClient].forEach((client) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // API responded with error
        console.error("[Google Maps API] Error:", {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url,
        })
      } else if (error.request) {
        // No response received
        console.error("[Google Maps API] No response:", error.request)
      } else {
        // Request setup error
        console.error("[Google Maps API] Request error:", error.message)
      }
      return Promise.reject(error)
    }
  )
})

