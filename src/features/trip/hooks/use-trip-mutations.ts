/**
 * Custom hooks for trip mutations
 * Centralized API logic for adding, updating, and deleting trip items
 */

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTripItem, updateTripItem, deleteTripItem } from "@/services/trips"
import type { CreateTripItemPayload, UpdateTripItemPayload } from "@/types/trip"
import type { PlaceResult } from "@/features/maps/types"
import { TripItemType } from "@/features/trip/enums/trip-item-type"

/**
 * Hook to add a place to a specific trip day
 * Includes optimistic updates for better UX
 */
export function useAddPlaceToDay(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      dayId,
      place,
    }: {
      dayId: string
      place: PlaceResult
    }) => {
      const payload: CreateTripItemPayload = {
        tripDayId: dayId,
        type: TripItemType.PLACE,
        name: place.name,
        placeId: place.placeId,
        placeName: place.name,
        address: place.formattedAddress,
        location: place.location,
        order: 0, // Will be set by backend
        isCompleted: false,
      }
      
      return createTripItem(payload)
    },
    onMutate: async ({ dayId, place }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] })

      // Snapshot the previous value
      const previousTrip = queryClient.getQueryData(["trip", tripId])

      // Optimistically update to the new value
      queryClient.setQueryData(["trip", tripId], (old: any) => {
        if (!old) return old

        return {
          ...old,
          days: old.days.map((day: any) =>
            day.id === dayId
              ? {
                  ...day,
                  items: [
                    ...day.items,
                    {
                      id: `temp-${Date.now()}`,
                      tripDayId: dayId,
                      type: TripItemType.PLACE,
                      name: place.name,
                      placeId: place.placeId,
                      placeName: place.name,
                      address: place.formattedAddress,
                      location: place.location,
                      order: day.items.length,
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

      const previousTrip = queryClient.getQueryData(["trip", tripId])

      // Optimistically remove item
      queryClient.setQueryData(["trip", tripId], (old: any) => {
        if (!old) return old

        return {
          ...old,
          days: old.days.map((day: any) => ({
            ...day,
            items: day.items.filter((item: any) => item.id !== itemId),
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

      const previousTrip = queryClient.getQueryData(["trip", tripId])

      // Optimistically update item
      queryClient.setQueryData(["trip", tripId], (old: any) => {
        if (!old) return old

        return {
          ...old,
          days: old.days.map((day: any) => ({
            ...day,
            items: day.items.map((item: any) =>
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

