/**
 * Checklist Type Definitions
 * All types for checklist-related features
 */

// ============================================================================
// Base Types
// ============================================================================

export type BaseEntity = {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type ChecklistType = "PACKING" | "DOCUMENT" | "FOOD" | "EQUIPMENT" | "BABY" | "OTHER"

export type PagedResult<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================================================
// Checklist Template Types
// ============================================================================

export type ChecklistTemplate = BaseEntity & {
  name: string
  type: ChecklistType
  items?: ChecklistTemplateItem[]
}

export type ChecklistTemplateItem = BaseEntity & {
  name: string
  orderIndex: number
  checklistTemplate?: ChecklistTemplate
}

export type CreateChecklistTemplatePayload = {
  name: string
  type: ChecklistType
}

export type UpdateChecklistTemplatePayload = Partial<CreateChecklistTemplatePayload>

export type CreateChecklistTemplateItemPayload = {
  name: string
  orderIndex: number
  checklistTemplateId: string
}

export type UpdateChecklistTemplateItemPayload = Partial<CreateChecklistTemplateItemPayload>

export type ReorderTemplateItemsPayload = {
  checklistTemplateId: string
  itemIds: string[]
}

// ============================================================================
// Checklist User Types
// ============================================================================

export type ChecklistUser = BaseEntity & {
  name: string
  user?: { id: string; [key: string]: any }
  template?: ChecklistTemplate
  items?: ChecklistUserItem[]
}

export type ChecklistUserItem = BaseEntity & {
  name: string
  orderIndex: number
  checklistUser?: ChecklistUser
}

export type CreateChecklistUserPayload = {
  name: string
  userId: string
  templateId?: string
}

export type CopyFromTemplatePayload = {
  userId: string
  templateId: string
}

export type UpdateChecklistUserPayload = Partial<CreateChecklistUserPayload>

export type CreateChecklistUserItemPayload = {
  name: string
  orderIndex: number
  checklistUserId: string
}

export type UpdateChecklistUserItemPayload = Partial<CreateChecklistUserItemPayload>

export type ReorderUserItemsPayload = {
  checklistUserId: string
  itemIds: string[]
}

// ============================================================================
// Checklist Trip Types
// ============================================================================

export type ChecklistTrip = BaseEntity & {
  name: string
  trip?: { id: string; [key: string]: any }
  checklistUser?: ChecklistUser
  items?: ChecklistTripItem[]
}

export type ChecklistTripItem = BaseEntity & {
  name: string
  orderIndex: number
  isChecked: boolean
  checkedAt: string | null
  checklistTrip?: ChecklistTrip
  checkedBy?: { id: string; [key: string]: any }
}

export type CreateChecklistTripPayload = {
  name: string
  tripId: string
  checklistUserId?: string
}

export type CopyFromUserChecklistPayload = {
  tripId: string
  checklistUserId: string
}

export type UpdateChecklistTripPayload = Partial<CreateChecklistTripPayload>

export type CreateChecklistTripItemPayload = {
  name: string
  orderIndex: number
  checklistTripId: string
}

export type UpdateChecklistTripItemPayload = Partial<CreateChecklistTripItemPayload>

export type ToggleTripItemPayload = {
  userId: string
}

export type BulkCheckTripItemsPayload = {
  itemIds: string[]
  userId: string
}

export type ReorderTripItemsPayload = {
  checklistTripId: string
  itemIds: string[]
}
