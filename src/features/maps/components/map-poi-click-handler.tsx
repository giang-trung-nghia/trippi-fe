"use client"

import { useEffect, useRef } from "react"
import { useMap } from "@vis.gl/react-google-maps"
import { reverseGeocode, searchNearby, getPlaceDetails } from "@/services/maps"
import type { PlaceResult } from "@/features/maps/types"

type MapPoiClickHandlerProps = {
  onPlaceClick: (place: PlaceResult, position: google.maps.LatLngLiteral) => void
}

/**
 * Handles clicks on Google Maps built-in POIs (Points of Interest)
 * Intercepts POI clicks at DOM level to prevent default Google Maps info window
 * and shows our custom PlaceInfoPanel instead
 */
export function MapPoiClickHandler({ onPlaceClick }: MapPoiClickHandlerProps) {
  const map = useMap()
  const isHandlingClickRef = useRef(false)

  useEffect(() => {
    if (!map) return

    // Simplified approach: Just hide info windows with CSS
    // Don't use MutationObserver as it might be too aggressive
    const hideDefaultInfoWindows = () => {
      const style = document.createElement("style")
      style.id = "hide-google-maps-info-windows"
      style.textContent = `
        /* Hide Google Maps default info windows */
        .gm-style-iw,
        .gm-style-iw-c,
        .gm-style-iw-d,
        .gm-style-iw-t {
          display: none !important;
        }
      `
      if (!document.getElementById("hide-google-maps-info-windows")) {
        document.head.appendChild(style)
      }
    }

    hideDefaultInfoWindows()

    // Listen to Google Maps click event
    // When user clicks on a POI, Google Maps will trigger this event
    // We intercept it and show our custom panel instead
    const mapClickListener = map.addListener("click", async (event: google.maps.MapMouseEvent) => {
      if (!event.latLng || isHandlingClickRef.current) return

      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }

      // Use a small delay to let Google Maps process the click first
      // Then check if a place exists at this location
      setTimeout(async () => {
        if (isHandlingClickRef.current) return
        
        try {
          // Search for places near the click location
          const nearbyResult = await searchNearby(position, {
            radius: 100, // 100m radius - very small to get exact place
            maxResultCount: 1,
          })

          if (nearbyResult.places && nearbyResult.places.length > 0) {
            // Found a place - show our custom panel
            const place = nearbyResult.places[0]
            
            // Get full place details for better information
            try {
              const placeDetails = await getPlaceDetails(place.id)
              const placeResult: PlaceResult = {
                placeId: place.id,
                name: placeDetails.displayName?.text || place.displayName.text,
                formattedAddress: placeDetails.formattedAddress || place.formattedAddress,
                location: {
                  lat: place.location.latitude,
                  lng: place.location.longitude,
                },
                types: place.types || [],
              }
              onPlaceClick(placeResult, position)
            } catch {
              // Fallback to basic place info if details fail
              const placeResult: PlaceResult = {
                placeId: place.id,
                name: place.displayName.text,
                formattedAddress: place.formattedAddress,
                location: {
                  lat: place.location.latitude,
                  lng: place.location.longitude,
                },
                types: place.types || [],
              }
              onPlaceClick(placeResult, position)
            }
          } else {
            // No place found via nearby search, try reverse geocode
            const geocodeResult = await reverseGeocode(position.lat, position.lng)
            if (geocodeResult.results && geocodeResult.results.length > 0) {
              const result = geocodeResult.results[0]
              const isPlace = result.types?.some(type => 
                type === "establishment" || 
                type === "point_of_interest" ||
                type === "restaurant" ||
                type === "store" ||
                type === "lodging"
              )

              if (isPlace && result.place_id) {
                const placeResult: PlaceResult = {
                  placeId: result.place_id,
                  name: result.formatted_address.split(",")[0] || "Unknown Place",
                  formattedAddress: result.formatted_address,
                  location: {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                  },
                  types: result.types || [],
                }
                onPlaceClick(placeResult, position)
              }
            }
          }
        } catch (error) {
          console.error("Error handling map click:", error)
        }
      }, 150) // Small delay to let Google Maps process first
    })

    return () => {
      if (mapClickListener) {
        google.maps.event.removeListener(mapClickListener)
      }
      const style = document.getElementById("hide-google-maps-info-windows")
      if (style) {
        style.remove()
      }
    }
  }, [map, onPlaceClick])

  return null
}

