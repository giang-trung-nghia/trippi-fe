/**
 * Checklist Services
 * API calls for checklist management
 */

import { httpClient } from "@/configs/axios"
import type {
  ChecklistTemplate,
  ChecklistTemplateItem,
  ChecklistUser,
  ChecklistUserItem,
  ChecklistTrip,
  ChecklistTripItem,
  CreateChecklistTemplatePayload,
  UpdateChecklistTemplatePayload,
  CreateChecklistTemplateItemPayload,
  UpdateChecklistTemplateItemPayload,
  ReorderTemplateItemsPayload,
  CreateChecklistUserPayload,
  CopyFromTemplatePayload,
  UpdateChecklistUserPayload,
  CreateChecklistUserItemPayload,
  UpdateChecklistUserItemPayload,
  ReorderUserItemsPayload,
  CreateChecklistTripPayload,
  CopyFromUserChecklistPayload,
  UpdateChecklistTripPayload,
  CreateChecklistTripItemPayload,
  UpdateChecklistTripItemPayload,
  ToggleTripItemPayload,
  BulkCheckTripItemsPayload,
  ReorderTripItemsPayload,
  PagedResult,
  ChecklistType,
} from "@/types/checklist"

// ============================================================================
// Checklist Templates
// ============================================================================

export const getChecklistTemplates = async (type?: ChecklistType): Promise<ChecklistTemplate[]> => {
  const response = await httpClient.get<ChecklistTemplate[]>("/checklist-templates", {
    params: type ? { type } : undefined
  })
  return response.data
}

export const getChecklistTemplatesPaged = async (
  page: number = 1,
  limit: number = 10
): Promise<PagedResult<ChecklistTemplate>> => {
  const response = await httpClient.get<PagedResult<ChecklistTemplate>>(
    "/checklist-templates/paged",
    { params: { page, limit } }
  )
  return response.data
}

export const getChecklistTemplatesByType = async (
  type: ChecklistType
): Promise<ChecklistTemplate[]> => {
  const response = await httpClient.get<ChecklistTemplate[]>(
    `/checklist-templates/by-type/${type}`
  )
  return response.data
}

export const getChecklistTemplateById = async (
  id: string
): Promise<ChecklistTemplate> => {
  const response = await httpClient.get<ChecklistTemplate>(
    `/checklist-templates/${id}`
  )
  return response.data
}

export const createChecklistTemplate = async (
  payload: CreateChecklistTemplatePayload
): Promise<ChecklistTemplate> => {
  const response = await httpClient.post<ChecklistTemplate>(
    "/checklist-templates",
    payload
  )
  return response.data
}

export const updateChecklistTemplate = async (
  id: string,
  payload: UpdateChecklistTemplatePayload
): Promise<ChecklistTemplate> => {
  const response = await httpClient.put<ChecklistTemplate>(
    `/checklist-templates/${id}`,
    payload
  )
  return response.data
}

export const deleteChecklistTemplate = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-templates/${id}`)
}

export const softDeleteChecklistTemplate = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-templates/${id}/soft`)
}

export const restoreChecklistTemplate = async (id: string): Promise<void> => {
  await httpClient.patch(`/checklist-templates/${id}/restore`)
}

// ============================================================================
// Checklist Template Items
// ============================================================================

export const getChecklistTemplateItems = async (): Promise<
  ChecklistTemplateItem[]
> => {
  const response = await httpClient.get<ChecklistTemplateItem[]>(
    "/checklist-template-items"
  )
  return response.data
}

export const getChecklistTemplateItemsPaged = async (
  page: number = 1,
  limit: number = 10
): Promise<PagedResult<ChecklistTemplateItem>> => {
  const response = await httpClient.get<PagedResult<ChecklistTemplateItem>>(
    "/checklist-template-items/paged",
    { params: { page, limit } }
  )
  return response.data
}

export const getChecklistTemplateItemById = async (
  id: string
): Promise<ChecklistTemplateItem> => {
  const response = await httpClient.get<ChecklistTemplateItem>(
    `/checklist-template-items/${id}`
  )
  return response.data
}

export const createChecklistTemplateItem = async (
  payload: CreateChecklistTemplateItemPayload
): Promise<ChecklistTemplateItem> => {
  const response = await httpClient.post<ChecklistTemplateItem>(
    "/checklist-template-items",
    payload
  )
  return response.data
}

export const reorderChecklistTemplateItems = async (
  payload: ReorderTemplateItemsPayload
): Promise<ChecklistTemplateItem[]> => {
  const response = await httpClient.post<ChecklistTemplateItem[]>(
    "/checklist-template-items/reorder",
    payload
  )
  return response.data
}

