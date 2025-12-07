"use client"

import { useMap } from "@vis.gl/react-google-maps"
import { useEffect } from "react"
import type { MarkerData } from "@/features/maps/types"

type FitBoundsProps = {
  markers: MarkerData[]
  trigger: number // Increment this to trigger fitBounds
}

/**
 * Component that fits map bounds to show all markers
 * Must be rendered inside Map component to access map instance
 */
export function FitBounds({ markers, trigger }: FitBoundsProps) {
  const map = useMap()

  useEffect(() => {
    if (!map || markers.length === 0) return

    const bounds = new google.maps.LatLngBounds()

    markers.forEach((marker) => {
      bounds.extend(
        new google.maps.LatLng(marker.position.lat, marker.position.lng)
      )
    })

    // Fit bounds with padding
    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    })
  }, [map, trigger, markers])

  return null
}

