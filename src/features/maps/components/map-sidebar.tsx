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
          <h1 className="text-2xl font-bold text-gray-900">{trip.name}</h1>
          {trip.destination && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{trip.destination}</span>
            </div>
          )}
          {trip.startDate && trip.endDate && (
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(trip.startDate), "MMM d")} -{" "}
                {format(new Date(trip.endDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{trip.days.reduce(
                  (acc, day) =>
                    acc +
                    day.items.filter((item) => item.location).length,
                  0
                )} places</span>
            </div>
            {trip.days.reduce((acc, day) => acc + (day.totalDuration ?? 0), 0) > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{Math.floor(trip.days.reduce((acc, day) => acc + (day.totalDuration ?? 0), 0) / 60)}h</span>
              </div>
            )}
            {trip.totalEstimatedCost && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>${trip.totalEstimatedCost}</span>
              </div>
            )}
          </div>
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
