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

// Trip Item (Place, Activity, etc.) - matching backend TripItemDetailDto
export type TripItem = {
  id: string
  type: TripItemType
  customName?: string | null
  name: string // Actual place name from snapshot
  cost?: number | null
  durationMinutes?: number | null
  startTime?: string | null
  endTime?: string | null
  address?: string | null
  googlePlaceId?: string | null
  lat?: number | null
  lng?: number | null
  maxDurationMinutes?: number | null
  minDurationMinutes?: number | null
  phone?: string | null
  standardOpeningHours?: string | null
  standardClosingHours?: string | null
  orderIndex: number
  note?: string | null
  
  // Computed fields for backward compatibility
  location?: {
    lat: number
    lng: number
  }
  order?: number
  placeId?: string
  placeName?: string
  description?: string
  isCompleted?: boolean
  createdAt?: string
  updatedAt?: string
}

// Trip Day - matching backend TripDayDetailDto
export type TripDay = {
  id: string
  dayIndex: number
  date: string // YYYY-MM-DD
  note?: string | null
  items: TripItem[]
  
  // Computed fields for backward compatibility
  tripId?: string
  title?: string
  description?: string
  totalEstimatedCost?: number
  totalActualCost?: number
  totalDuration?: number // minutes
  createdAt?: string
  updatedAt?: string
}

// Trip - matching backend TripDetailDto
export type Trip = {
  id: string
  name: string
  description?: string
  coverImage?: string | null
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  status: TripStatus
  budget: number
  members: TripMember[]
  days: TripDay[]
  totalEstimatedCost: number
  totalActualCost: number
  totalDays: number
  createdBy?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type CreateTripPayload = {
  name: string
  description?: string
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
  type: TripItemType
  tripDayId: string
  orderIndex: number
  snapshot: Record<string, unknown>
  googlePlaceId?: string
  lat?: number
  lng?: number
  startTime?: string
  endTime?: string
  cost?: number
  note?: string
  durationMinutes?: number
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

// API Response Types
export type TripsListResponse = {
  data: Trip[]
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
