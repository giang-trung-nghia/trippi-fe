"use client"

import { useState } from "react"
import { APIProvider } from "@vis.gl/react-google-maps"
import { MapView } from "@/features/maps/components/map-view"
import { MapSidebar } from "@/features/maps/components/map-sidebar"
import { mockTrip } from "@/mocks/trip-data"
import type { Trip } from "@/types/trip"

export default function MapsPage() {
  const [selectedTrip] = useState<Trip>(mockTrip)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(
    mockTrip.days[0]?.id || null
  )

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error("Google Maps API key is not configured")
    return <div>Google Maps is error</div>
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
        {/* Sidebar */}
        <MapSidebar
          trip={selectedTrip}
          selectedDayId={selectedDayId}
          onDaySelect={setSelectedDayId}
        />

        {/* Map */}
        <MapView trip={selectedTrip} selectedDayId={selectedDayId} />
      </div>
    </APIProvider>
  )
}

