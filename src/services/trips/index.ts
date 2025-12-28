/**
 * Trip Services
 * API calls for trip management
 */

import { httpClient } from "@/configs/axios"
import type {
  Trip,
  TripsListResponse,
  CreateTripPayload,
  UpdateTripPayload,
  CreateTripDayPayload,
  UpdateTripDayPayload,
  CreateTripItemPayload,
  UpdateTripItemPayload,
  InviteMemberPayload,
  UpdateMemberRolePayload,
  TripDay,
  TripItem,
  TripMember,
  ReorderDaysPayload,
  ReorderItemsPayload,
  MoveItemPayload,
} from "@/types/trip"

// ============================================================================
// Trips
// ============================================================================

export const getTrips = async (params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<TripsListResponse> => {
  const response = await httpClient.get<TripsListResponse>("/trips", { params })
  return response.data
}

export const getRecentTrips = async (limit: number = 10): Promise<Trip[]> => {
  const response = await httpClient.get<Trip[]>("/trips", {
    params: {
      limit,
      orderBy: "updatedAt",
      order: "desc",
    },
  })
  return response.data
}

export const getTripById = async (id: string): Promise<Trip> => {
  const response = await httpClient.get<Trip>(`/trips/${id}`)
  
  // Transform response to ensure backward compatibility
  const trip = response.data
  
  // Add computed location field if lat/lng exist
  if (trip.days) {
    trip.days = trip.days.map(day => ({
      ...day,
      items: day.items.map(item => ({
        ...item,
        location: item.lat && item.lng ? { lat: item.lat, lng: item.lng } : undefined,
        order: item.orderIndex,
        placeId: item.googlePlaceId || undefined,
        placeName: item.name,
        description: item.note || undefined,
      }))
    }))
  }
  
  return trip
}

export const createTrip = async (payload: CreateTripPayload): Promise<Trip> => {
  const response = await httpClient.post<Trip>("/trips", payload)
  return response.data
}

export const updateTrip = async (
  id: string,
  payload: UpdateTripPayload
): Promise<Trip> => {
  const response = await httpClient.put<Trip>(`/trips/${id}`, payload)
  return response.data
}

export const deleteTrip = async (id: string): Promise<void> => {
  await httpClient.delete(`/trips/${id}`)
}

export const softDeleteTrip = async (id: string): Promise<void> => {
  await httpClient.delete(`/trips/${id}/soft`)
}

export const restoreTrip = async (id: string): Promise<Trip> => {
  const response = await httpClient.patch<Trip>(`/trips/${id}/restore`)
  return response.data
}

// ============================================================================
// Trip Days
// ============================================================================

export const getTripDays = async (tripId: string): Promise<TripDay[]> => {
  const response = await httpClient.get<{ days: TripDay[] }>("/trip-days", {
    params: { tripId },
  })
  return response.data.days
}

export const getTripDayById = async (id: string): Promise<TripDay> => {
  const response = await httpClient.get<TripDay>(`/trip-days/${id}`)
  return response.data
}

export const createTripDay = async (
  payload: CreateTripDayPayload
): Promise<TripDay> => {
  const response = await httpClient.post<TripDay>("/trip-days", payload)
  return response.data
}

export const updateTripDay = async (
  id: string,
  payload: UpdateTripDayPayload
): Promise<TripDay> => {
  const response = await httpClient.put<TripDay>(`/trip-days/${id}`, payload)
  return response.data
}

export const deleteTripDay = async (id: string): Promise<void> => {
  await httpClient.delete(`/trip-days/${id}`)
}

export const reorderTripDays = async (
  payload: ReorderDaysPayload
): Promise<void> => {
  await httpClient.post("/trip-days/reorder", payload)
}

// ============================================================================
// Trip Items
// ============================================================================

export const getTripItems = async (tripDayId: string): Promise<TripItem[]> => {
  const response = await httpClient.get<{ items: TripItem[] }>("/trip-items", {
    params: { tripDayId },
  })
  return response.data.items
}

export const getTripItemById = async (id: string): Promise<TripItem> => {
  const response = await httpClient.get<TripItem>(`/trip-items/${id}`)
  return response.data
}

export const createTripItem = async (
  payload: CreateTripItemPayload
): Promise<TripItem> => {
  const response = await httpClient.post<TripItem>("/trip-items", payload)
  return response.data
}

export const updateTripItem = async (
  id: string,
  payload: UpdateTripItemPayload
): Promise<TripItem> => {
  const response = await httpClient.put<TripItem>(`/trip-items/${id}`, payload)
  return response.data
}

export const deleteTripItem = async (id: string): Promise<void> => {
  await httpClient.delete(`/trip-items/${id}`)
}

export const reorderTripItems = async (
  payload: ReorderItemsPayload
): Promise<void> => {
  await httpClient.post("/trip-items/reorder", payload)
}

export const moveTripItem = async (payload: MoveItemPayload): Promise<void> => {
  await httpClient.post("/trip-items/move", payload)
}

export const toggleItemComplete = async (id: string): Promise<TripItem> => {
  const response = await httpClient.patch<TripItem>(
    `/trip-items/${id}/toggle-complete`
  )
  return response.data
}

// ============================================================================
// Trip Members
// ============================================================================

export const getTripMembers = async (tripId: string): Promise<TripMember[]> => {
  const response = await httpClient.get<{ members: TripMember[] }>(
    "/trip-members",
    {
      params: { tripId },
    }
  )
  return response.data.members
}

export const inviteMember = async (
  payload: InviteMemberPayload
): Promise<TripMember> => {
  const response = await httpClient.post<TripMember>("/trip-members", payload)
  return response.data
}

export const updateMemberRole = async (
  id: string,
  payload: UpdateMemberRolePayload
): Promise<TripMember> => {
  const response = await httpClient.put<TripMember>(
    `/trip-members/${id}`,
    payload
  )
  return response.data
}

export const removeMember = async (id: string): Promise<void> => {
  await httpClient.delete(`/trip-members/${id}`)
}

// ============================================================================
// Utility Functions
// ============================================================================

export const calculateTripDuration = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // Include both start and end date
}

export const generateTripDays = (
  startDate: string,
  endDate: string
): Array<{ dayNumber: number; date: string }> => {
  const days = []
  const start = new Date(startDate)
  const duration = calculateTripDuration(startDate, endDate)

  for (let i = 0; i < duration; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    days.push({
      dayNumber: i + 1,
      date: date.toISOString().split("T")[0],
    })
  }

  return days
}
