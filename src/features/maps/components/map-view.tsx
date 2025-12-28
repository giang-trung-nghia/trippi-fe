"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Map,
  Marker,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps"
import { MapControls } from "./map-controls"
import { MapLegend } from "./map-legend"
import { RoutePolyline } from "./route-polyline"
import { PlaceAutocomplete } from "./place-autocomplete"
import { PlaceDetailsBottomPanel } from "./place-details-bottom-panel"
import { FitBounds } from "./fit-bounds"
import { toast } from "@/lib/toast"
import type { Trip } from "@/types/trip"
import type { MarkerData, RouteStats, PlaceResult } from "@/features/maps/types"
import { TripItemType } from "@/features/trip/enums/trip-item-type"
import { MarkerColors } from "@/features/maps/enums"
import { DEFAULT_MAP_CONFIG } from "@/features/maps/constants"
import { useUserPreferencesStore } from "@/store/use-user-preferences-store"
import { useAddTripItem } from "@/features/trip/hooks/use-trip-mutations"
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
  const map = useMap()
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)
  const [selectedPlacePosition, setSelectedPlacePosition] = useState<google.maps.LatLngLiteral | null>(null)
  const [showRoutes, setShowRoutes] = useState(true)
  const [routeStats, setRouteStats] = useState<RouteStats | null>(null)
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState(0)

  // Get map preferences from store
  const { mapShowLegend, mapType, setMapShowLegend, setMapType } = useUserPreferencesStore()

  // Get custom hooks for mutations
  const addTripItemMutation = useAddTripItem(trip.id)

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
            itemOrder: item.order ?? item.orderIndex,
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

  const handlePlaceAdd = useCallback(
    (data: {
      place: PlaceResult
      startTime?: string
      endTime?: string
      cost?: number
    }) => {
      const { place, startTime, endTime, cost } = data
      
      if (!selectedDay) {
        toast.warning("Please select a day to add this place to.")
        return
      }

      // Calculate order index based on existing items
      const orderIndex = selectedDay.items.length

      // Use the custom hook to add trip item
      addTripItemMutation.mutate(
        {
          dayId: selectedDay.id,
          place,
          type: TripItemType.PLACE,
          orderIndex,
          startTime,
          endTime,
          cost,
        },
        {
          onSuccess: () => {
            setSelectedPlace(null)
            setSelectedPlacePosition(null)
            setSelectedMarker(null)
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to add place. Please try again."
            )
          },
        }
      )
    },
    [selectedDay, addTripItemMutation]
  )

  const handlePlaceSelect = useCallback((place: PlaceResult) => {
    setSelectedPlace(place)
    setSelectedPlacePosition(place.location)
    setSelectedMarker(null) // Close marker info if open
  }, [])

  const handlePlaceInfo = useCallback((place: PlaceResult) => {
    setSelectedPlace(place)
    setSelectedPlacePosition(place.location)
    
    // Center map on the selected place
    if (map) {
      map.panTo(place.location)
      // Optionally adjust zoom for better view
      const currentZoom = map.getZoom()
      if (currentZoom && currentZoom < 15) {
        map.setZoom(15)
      }
    }
  }, [map])

  const handleClosePlaceInfo = useCallback(() => {
    setSelectedPlace(null)
    setSelectedPlacePosition(null)
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

  return (
    <div className="h-full w-full">
      <Map
        defaultCenter={initialCenter}
        defaultZoom={initialZoom}
        mapTypeId={mapType}
        gestureHandling="greedy"
        fullscreenControl={false}
        streetViewControl={false}
        mapTypeControl={false}
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

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {selectedMarker.item.name}
              </h3>
              {selectedMarker.item.address && (
                <p className="text-xs text-gray-600">
                  {selectedMarker.item.address}
                </p>
              )}
            </div>
          </InfoWindow>
        )}

        {selectedPlace && selectedPlacePosition && (
          <AdvancedMarker position={selectedPlacePosition}>
            <Pin
              background="#3b82f6"
              glyphColor="#ffffff"
              borderColor="#ffffff"
              scale={1.2}
            />
          </AdvancedMarker>
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

      <PlaceAutocomplete
        onPlaceSelect={handlePlaceSelect}
        onPlaceInfo={handlePlaceInfo}
        placeholder="Search places..."
      />

      {selectedPlace && (
        <PlaceDetailsBottomPanel
          place={selectedPlace}
          selectedDay={selectedDay}
          onClose={handleClosePlaceInfo}
          onAddToTrip={handlePlaceAdd}
        />
      )}
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