export const updateChecklistTemplateItem = async (
  id: string,
  payload: UpdateChecklistTemplateItemPayload
): Promise<ChecklistTemplateItem> => {
  const response = await httpClient.put<ChecklistTemplateItem>(
    `/checklist-template-items/${id}`,
    payload
  )
  return response.data
}

export const deleteChecklistTemplateItem = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-template-items/${id}`)
}

export const softDeleteChecklistTemplateItem = async (
  id: string
): Promise<void> => {
  await httpClient.delete(`/checklist-template-items/${id}/soft`)
}

export const restoreChecklistTemplateItem = async (
  id: string
): Promise<void> => {
  await httpClient.patch(`/checklist-template-items/${id}/restore`)
}

// ============================================================================
// Checklist Users (Personal Checklists)
// ============================================================================

export const getChecklistUsers = async (): Promise<ChecklistUser[]> => {
  const response = await httpClient.get<ChecklistUser[]>("/checklist-users")
  return response.data
}

export const getChecklistUsersPaged = async (
  page: number = 1,
  limit: number = 10
): Promise<PagedResult<ChecklistUser>> => {
  const response = await httpClient.get<PagedResult<ChecklistUser>>(
    "/checklist-users/paged",
    { params: { page, limit } }
  )
  return response.data
}

export const getChecklistUserById = async (id: string): Promise<ChecklistUser> => {
  const response = await httpClient.get<ChecklistUser>(`/checklist-users/${id}`)
  return response.data
}

export const createChecklistUser = async (
  payload: CreateChecklistUserPayload
): Promise<ChecklistUser> => {
  const response = await httpClient.post<ChecklistUser>(
    "/checklist-users",
    payload
  )
  return response.data
}

export const copyChecklistFromTemplate = async (
  payload: CopyFromTemplatePayload
): Promise<ChecklistUser> => {
  const response = await httpClient.post<ChecklistUser>(
    "/checklist-users/copy-from-template",
    payload
  )
  return response.data
}

export const updateChecklistUser = async (
  id: string,
  payload: UpdateChecklistUserPayload
): Promise<ChecklistUser> => {
  const response = await httpClient.put<ChecklistUser>(
    `/checklist-users/${id}`,
    payload
  )
  return response.data
}

export const deleteChecklistUser = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-users/${id}`)
}

export const softDeleteChecklistUser = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-users/${id}/soft`)
}

export const restoreChecklistUser = async (id: string): Promise<void> => {
  await httpClient.patch(`/checklist-users/${id}/restore`)
}

// ============================================================================
// Checklist User Items
// ============================================================================

export const getChecklistUserItems = async (): Promise<ChecklistUserItem[]> => {
  const response = await httpClient.get<ChecklistUserItem[]>(
    "/checklist-user-items"
  )
  return response.data
}

export const getChecklistUserItemsPaged = async (
  page: number = 1,
  limit: number = 10
): Promise<PagedResult<ChecklistUserItem>> => {
  const response = await httpClient.get<PagedResult<ChecklistUserItem>>(
    "/checklist-user-items/paged",
    { params: { page, limit } }
  )
  return response.data
}

export const getChecklistUserItemById = async (
  id: string
): Promise<ChecklistUserItem> => {
  const response = await httpClient.get<ChecklistUserItem>(
    `/checklist-user-items/${id}`
  )
  return response.data
}

export const createChecklistUserItem = async (
  payload: CreateChecklistUserItemPayload
): Promise<ChecklistUserItem> => {
  const response = await httpClient.post<ChecklistUserItem>(
    "/checklist-user-items",
    payload
  )
  return response.data
}

export const reorderChecklistUserItems = async (
  payload: ReorderUserItemsPayload
): Promise<ChecklistUserItem[]> => {
  const response = await httpClient.post<ChecklistUserItem[]>(
    "/checklist-user-items/reorder",
    payload
  )
  return response.data
}

export const updateChecklistUserItem = async (
  id: string,
  payload: UpdateChecklistUserItemPayload
): Promise<ChecklistUserItem> => {
  const response = await httpClient.put<ChecklistUserItem>(
    `/checklist-user-items/${id}`,
    payload
  )
  return response.data
}

export const deleteChecklistUserItem = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-user-items/${id}`)
}

