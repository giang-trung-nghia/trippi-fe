"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import {
  Map,
  Marker,
} from "@vis.gl/react-google-maps"
import { MapControls } from "./map-controls"
import { MapLegend } from "./map-legend"
import { RoutePolyline } from "./route-polyline"
import { PlaceAutocomplete } from "./place-autocomplete"
import { PlaceInfoPanel } from "./place-info-panel"
import { MapPoiClickHandler } from "./map-poi-click-handler"
import { FitBounds } from "./fit-bounds"
import type { Trip } from "@/types/trip"
import type { MarkerData, RouteStats, PlaceResult } from "@/features/maps/types"
import { TripItemType } from "@/features/trip/enums/trip-item-type"
import { MarkerColors } from "@/features/maps/enums"
import { DEFAULT_MAP_CONFIG } from "@/features/maps/constants"
import { useUserPreferencesStore } from "@/store/use-user-preferences-store"
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
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)
  const [selectedPlacePosition, setSelectedPlacePosition] = useState<google.maps.LatLngLiteral | null>(null)
  const [showRoutes, setShowRoutes] = useState(true)
  const [routeStats, setRouteStats] = useState<RouteStats | null>(null)
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState(0)

  // Get map preferences from store
  const { mapShowLegend, mapType, setMapShowLegend, setMapType } = useUserPreferencesStore()

  // Get selected day
  const selectedDay = useMemo(() => {
    if (!selectedDayId) return null
    return trip.days.find((day) => day.id === selectedDayId) || null
  }, [trip.days, selectedDayId])

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

  const handlePlaceAdd = useCallback((place: PlaceResult) => {
    // In a real app, this would add the place to the trip
    console.log("Place added:", place)
    console.log("Selected day:", selectedDay)
    
    // Close info panels
    setSelectedPlace(null)
    setSelectedPlacePosition(null)
    setSelectedMarker(null)
    
    // You could show a toast notification here
    alert(`Added "${place.name}" to ${selectedDay ? `Day ${selectedDay.dayIndex}` : "your trip"}!`)
  }, [selectedDay])

  const handlePlaceSelect = useCallback((place: PlaceResult) => {
    setSelectedPlace(place)
    setSelectedPlacePosition(place.location)
    setSelectedMarker(null) // Close marker info if open
  }, [])

  const handlePlaceInfo = useCallback((place: PlaceResult) => {
    console.log("[MapView] handlePlaceInfo called with place:", place)
    setSelectedPlace(place)
    setSelectedPlacePosition(place.location)
    // Close marker info if open
    setSelectedMarker(null)
  }, [])

  const handleClosePlaceInfo = useCallback(() => {
    setSelectedPlace(null)
    setSelectedPlacePosition(null)
    setSelectedMarker(null) // Also close marker info if open
  }, [])

  const handlePoiClick = useCallback((place: PlaceResult, position: google.maps.LatLngLiteral) => {
    console.log("[MapView] handlePoiClick called with place:", place, "position:", position)
    // Close any existing selections
    setSelectedMarker(null)
    // Show our PlaceInfoPanel for the clicked POI
    setSelectedPlace(place)
    setSelectedPlacePosition(position)
  }, [])

  const handleRouteCalculated = useCallback((distance: string, duration: string) => {
    setRouteStats({ distance, duration })
  }, [])

  const handleFitBounds = useCallback(() => {
    if (markers.length === 0) return
    // Trigger fitBounds by incrementing the trigger value
    setFitBoundsTrigger((prev) => prev + 1)
  }, [markers])

  const handleToggleRoutes = useCallback(() => {
    setShowRoutes(prev => !prev)
    // Clear stats when hiding routes
    if (showRoutes) {
      setRouteStats(null)
    }
  }, [showRoutes])

  // Debug: Log state changes
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[MapView] selectedPlace:", selectedPlace, "selectedPlacePosition:", selectedPlacePosition)
    }
  }, [selectedPlace, selectedPlacePosition])

  return (
    <div className="relative h-full w-full">
      <Map
        defaultCenter={initialCenter}
        defaultZoom={initialZoom}
        mapTypeId={mapType}
        gestureHandling="greedy"
        fullscreenControl={false}
        streetViewControl={false}
        mapTypeControl={false}
        disableDefaultUI={false}
        clickableIcons={false}
        mapId="trippi-map"
        className="h-full w-full"
      >
        {/* Handle clicks on Google Maps built-in POIs */}
        <MapPoiClickHandler onPlaceClick={handlePoiClick} />

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
              onClick={() => {
                console.log("[MapView] Marker clicked:", markerData.item.name)
                setSelectedMarker(markerData)
                // Also close any place selection
                setSelectedPlace(null)
                setSelectedPlacePosition(null)
              }}
            />
          )
        })}

        {/* PlaceInfoPanel for selected marker - rendered inside Map for useMap hook */}
        {selectedMarker && (
          <PlaceInfoPanel
            key={`marker-${selectedMarker.item.id}`}
            place={{
              placeId: selectedMarker.item.placeId || "",
              name: selectedMarker.item.name,
              formattedAddress: selectedMarker.item.address || selectedMarker.item.placeName || "",
              location: selectedMarker.item.location || selectedMarker.position,
              types: [],
            }}
            position={selectedMarker.position}
            onClose={() => {
              console.log("[MapView] Closing marker panel")
              setSelectedMarker(null)
            }}
            onAddToTrip={handlePlaceAdd}
            selectedDay={selectedDay}
          />
        )}

        {/* PlaceInfoPanel for selected place (from autocomplete or POI click) */}
        {selectedPlace && selectedPlacePosition && (
          <PlaceInfoPanel
            key={`place-${selectedPlace.placeId}-${selectedPlacePosition.lat}-${selectedPlacePosition.lng}`}
            place={selectedPlace}
            position={selectedPlacePosition}
            onClose={handleClosePlaceInfo}
            onAddToTrip={handlePlaceAdd}
            selectedDay={selectedDay}
          />
        )}

        {showRoutes && routeCoordinates.length > 1 && (
          <RoutePolyline
            key={routeKey}
            path={routeCoordinates}
            onRouteCalculated={handleRouteCalculated}
          />
        )}

        {markers.length > 0 && (
          <FitBounds markers={markers} trigger={fitBoundsTrigger} />
        )}

        <MapControls
          showRoutes={showRoutes}
          showLegend={mapShowLegend}
          mapType={mapType}
          onToggleRoutes={handleToggleRoutes}
          onToggleLegend={() => setMapShowLegend(!mapShowLegend)}
          onMapTypeChange={setMapType}
          onFitBounds={handleFitBounds}
          markerCount={markers.length}
          routeStats={routeStats}
        />

        {mapShowLegend && <MapLegend />}
      </Map>

      <div className="absolute left-4 top-4 z-10">
        <PlaceAutocomplete
          onPlaceSelect={handlePlaceSelect}
          onPlaceInfo={handlePlaceInfo}
          placeholder="Search places..."
          className="w-[500px]"
        />
      </div>

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
