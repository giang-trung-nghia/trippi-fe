"use client"

import { useState } from "react"
import { APIProvider } from "@vis.gl/react-google-maps"
import { MapView } from "@/features/maps/components/map-view"
import { MapSidebar } from "@/features/maps/components/map-sidebar"
import { mockTrip } from "@/mocks/trip-data"
import type { Trip } from "@/types/trip"
import { useLocaleStore } from "@/store/use-locale-store"

export default function MapsPage() {
  const [selectedTrip] = useState<Trip>(mockTrip)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(
    mockTrip.days[0]?.id || null
  )
  const languageCode = useLocaleStore((state) => state.languageCode)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error("Google Maps API key is not configured")
    return <div>Google Maps is error</div>
  }

  return (
    <APIProvider apiKey={apiKey} language={languageCode}>
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <MapSidebar
          trip={selectedTrip}
          selectedDayId={selectedDayId}
          onDaySelect={setSelectedDayId}
        />

        {/* Map Container - Takes remaining space */}
        <div className="flex-1 relative min-w-0 overflow-hidden">
          <MapView trip={selectedTrip} selectedDayId={selectedDayId} />
        </div>
      </div>
    </APIProvider>
  )
}

