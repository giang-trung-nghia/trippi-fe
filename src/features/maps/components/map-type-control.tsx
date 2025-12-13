"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Layers2 } from "lucide-react"
import type { MapTypeId } from "@/features/maps/types"
import { MapType } from "@/features/maps/enums"

type MapTypeControlProps = {
  mapType: MapTypeId
  onMapTypeChange: (type: MapTypeId) => void
}

const mapTypeOptions = [
  { value: MapType.ROADMAP, label: "Roadmap" },
  { value: MapType.SATELLITE, label: "Satellite" },
  { value: MapType.HYBRID, label: "Hybrid" },
  { value: MapType.TERRAIN, label: "Terrain" },
] as const

export function MapTypeControl({
  mapType,
  onMapTypeChange,
}: MapTypeControlProps) {
  const currentLabel =
    mapTypeOptions.find((t) => t.value === mapType)?.label || "Roadmap"

  return (
    <div className="w-[120px] rounded-lg bg-white shadow-lg">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 px-3">
            <Layers2 className="h-4 w-4 shrink-0" />
            <span className="text-xs">{currentLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {mapTypeOptions.map((type) => (
            <DropdownMenuItem
              key={type.value}
              onClick={() => onMapTypeChange(type.value)}
              className={mapType === type.value ? "bg-blue-50" : ""}
            >
              {type.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
