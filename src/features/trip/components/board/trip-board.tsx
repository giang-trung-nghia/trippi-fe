'use client'

import { useState, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { Trip, TripDay } from "@/types/trip"
import { TripDayColumn } from "./trip-day-column"
import { TripItemCard } from "./trip-item-card"
import { moveTripItem, reorderTripItems, toggleItemComplete } from "@/services/trips"

type TripBoardProps = {
  trip: Trip
  onEditItem?: () => void
  onAddItem?: (dayId: string) => void
}

export function TripBoard({ trip, onEditItem, onAddItem }: TripBoardProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [days, setDays] = useState<TripDay[]>(trip.days)
  const [mounted, setMounted] = useState(false)
  const queryClient = useQueryClient()

  // Prevent hydration mismatch by only rendering drag-and-drop on client
  // This pattern is necessary to ensure client-only rendering for DnD components
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync days when trip.days changes (after mutations)
  // This is necessary to sync external data changes to local state used for optimistic updates
  useEffect(() => {
    setDays(trip.days)
  }, [trip.days])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Mutations
  const toggleCompleteMutation = useMutation({
    mutationFn: toggleItemComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", trip.id] })
    },
  })

  const reorderItemsMutation = useMutation({
    mutationFn: reorderTripItems,
  })

  const moveItemMutation = useMutation({
    mutationFn: moveTripItem,
  })

  // Find active dragging item for overlay
  const activeItem = activeDragId
    ? days.flatMap((day) => day.items).find((item) => item.id === activeDragId)
    : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find source and target days
    const activeDay = days.find((day) => day.items.some((item) => item.id === activeId))
    const overDay = days.find((day) => day.id === overId || day.items.some((item) => item.id === overId))

    if (!activeDay || !overDay) return

    const activeDayIndex = days.indexOf(activeDay)
    const overDayIndex = days.indexOf(overDay)

    const activeItemIndex = activeDay.items.findIndex((item) => item.id === activeId)
    const overItemIndex = overDay.items.findIndex((item) => item.id === overId)

    if (activeDayIndex === overDayIndex) {
      // Same day - reorder
      if (activeItemIndex !== overItemIndex) {
        setDays((prevDays) => {
          const newDays = [...prevDays]
          const day = { ...newDays[activeDayIndex] }
          day.items = arrayMove(day.items, activeItemIndex, overItemIndex >= 0 ? overItemIndex : day.items.length)
          newDays[activeDayIndex] = day
          return newDays
        })
      }
    } else {
      // Different day - move
      setDays((prevDays) => {
        const newDays = [...prevDays]
        
        // Remove from source
        const sourceDay = { ...newDays[activeDayIndex] }
        const [movedItem] = sourceDay.items.splice(activeItemIndex, 1)
        newDays[activeDayIndex] = sourceDay

        // Add to target
        const targetDay = { ...newDays[overDayIndex] }
        const targetIndex = overItemIndex >= 0 ? overItemIndex : targetDay.items.length
        targetDay.items.splice(targetIndex, 0, { ...movedItem, tripDayId: overDay.id })
        newDays[overDayIndex] = targetDay

        return newDays
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveDragId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find source and target days
    const activeDay = days.find((day) => day.items.some((item) => item.id === activeId))
    const overDay = days.find((day) => day.id === overId || day.items.some((item) => item.id === overId))

    if (!activeDay || !overDay) return

    if (activeDay.id === overDay.id) {
      // Same day - persist reorder
      const itemIds = activeDay.items.map((item) => item.id)
      reorderItemsMutation.mutate({
        tripDayId: activeDay.id,
        itemIds,
      })
    } else {
      // Different day - persist move
      const targetIndex = overDay.items.findIndex((item) => item.id === activeId)
      moveItemMutation.mutate({
        itemId: activeId,
        targetDayId: overDay.id,
        targetOrder: targetIndex,
      })
    }

    // Invalidate queries to refetch updated data
    queryClient.invalidateQueries({ queryKey: ["trip", trip.id] })
  }

  const handleToggleComplete = (itemId: string) => {
    toggleCompleteMutation.mutate(itemId)
  }

  // Prevent hydration mismatch - only render on client
  if (!mounted) {
    return (
      <div className="relative w-full border rounded-lg bg-card">
        <ScrollArea className="w-full">
          <div className="flex gap-4 p-4 min-h-[400px] items-center justify-center">
            <div className="text-center text-muted-foreground">
              Loading itinerary...
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="relative w-full border rounded-lg bg-card">
        <ScrollArea className="w-full">
          <div className="flex gap-4 p-4 min-h-[400px]">
            {days?.map((day) => (
              <TripDayColumn
                key={day.id}
                day={day}
                onToggleComplete={handleToggleComplete}
                onEditItem={onEditItem}
                onAddItem={onAddItem}
              />
            ))}
            
            {(!days || days.length === 0) && (
              <div className="flex items-center justify-center w-full text-muted-foreground">
                <p>No days planned yet. Start by adding items to your trip!</p>
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="w-80 opacity-80">
            <TripItemCard item={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

