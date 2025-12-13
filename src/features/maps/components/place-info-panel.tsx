"use client"

import { useEffect, useState, useRef } from "react"
import { useMap } from "@vis.gl/react-google-maps"
import { Plus, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PlaceResult } from "@/features/maps/types"
import type { TripDay } from "@/types/trip"

type PlaceInfoPanelProps = {
  place: PlaceResult
  position: google.maps.LatLngLiteral
  onClose: () => void
  onAddToTrip: (place: PlaceResult) => void
  selectedDay?: TripDay | null
}

export function PlaceInfoPanel({
  place,
  position,
  onClose,
  onAddToTrip,
  selectedDay,
}: PlaceInfoPanelProps) {
  const map = useMap()
  const [pixelPosition, setPixelPosition] = useState<{ x: number; y: number } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!map) return

    const updatePosition = () => {
      const projection = map.getProjection()
      if (!projection) return

      const worldCoordinate = projection.fromLatLngToPoint(
        new google.maps.LatLng(position.lat, position.lng)
      )

      if (worldCoordinate) {
        const mapDiv = map.getDiv()
        const mapBounds = map.getBounds()
        if (!mapBounds) return

      const northEast = mapBounds.getNorthEast()
      const southWest = mapBounds.getSouthWest()
      
      if (!northEast || !southWest || !worldCoordinate) return

      const topRight = projection.fromLatLngToPoint(northEast)
      const bottomLeft = projection.fromLatLngToPoint(southWest)

      if (!topRight || !bottomLeft) return

      const scaleX = mapDiv.offsetWidth / (topRight.x - bottomLeft.x)
      const scaleY = mapDiv.offsetHeight / (topRight.y - bottomLeft.y)

      const x = (worldCoordinate.x - bottomLeft.x) * scaleX
      const y = (worldCoordinate.y - topRight.y) * scaleY

        setPixelPosition({ x, y })
      }
    }

    updatePosition()

    // Update on zoom/pan
    const listeners = [
      google.maps.event.addListener(map, "zoom_changed", updatePosition),
      google.maps.event.addListener(map, "bounds_changed", updatePosition),
      google.maps.event.addListener(map, "center_changed", updatePosition),
    ]

    return () => {
      listeners.forEach((listener) => google.maps.event.removeListener(listener))
    }
  }, [map, position])

  // Debug log
  useEffect(() => {
    console.log("[PlaceInfoPanel] Component mounted/updated:", {
      placeName: place.name,
      position,
      pixelPosition,
      hasMap: !!map,
    })
  }, [place.name, position, pixelPosition, map])

  if (!pixelPosition) {
    // Return a placeholder while calculating position
    return (
      <div className="absolute z-50 opacity-0 pointer-events-none">
        {/* Placeholder to prevent layout shift */}
      </div>
    )
  }

  return (
    <div
      ref={panelRef}
      className="absolute z-50 w-80 rounded-lg bg-white shadow-2xl border border-gray-200 pointer-events-auto"
      style={{
        left: `${pixelPosition.x}px`,
        top: `${pixelPosition.y}px`,
        transform: "translate(-50%, -100%)",
        marginTop: "-10px",
      }}
    >
      {/* Arrow pointing down */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
        <div className="h-0 w-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
        <div className="h-0 w-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-200 -mt-px ml-px"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {place.name}
            </h3>
            {place.formattedAddress && (
              <div className="mt-1 flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600 line-clamp-2">
                  {place.formattedAddress}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Add to Trip Button */}
        <Button
          onClick={() => onAddToTrip(place)}
          className="w-full gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          <span>
            {selectedDay
              ? `Add to Day ${selectedDay.dayIndex}`
              : "Add to Trip"}
          </span>
        </Button>
      </div>
    </div>
  )
}
