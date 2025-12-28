/**
 * Custom hooks for trip mutations
 * Centralized API logic for adding, updating, and deleting trip items
 */

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTripItem, updateTripItem, deleteTripItem } from "@/services/trips"
import type { UpdateTripItemPayload, Trip, CreateTripItemPayload } from "@/types/trip"
import type { PlaceResult } from "@/features/maps/types"
import { TripItemType } from "@/features/trip/enums/trip-item-type"

/**
 * Hook to add a trip item (place, activity, etc.) to a specific trip day
 * Includes optimistic updates for better UX
 */
export function useAddTripItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      dayId,
      place,
      type = TripItemType.PLACE,
      orderIndex,
    }: {
      dayId: string
      place: PlaceResult
      type?: TripItemType
      orderIndex?: number
    }) => {
      // Build the payload matching backend DTO
      const payload: CreateTripItemPayload = {
        type,
        tripDayId: dayId,
        orderIndex: orderIndex ?? 0,
        snapshot: {
          name: place.name,
          placeId: place.placeId,
          placeName: place.name,
          address: place.formattedAddress,
          location: place.location,
          types: place.types,
        },
        googlePlaceId: place.placeId,
        lat: place.location.lat,
        lng: place.location.lng,
      }
      
      return createTripItem(payload)
    },
    onMutate: async ({ dayId, place, orderIndex }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] })

      // Snapshot the previous value
      const previousTrip = queryClient.getQueryData<Trip>(["trip", tripId])

      // Optimistically update to the new value
      queryClient.setQueryData<Trip>(["trip", tripId], (old) => {
        if (!old) return old

        return {
          ...old,
          days: old.days.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  items: [
                    ...day.items,
                    {
                      id: `temp-${Date.now()}`,
                      type: TripItemType.PLACE,
                      name: place.name,
                      customName: null,
                      address: place.formattedAddress,
                      googlePlaceId: place.placeId,
                      lat: place.location.lat,
                      lng: place.location.lng,
                      orderIndex: orderIndex ?? day.items.length,
                      cost: null,
                      durationMinutes: null,
                      startTime: null,
                      endTime: null,
                      note: null,
                      phone: null,
                      standardOpeningHours: null,
                      standardClosingHours: null,
                      maxDurationMinutes: null,
                      minDurationMinutes: null,
                      // Computed fields for backward compatibility
                      location: place.location,
                      order: orderIndex ?? day.items.length,
                      placeId: place.placeId,
                      placeName: place.name,
                      description: undefined,
                      isCompleted: false,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    },
                  ],
                }
              : day
          ),
        }
      })

      // Return context with snapshot
      return { previousTrip }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTrip) {
        queryClient.setQueryData(["trip", tripId], context.previousTrip)
      }
      console.error("Failed to add place:", err)
    },
    onSuccess: () => {
      // Refetch to get the actual data from server
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
    },
  })
}

/**
 * Hook to remove a trip item
 */
export function useRemoveTripItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (itemId: string) => {
      return deleteTripItem(itemId)
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] })

      const previousTrip = queryClient.getQueryData<Trip>(["trip", tripId])

      // Optimistically remove item
      queryClient.setQueryData<Trip>(["trip", tripId], (old) => {
        if (!old) return old

        return {
          ...old,
          days: old.days.map((day) => ({
            ...day,
            items: day.items.filter((item) => item.id !== itemId),
          })),
        }
      })

      return { previousTrip }
    },
    onError: (err, variables, context) => {
      if (context?.previousTrip) {
        queryClient.setQueryData(["trip", tripId], context.previousTrip)
      }
      console.error("Failed to remove item:", err)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
    },
  })
}

/**
 * Hook to update a trip item
 */
export function useUpdateTripItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      itemId,
      updates,
    }: {
      itemId: string
      updates: UpdateTripItemPayload
    }) => {
      return updateTripItem(itemId, updates)
    },
    onMutate: async ({ itemId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] })

      const previousTrip = queryClient.getQueryData<Trip>(["trip", tripId])

      // Optimistically update item
      queryClient.setQueryData<Trip>(["trip", tripId], (old) => {
        if (!old) return old

        return {
          ...old,
          days: old.days.map((day) => ({
            ...day,
            items: day.items.map((item) =>
              item.id === itemId
                ? { ...item, ...updates, updatedAt: new Date().toISOString() }
                : item
            ),
          })),
        }
      })

      return { previousTrip }
    },
    onError: (err, variables, context) => {
      if (context?.previousTrip) {
        queryClient.setQueryData(["trip", tripId], context.previousTrip)
      }
      console.error("Failed to update item:", err)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
    },
  })
}

