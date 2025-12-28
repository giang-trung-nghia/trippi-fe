"use client"

import { format } from "date-fns"
import { Calendar, MapPin, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Trip } from "@/types/trip"
import { DayCard } from "./day-card"

type MapSidebarProps = {
  trip: Trip
  selectedDayId: string | null
  onDaySelect: (dayId: string | null) => void
}

export function MapSidebar({
  trip,
  selectedDayId,
  onDaySelect,
}: MapSidebarProps) {
  return (
    <div className="h-full w-96 shrink-0 bg-white border-r shadow-xl">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="shrink-0 border-b p-6">
          
          <Button
            variant={selectedDayId === null ? "default" : "outline"}
            className="mt-4"
            onClick={() => onDaySelect(null)}
          >
            <MapPin className="mr-2 h-4 w-4" />
            View All Days
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {trip.days.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                isSelected={selectedDayId === day.id}
                onClick={() => onDaySelect(day.id)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
