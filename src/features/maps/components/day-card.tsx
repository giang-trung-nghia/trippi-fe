"use client"

import { format } from "date-fns"
import { MapPin, Clock, DollarSign, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TripDay } from "@/types/trip"

type DayCardProps = {
  day: TripDay
  isSelected: boolean
  onClick: () => void
}

export function DayCard({ day, isSelected, onClick }: DayCardProps) {
  const itemsWithLocation = day.items.filter((item) => item.location)

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border-2 bg-white p-4 text-left transition-all hover:shadow-md",
        isSelected
          ? "border-blue-500 shadow-md"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-semibold",
                isSelected
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              )}
            >
              Day {day.dayIndex}
            </span>
            {day.date && (
              <span className="text-xs text-gray-500">
                {format(new Date(day.date), "MMM d")}
              </span>
            )}
          </div>

          {day.title && (
            <h3 className="mt-2 font-semibold text-gray-900">{day.title}</h3>
          )}

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{itemsWithLocation.length} places</span>
            </div>
            {day.totalDuration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{Math.floor(day.totalDuration / 60)}h</span>
              </div>
            )}
            {day.totalEstimatedCost && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>{day.totalEstimatedCost}</span>
              </div>
            )}
          </div>
        </div>

        <ChevronRight
          className={cn(
            "h-5 w-5 transition-transform",
            isSelected ? "rotate-90 text-blue-600" : "text-gray-400"
          )}
        />
      </div>

      {/* Items preview (when selected) */}
      {isSelected && itemsWithLocation.length > 0 && (
        <div className="mt-3 space-y-2 border-t pt-3">
          {itemsWithLocation.map((item, index) => (
            <div
              key={item.id}
              className="flex items-start gap-2 text-sm"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {item.name}
                </div>
                {item.startTime && (
                  <div className="text-xs text-gray-500">{item.startTime}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}

