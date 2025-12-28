"use client"

import { useState, useEffect, useMemo } from "react"
import { X, MapPin, Phone, Clock, Star, DollarSign, Minimize2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PlaceResult } from "@/features/maps/types"
import type { TripDay } from "@/types/trip"

type PlaceDetailsBottomPanelProps = {
  place: PlaceResult
  selectedDay?: TripDay | null
  onClose: () => void
  onAddToTrip: (data: {
    place: PlaceResult
    startTime?: string
    endTime?: string
    cost?: number
  }) => void
}

export function PlaceDetailsBottomPanel({
  place,
  selectedDay,
  onClose,
  onAddToTrip,
}: PlaceDetailsBottomPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [cost, setCost] = useState("")

  // Auto-prefill start time based on last item's end time
  useEffect(() => {
    if (selectedDay && selectedDay.items.length > 0) {
      const lastItem = selectedDay.items[selectedDay.items.length - 1]
      if (lastItem.endTime) {
        setStartTime(lastItem.endTime)
      }
    }
  }, [selectedDay])

  const handleAddToTrip = () => {
    onAddToTrip({
      place,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      cost: cost ? parseFloat(cost) : undefined,
    })
  }

  // Extract rating if available
  const rating = (place as any).rating
  const userRatingsTotal = (place as any).userRatingsTotal
  const phoneNumber = (place as any).phoneNumber
  const website = (place as any).website
  const estimatedDuration = (place as any).estimatedDuration || "30 min"

  // Minimized view
  if (isMinimized) {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-auto z-30 bg-white border shadow-xl rounded-full animate-in slide-in-from-bottom-4 duration-300 px-4 py-2">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900 max-w-xs truncate">
            {place.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddToTrip}
            disabled={!selectedDay}
            className="h-7 w-7 shrink-0"
            title="Quick add to trip"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(false)}
            className="h-7 w-7 shrink-0"
            title="Expand"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[60%] h-[40vh] z-30 bg-white border shadow-xl rounded-xl animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
      {/* 2-Column Layout */}
      <div className="h-full flex">
        {/* LEFT COLUMN - Place Info with Tabs */}
        <div className="w-1/2 border-r flex flex-col">
          {/* Place Name & Rating */}
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {place.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{rating}</span>
                  {userRatingsTotal && (
                    <span className="text-xs text-gray-500">({userRatingsTotal})</span>
                  )}
                </div>
              )}
              {place.types && place.types.length > 0 && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {place.types[0].replace(/_/g, " ")}
                </Badge>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="about" className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-3 h-9 shrink-0">
              <TabsTrigger 
                value="about" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-3 text-xs"
              >
                About
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                disabled 
                className="rounded-none text-gray-400 px-3 text-xs"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger 
                value="photos" 
                disabled 
                className="rounded-none text-gray-400 px-3 text-xs"
              >
                Photos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="px-3 py-2 space-y-2 overflow-y-auto flex-1 m-0">
              {/* Address */}
              {place.formattedAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-xs text-gray-900 leading-relaxed">
                      {place.formattedAddress}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {phoneNumber && (
                <div className="flex items-start gap-2">
                  <Phone className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Phone</p>
                    <a
                      href={`tel:${phoneNumber}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {phoneNumber}
                    </a>
                  </div>
                </div>
              )}

              {/* Duration */}
              <div className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Typical visit</p>
                  <p className="text-xs text-gray-900">
                    People spend {estimatedDuration} here
                  </p>
                </div>
              </div>

              {/* Website */}
              {website && (
                <div className="flex items-start gap-2">
                  <div className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0 text-xs">🌐</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Website</p>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate block"
                    >
                      {website}
                    </a>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN - Add to Trip Form */}
        <div className="w-1/2 flex flex-col">
          {/* Header with Minimize & Close Button */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-900">
              Add to {selectedDay ? `Day ${selectedDay.dayIndex}` : "Trip"}
            </h4>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 shrink-0"
                title="Minimize"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-6 w-6 shrink-0"
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {/* Start Time */}
              <div className="space-y-1">
                <Label htmlFor="startTime" className="text-xs font-medium">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-8 text-xs [&::-webkit-calendar-picker-indicator]:hidden"
                  step="300"
                />
              </div>

              {/* End Time */}
              <div className="space-y-1">
                <Label htmlFor="endTime" className="text-xs font-medium">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full h-8 text-xs [&::-webkit-calendar-picker-indicator]:hidden"
                  step="300"
                />
              </div>
            </div>

            {/* Estimated Cost */}
            <div className="space-y-1">
              <Label htmlFor="cost" className="text-xs font-medium">
                Estimated Cost (optional)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="pl-6 h-8 text-xs"
                />
              </div>
            </div>

            {/* Add Button */}
            <Button
              onClick={handleAddToTrip}
              className="w-full"
              size="sm"
              disabled={!selectedDay}
            >
              {selectedDay
                ? `Add to Day ${selectedDay.dayIndex}`
                : "Select a day first"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

