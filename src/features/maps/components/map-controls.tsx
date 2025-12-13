"use client"

import { Button } from "@/components/ui/button"
import {
  Route,
  Maximize2,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MapTypeControl } from "./map-type-control"
import type { MapTypeId, RouteStats } from "@/features/maps/types"

type MapControlsProps = {
  showRoutes: boolean
  showLegend: boolean
  mapType: MapTypeId
  onToggleRoutes: () => void
  onToggleLegend: () => void
  onMapTypeChange: (type: MapTypeId) => void
  onFitBounds: () => void
  markerCount: number
  routeStats?: RouteStats | null
}

export function MapControls({
  showRoutes,
  showLegend,
  mapType,
  onToggleRoutes,
  onToggleLegend,
  onMapTypeChange,
  onFitBounds,
  markerCount,
  routeStats,
}: MapControlsProps) {
  return (
    <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 items-end">
      {/* Route Toggle */}
      <div className="w-[120px] rounded-lg bg-white shadow-lg">
        <Button
          variant={showRoutes ? "default" : "ghost"}
          size="sm"
          onClick={onToggleRoutes}
          className={cn(
            "w-full justify-start gap-2 px-3",
            showRoutes && "bg-blue-600 hover:bg-blue-700"
          )}
          title="Toggle routes between locations"
        >
          <Route className="h-4 w-4 shrink-0" />
          <span className="text-xs">Routes</span>
        </Button>
      </div>

      {/* Legend Toggle */}
      <div className="w-[120px] rounded-lg bg-white shadow-lg">
        <Button
          variant={showLegend ? "default" : "ghost"}
          size="sm"
          onClick={onToggleLegend}
          className={cn(
            "w-full justify-start gap-2 px-3",
            showLegend && "bg-blue-600 hover:bg-blue-700"
          )}
          title="Toggle legend"
        >
          <Layers className="h-4 w-4 shrink-0" />
          <span className="text-xs">Legend</span>
        </Button>
      </div>

      {/* Map Type Control */}
      <MapTypeControl mapType={mapType} onMapTypeChange={onMapTypeChange} />

      {/* Fit Bounds */}
      {markerCount > 0 && (
        <div className="w-[120px] rounded-lg bg-white shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFitBounds}
            className="w-full justify-start gap-2 px-3"
            title="Fit all locations in view"
          >
            <Maximize2 className="h-4 w-4 shrink-0" />
            <span className="text-xs">Fit All</span>
          </Button>
        </div>
      )}

      {/* Info Panel */}
      <div className="rounded-lg bg-white p-3 shadow-lg">
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">Locations:</span>
            <span className="font-semibold text-gray-900">{markerCount}</span>
          </div>
          {routeStats && showRoutes && (
            <>
              <div
                key={`distance-${routeStats.distance}`}
                className="flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <span className="text-gray-600">Distance:</span>
                <span className="font-semibold text-blue-600 transition-all duration-500 ease-in-out">
                  {routeStats.distance}
                </span>
              </div>
              <div
                key={`duration-${routeStats.duration}`}
                className="flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-blue-600 transition-all duration-500 ease-in-out">
                  {routeStats.duration}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
