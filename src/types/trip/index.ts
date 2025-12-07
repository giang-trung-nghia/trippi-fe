/**
 * Trip Types
 * Core domain models for trip planning
 */

import { TripItemType } from '@/features/trip/enums/trip-item-type'
import { TripStatus } from '@/features/trip/enums/trip-status'
import { MemberRole } from '@/features/trip/enums/member-role'

// Re-export enums for convenience
export { TripItemType, TripStatus, MemberRole }

// Trip Member
export type TripMember = {
  id: string
  tripId: string
  userId: string
  role: MemberRole
  user: {
    id: string
    name: string
    email: string
    avatarUrl?: string
  }
  joinedAt: string
  createdAt: string
  updatedAt: string
}

// Trip Item (Place, Activity, etc.)
export type TripItem = {
  id: string
  tripDayId: string
  type: TripItemType
  name: string
  description?: string
  notes?: string
  
  // Location (for PLACE, MEAL, HOTEL, ACTIVITY)
  placeId?: string // Google Place ID
  placeName?: string
  address?: string
  location?: {
    lat: number
    lng: number
  }
  
  // Time
  startTime?: string // HH:mm format
  endTime?: string // HH:mm format
  duration?: number // minutes
  
  // Cost
  estimatedCost?: number
  actualCost?: number
  currency?: string
  
  // Metadata
  order: number
  isCompleted: boolean
  
  createdAt: string
  updatedAt: string
}

export type TripDay = {
  id: string
  tripId: string
  dayIndex: number
  date: string // YYYY-MM-DD
  title?: string
  description?: string
  
  items: TripItem[]
  
  // Calculated fields
  totalEstimatedCost?: number
  totalActualCost?: number
  totalDuration?: number // minutes
  
  createdAt: string
  updatedAt: string
}

export type Trip = {
  id: string
  name: string
  description?: string
  destination?: string
  coverImage?: string
  
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  status: TripStatus
  members: TripMember[]
  days: TripDay[]
  budget?: number
  totalEstimatedCost?: number
  totalActualCost?: number
  totalDays?: number
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export type CreateTripPayload = {
  name: string
  description?: string
  destination?: string
  startDate: string
  endDate: string
  budget?: number
  inviteEmails?: string[] // Invite members by email
}

export type UpdateTripPayload = Partial<CreateTripPayload> & {
  status?: TripStatus
}

export type CreateTripDayPayload = {
  tripId: string
  dayNumber: number
  date: string
  title?: string
  description?: string
}

export type UpdateTripDayPayload = Partial<Omit<CreateTripDayPayload, 'tripId'>>

export type CreateTripItemPayload = {
  tripDayId: string
  type: TripItemType
  name: string
  description?: string
  notes?: string
  placeId?: string
  placeName?: string
  address?: string
  location?: {
    lat: number
    lng: number
  }
  startTime?: string
  endTime?: string
  duration?: number
  estimatedCost?: number
  currency?: string
  order: number
}

export type UpdateTripItemPayload = Partial<Omit<CreateTripItemPayload, 'tripDayId'>>

export type InviteMemberPayload = {
  tripId: string
  email: string
  role?: MemberRole
}

export type UpdateMemberRolePayload = {
  role: MemberRole
}

export type TripsListResponse = {
  trips: Trip[]
  total: number
  page: number
  limit: number
}

export type TripDetailResponse = Trip

export type DraggableItem = {
  id: string
  type: 'day' | 'item'
  data: TripDay | TripItem
}

export type ReorderDaysPayload = {
  tripId: string
  dayIds: string[] // Ordered array of day IDs
}

export type ReorderItemsPayload = {
  tripDayId: string
  itemIds: string[] // Ordered array of item IDs
}

export type MoveItemPayload = {
  itemId: string
  targetDayId: string
  targetOrder: number
}
