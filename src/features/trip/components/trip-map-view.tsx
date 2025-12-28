"use client"

import { useState, useMemo } from "react"
import { APIProvider } from "@vis.gl/react-google-maps"
import { MapView } from "@/features/maps/components/map-view"
import { MapSidebar } from "@/features/maps/components/map-sidebar"
import { useLocaleStore } from "@/store/use-locale-store"
import type { Trip } from "@/types/trip"

type TripMapViewProps = {
  trip: Trip
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
      <div className="flex h-[calc(100vh-320px)] w-full overflow-hidden rounded-lg border">
        <MapSidebar
          trip={trip}
          selectedDayId={selectedDayId}
          onDaySelect={handleDaySelect}
        />

        <div className="flex-1 relative min-w-0 overflow-hidden">
          <MapView trip={trip} selectedDayId={selectedDayId} />
        </div>
      </div>
    </APIProvider>
  )
}

