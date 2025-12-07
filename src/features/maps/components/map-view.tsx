"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps"
import { MapControls } from "./map-controls"
import { MapLegend } from "./map-legend"
import { RoutePolyline } from "./route-polyline"
import { AddPlaceDialog } from "./add-place-dialog"
import type { Trip } from "@/types/trip"
import type { MarkerData, MapTypeId, RouteStats, PlaceResult } from "@/features/maps/types"
import { TripItemType } from "@/features/trip/enums/trip-item-type"
import { MarkerColors } from "@/features/maps/enums"
import { DEFAULT_MAP_CONFIG } from "@/features/maps/constants"
import {
  MapPin,
  Hotel,
  UtensilsCrossed,
  Compass,
  Bus,
  Landmark,
} from "lucide-react"

type MapViewProps = {
  trip: Trip
  selectedDayId: string | null
}

export function MapView({ trip, selectedDayId }: MapViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const [showRoutes, setShowRoutes] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [mapType, setMapType] = useState<MapTypeId>(DEFAULT_MAP_CONFIG.mapTypeId)
  const [routeStats, setRouteStats] = useState<RouteStats | null>(null)

  // Stable map state - don't update during user interaction
  const [initialCenter] = useState(DEFAULT_MAP_CONFIG.center)
  const [initialZoom] = useState(DEFAULT_MAP_CONFIG.zoom)

  // Get markers from trip items
  const markers = useMemo(() => {
    const allMarkers: MarkerData[] = []

    trip.days.forEach((day) => {
      // Filter by selected day if applicable
      if (selectedDayId && day.id !== selectedDayId) return

      day.items.forEach((item) => {
        if (item.location) {
          allMarkers.push({
            item,
            position: item.location,
            dayIndex: day.dayIndex,
            itemOrder: item.order,
          })
        }
      })
    })

    return allMarkers
  }, [trip, selectedDayId])

  // Get route coordinates for polyline
  const routeCoordinates = useMemo(() => {
    return markers
      .sort((a, b) => {
        if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex
        return a.itemOrder - b.itemOrder
      })
      .map((m) => m.position)
  }, [markers])

  // Create unique key for route to force re-render when day changes
  const routeKey = useMemo(() => {
    // Use a combination of day and coordinates to force remount
    const coordsHash = routeCoordinates.map(c => `${c.lat},${c.lng}`).join('|')
    return `route-${selectedDayId || 'all'}-${coordsHash}`
  }, [selectedDayId, routeCoordinates])

  const getMarkerIcon = (type: TripItemType) => {
    switch (type) {
      case TripItemType.HOTEL:
        return Hotel
      case TripItemType.MEAL:
        return UtensilsCrossed
      case TripItemType.TRANSPORT:
        return Bus
      case TripItemType.ACTIVITY:
        return Compass
      case TripItemType.PLACE:
        return Landmark
      default:
        return MapPin
    }
  }

  const getMarkerColor = (type: TripItemType): string => {
    switch (type) {
      case TripItemType.HOTEL:
        return MarkerColors.HOTEL
      case TripItemType.MEAL:
        return MarkerColors.MEAL
      case TripItemType.TRANSPORT:
        return MarkerColors.TRANSPORT
      case TripItemType.ACTIVITY:
        return MarkerColors.ACTIVITY
      case TripItemType.PLACE:
        return MarkerColors.PLACE
      case TripItemType.NOTE:
        return MarkerColors.NOTE
      default:
        return MarkerColors.NOTE
    }
  }

  const handlePlaceAdd = (place: PlaceResult) => {
    // In a real app, this would add the place to the trip
    console.log("Place added:", place)
    // You could show a toast notification here
    alert(`Added "${place.name}" to your trip!`)
  }

  const handleRouteCalculated = useCallback((distance: string, duration: string) => {
    setRouteStats({ distance, duration })
  }, [])

  const handleFitBounds = useCallback(() => {
    // This will be called when user clicks fit bounds button
    // For now, it's a placeholder - can implement actual fitBounds later
  }, [])

  const handleToggleRoutes = useCallback(() => {
    setShowRoutes(prev => !prev)
    // Clear stats when hiding routes
    if (showRoutes) {
      setRouteStats(null)
    }
  }, [showRoutes])

  return (
    <div className="h-full w-full">
      <Map
        defaultCenter={initialCenter}
        defaultZoom={initialZoom}
        mapTypeId={mapType}
        gestureHandling="greedy"
        fullscreenControl={false}
        streetViewControl={false}
        disableDefaultUI={false}
        mapId="trippi-map"
        className="h-full w-full"
      >
        {/* Markers */}
        {markers.map((markerData, index) => {
          const Icon = getMarkerIcon(markerData.item.type)
          const color = getMarkerColor(markerData.item.type)

          return (
            <MarkerWithIcon
              key={markerData.item.id}
              position={markerData.position}
              icon={Icon}
              color={color}
              label={`${index + 1}`}
              onClick={() => setSelectedMarker(markerData)}
            />
          )
        })}

        {/* Info Window */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-gray-900">
                {selectedMarker.item.name}
              </h3>
              {selectedMarker.item.placeName && (
                <p className="text-sm text-gray-600">
                  {selectedMarker.item.placeName}
                </p>
              )}
              {selectedMarker.item.address && (
                <p className="mt-1 text-xs text-gray-500">
                  {selectedMarker.item.address}
                </p>
              )}
              {selectedMarker.item.startTime && (
                <p className="mt-1 text-xs font-medium text-blue-600">
                  {selectedMarker.item.startTime}
                  {selectedMarker.item.endTime &&
                    ` - ${selectedMarker.item.endTime}`}
                </p>
              )}
              {selectedMarker.item.description && (
                <p className="mt-2 text-sm text-gray-700">
                  {selectedMarker.item.description}
                </p>
              )}
            </div>
          </InfoWindow>
        )}

        {/* Routes */}
        {showRoutes && routeCoordinates.length > 1 && (
          <RoutePolyline
            key={routeKey}
            path={routeCoordinates}
            onRouteCalculated={handleRouteCalculated}
          />
        )}

        {/* Map Controls */}
        <MapControls
          showRoutes={showRoutes}
          showLegend={showLegend}
          mapType={mapType}
          onToggleRoutes={handleToggleRoutes}
          onToggleLegend={() => setShowLegend(!showLegend)}
          onMapTypeChange={setMapType}
          onFitBounds={handleFitBounds}
          markerCount={markers.length}
          routeStats={routeStats}
        />

        {/* Legend */}
        {showLegend && <MapLegend />}

        {/* Add Place Button */}
        <AddPlaceDialog onPlaceAdd={handlePlaceAdd} />
      </Map>
    </div>
  )
}

// Custom marker with icon using AdvancedMarker
type MarkerWithIconProps = {
  position: google.maps.LatLngLiteral
  icon: React.ElementType
  color: string
  label?: string
  onClick?: () => void
}

function MarkerWithIcon({
  position,
  color,
  label,
  onClick,
}: MarkerWithIconProps) {
  return (
    <Marker
      position={position}
      onClick={onClick}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      }}
      label={{
        text: label || "",
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    />
  )
}
