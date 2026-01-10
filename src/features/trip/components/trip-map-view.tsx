"use client"

import { useState, useMemo, useCallback } from "react"
import { APIProvider, useMap } from "@vis.gl/react-google-maps"
import { MapView } from "@/features/maps/components/map-view"
import { MapSidebar } from "@/features/maps/components/map-sidebar"
import { useLocaleStore } from "@/store/use-locale-store"
import type { Trip, TripItem } from "@/types/trip"
import { 
  useRemoveTripItem, 
  useUpdateTripItem 
} from "@/features/trip/hooks/use-trip-mutations"
import { toast } from "@/lib/toast"

type TripMapViewProps = {
  trip: Trip
}

/**
 * Inner component that has access to the map instance
 */
function TripMapViewInner({ trip, selectedDayId, onDaySelect }: { 
  trip: Trip
  selectedDayId: string | null
  onDaySelect: (dayId: string | null) => void
}) {
  const map = useMap()
  const removeTripItemMutation = useRemoveTripItem(trip.id)
  const updateTripItemMutation = useUpdateTripItem(trip.id)

  const handleItemClick = useCallback((item: TripItem) => {
    if (!map || !item.location) return
    
    // Pan and zoom to the item location
    map.panTo(item.location)
    const currentZoom = map.getZoom()
    if (currentZoom && currentZoom < 15) {
      map.setZoom(15)
    }
    
    toast.success(`Centered on ${item.name}`)
  }, [map])

  const handleItemDelete = useCallback((itemId: string) => {
    removeTripItemMutation.mutate(itemId, {
      onSuccess: () => {
        toast.success("Trip item deleted successfully")
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete trip item"
        )
      },
    })
  }, [removeTripItemMutation])

  const handleItemUpdate = useCallback((
    itemId: string, 
    updates: { startTime?: string; endTime?: string; cost?: number }
  ) => {
    updateTripItemMutation.mutate(
      { itemId, updates },
      {
        onSuccess: () => {
          toast.success("Trip item updated successfully")
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to update trip item"
          )
        },
      }
    )
  }, [updateTripItemMutation])

  return (
    <div className="flex h-[calc(100vh-180px)] w-full overflow-hidden rounded-lg border">
      <MapSidebar
        trip={trip}
        selectedDayId={selectedDayId}
        onDaySelect={onDaySelect}
        onItemClick={handleItemClick}
        onItemDelete={handleItemDelete}
        onItemUpdate={handleItemUpdate}
      />

      <div className="flex-1 relative min-w-0 overflow-hidden">
        <MapView 
          trip={trip} 
          selectedDayId={selectedDayId}
        />
      </div>
    </div>
  )
}

/**
 * Map view component - wraps map components with API provider
 * Handles day selection and map interactions
 */
export function TripMapView({ trip }: TripMapViewProps) {
  const [userSelectedDayId, setUserSelectedDayId] = useState<string | null>(null)
  const languageCode = useLocaleStore((state) => state.languageCode)

  // Compute selected day: user selection or default to first day
  const selectedDayId = useMemo(() => {
    if (userSelectedDayId) return userSelectedDayId
    if (trip?.days && trip.days.length > 0) return trip.days[0].id
    return null
  }, [userSelectedDayId, trip?.days])

  const handleDaySelect = (dayId: string | null) => {
    setUserSelectedDayId(dayId)
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error("Google Maps API key is not configured")
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">Google Maps configuration error</p>
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey} language={languageCode}>
      <TripMapViewInner 
        trip={trip} 
        selectedDayId={selectedDayId} 
        onDaySelect={handleDaySelect}
      />
    </APIProvider>
  )
}

