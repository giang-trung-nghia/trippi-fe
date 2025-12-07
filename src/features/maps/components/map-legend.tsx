"use client"

import {
  Hotel,
  UtensilsCrossed,
  Compass,
  Bus,
  Landmark,
  MapPin,
} from "lucide-react"

export function MapLegend() {
  const legendItems = [
    { icon: Hotel, label: "Hotel", color: "#8b5cf6" },
    { icon: UtensilsCrossed, label: "Meal", color: "#f97316" },
    { icon: Bus, label: "Transport", color: "#06b6d4" },
    { icon: Compass, label: "Activity", color: "#10b981" },
    { icon: Landmark, label: "Place", color: "#3b82f6" },
    { icon: MapPin, label: "Other", color: "#6b7280" },
  ]

  return (
    <div className="absolute bottom-6 right-4 z-10 rounded-lg bg-white p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Legend</h3>
      <div className="space-y-2">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ backgroundColor: item.color }}
            >
              <item.icon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

