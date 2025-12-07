"use client"

import { useMap } from "@vis.gl/react-google-maps"
import { useEffect, useRef, useState } from "react"
import { DEFAULT_ROUTE_CONFIG } from "@/features/maps/constants"
import { calculateRoute, decodePolyline, formatDistance, formatDuration } from "@/services/maps"

type RoutePolylineProps = {
  path: google.maps.LatLngLiteral[]
  strokeColor?: string
  strokeWeight?: number
  strokeOpacity?: number
  onRouteCalculated?: (distance: string, duration: string) => void
}

export function RoutePolyline({
  path,
  strokeColor = DEFAULT_ROUTE_CONFIG.strokeColor,
  strokeWeight = DEFAULT_ROUTE_CONFIG.strokeWeight,
  strokeOpacity = DEFAULT_ROUTE_CONFIG.strokeOpacity,
  onRouteCalculated,
}: RoutePolylineProps) {
  const map = useMap()
  const polylineRef = useRef<google.maps.Polyline | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cleanup function to remove polyline
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null)
        polylineRef.current = null
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (!map || path.length < 2) return

    // Always remove existing polyline first
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (isCalculating) return

    setIsCalculating(true)

    // Create new abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Calculate route using service
    const fetchRoute = async () => {
      try {
        // Call Routes API through service
        const data = await calculateRoute(path, {
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE",
        })

        if (data.routes && data.routes.length > 0 && !abortController.signal.aborted) {
          const route = data.routes[0]

          // Decode polyline
          const decodedPath = decodePolyline(route.polyline.encodedPolyline)

          // Only draw if component is still mounted and map exists
          if (map && !abortController.signal.aborted) {
            // Draw polyline on map
            const newPolyline = new google.maps.Polyline({
              path: decodedPath,
              geodesic: true,
              strokeColor,
              strokeOpacity,
              strokeWeight,
              map,
            })

            polylineRef.current = newPolyline
          }

          // Calculate distance and duration
          const distanceMeters = route.distanceMeters || 0
          const durationSeconds = parseInt(
            route.duration?.replace("s", "") || "0"
          )

          const distanceText = formatDistance(distanceMeters)
          const durationText = formatDuration(durationSeconds)

          if (onRouteCalculated && !abortController.signal.aborted) {
            onRouteCalculated(distanceText, durationText)
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Route calculation aborted")
          return
        }
        console.error("Error calculating route:", error)

        // Fallback: Draw simple polyline without route calculation
        if (map && !abortController.signal.aborted) {
          const newPolyline = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor,
            strokeOpacity,
            strokeWeight,
            map,
          })
          polylineRef.current = newPolyline
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsCalculating(false)
        }
      }
    }

    fetchRoute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, JSON.stringify(path), strokeColor, strokeOpacity, strokeWeight])

  return null
}