export const softDeleteChecklistUserItem = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-user-items/${id}/soft`)
}

export const restoreChecklistUserItem = async (id: string): Promise<void> => {
  await httpClient.patch(`/checklist-user-items/${id}/restore`)
}

// ============================================================================
// Checklist Trips (Trip-specific Checklists)
// ============================================================================

export const getChecklistTrips = async (): Promise<ChecklistTrip[]> => {
  const response = await httpClient.get<ChecklistTrip[]>("/checklist-trips")
  return response.data
}

export const getChecklistTripsByTripId = async (
  tripId: string,
  includeItems = false
): Promise<ChecklistTrip[]> => {
  const response = await httpClient.get<ChecklistTrip[]>("/checklist-trips", {
    params: { tripId, includeItems }
  })
  
  // Client-side filter as fallback in case backend doesn't support the param
  const data = response.data
  return data
}

export const getChecklistTripsPaged = async (
  page: number = 1,
  limit: number = 10
): Promise<PagedResult<ChecklistTrip>> => {
  const response = await httpClient.get<PagedResult<ChecklistTrip>>(
    "/checklist-trips/paged",
    { params: { page, limit } }
  )
  return response.data
}

export const getChecklistTripById = async (id: string): Promise<ChecklistTrip> => {
  const response = await httpClient.get<ChecklistTrip>(`/checklist-trips/${id}`)
  return response.data
}

export const createChecklistTrip = async (
  payload: CreateChecklistTripPayload
): Promise<ChecklistTrip> => {
  const response = await httpClient.post<ChecklistTrip>(
    "/checklist-trips",
    payload
  )
  return response.data
}

export const copyChecklistFromUserChecklist = async (
  payload: CopyFromUserChecklistPayload
): Promise<ChecklistTrip> => {
  const response = await httpClient.post<ChecklistTrip>(
    "/checklist-trips/copy-from-user-checklist",
    payload
  )
  return response.data
}

export const copyChecklistFromTemplateToTrip = async (
  payload: { tripId: string; templateId: string }
): Promise<ChecklistTrip> => {
  const response = await httpClient.post<ChecklistTrip>(
    "/checklist-trips/copy-from-template",
    payload
  )
  return response.data
}

export const updateChecklistTrip = async (
  id: string,
  payload: UpdateChecklistTripPayload
): Promise<ChecklistTrip> => {
  const response = await httpClient.put<ChecklistTrip>(
    `/checklist-trips/${id}`,
    payload
  )
  return response.data
}

export const deleteChecklistTrip = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-trips/${id}`)
}

export const softDeleteChecklistTrip = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-trips/${id}/soft`)
}

export const restoreChecklistTrip = async (id: string): Promise<void> => {
  await httpClient.patch(`/checklist-trips/${id}/restore`)
}

// ============================================================================
// Checklist Trip Items
// ============================================================================

export const getChecklistTripItems = async (): Promise<ChecklistTripItem[]> => {
  const response = await httpClient.get<ChecklistTripItem[]>(
    "/checklist-trip-items"
  )
  return response.data
}

export const getChecklistTripItemsPaged = async (
  page: number = 1,
  limit: number = 10
): Promise<PagedResult<ChecklistTripItem>> => {
  const response = await httpClient.get<PagedResult<ChecklistTripItem>>(
    "/checklist-trip-items/paged",
    { params: { page, limit } }
  )
  return response.data
}

export const getChecklistTripItemById = async (
  id: string
): Promise<ChecklistTripItem> => {
  const response = await httpClient.get<ChecklistTripItem>(
    `/checklist-trip-items/${id}`
  )
  return response.data
}

export const createChecklistTripItem = async (
  payload: CreateChecklistTripItemPayload
): Promise<ChecklistTripItem> => {
  const response = await httpClient.post<ChecklistTripItem>(
    "/checklist-trip-items",
    payload
  )
  return response.data
}

export const toggleChecklistTripItem = async (
  id: string,
  payload: ToggleTripItemPayload
): Promise<ChecklistTripItem> => {
  const response = await httpClient.post<ChecklistTripItem>(
    `/checklist-trip-items/${id}/toggle`,
    payload
  )
  return response.data
}

export const bulkCheckTripItems = async (
  payload: BulkCheckTripItemsPayload
): Promise<ChecklistTripItem[]> => {
  const response = await httpClient.post<ChecklistTripItem[]>(
    "/checklist-trip-items/bulk-check",
    payload
  )
  return response.data
}

export const reorderChecklistTripItems = async (
  payload: ReorderTripItemsPayload
): Promise<ChecklistTripItem[]> => {
  const response = await httpClient.post<ChecklistTripItem[]>(
    "/checklist-trip-items/reorder",
    payload
  )
  return response.data
}

export const updateChecklistTripItem = async (
  id: string,
  payload: UpdateChecklistTripItemPayload
): Promise<ChecklistTripItem> => {
  const response = await httpClient.put<ChecklistTripItem>(
    `/checklist-trip-items/${id}`,
    payload
  )
  return response.data
}

export const deleteChecklistTripItem = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-trip-items/${id}`)
}

export const softDeleteChecklistTripItem = async (id: string): Promise<void> => {
  await httpClient.delete(`/checklist-trip-items/${id}/soft`)
}

export const restoreChecklistTripItem = async (id: string): Promise<void> => {
  await httpClient.patch(`/checklist-trip-items/${id}/restore`)
}
