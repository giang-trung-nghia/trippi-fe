"use client"

import { LayoutGrid, Map } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type TripViewType = "board" | "map"

type TripTabsProps = {
  currentView: TripViewType
  onViewChange: (view: TripViewType) => void
}

/**
 * Tab navigation for switching between board and map views
 */
export function TripTabs({ currentView, onViewChange }: TripTabsProps) {
  return (
    <Tabs
      value={currentView}
      onValueChange={(v) => onViewChange(v as TripViewType)}
    >
      <TabsList className="grid w-auto grid-cols-2">
        <TabsTrigger value="board" className="gap-2">
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">Board</span>
        </TabsTrigger>
        <TabsTrigger value="map" className="gap-2">
          <Map className="h-4 w-4" />
          <span className="hidden sm:inline">Map</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

