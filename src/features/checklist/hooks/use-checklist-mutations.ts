/**
 * Custom hooks for checklist mutations
 * Centralized API logic for checklist management
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getChecklistTemplates,
  getChecklistTemplatesByType,
  getChecklistTemplateById,
  copyChecklistFromTemplate,
  getChecklistUsers,
  getChecklistUserById,
  createChecklistUser,
  deleteChecklistUser,
  getChecklistTrips,
  getChecklistTripsByTripId,
  getChecklistTripById,
  createChecklistTrip,
  copyChecklistFromUserChecklist,
  copyChecklistFromTemplateToTrip,
  updateChecklistTrip,
  deleteChecklistTrip,
  createChecklistTripItem,
  toggleChecklistTripItem,
  bulkCheckTripItems,
  updateChecklistTripItem,
  deleteChecklistTripItem,
  reorderChecklistTripItems,
} from "@/services/checklists"
import type {
  ChecklistType,
  CopyFromTemplatePayload,
  CreateChecklistUserPayload,
  CreateChecklistTripPayload,
  CopyFromUserChecklistPayload,
  UpdateChecklistTripPayload,
  CreateChecklistTripItemPayload,
  ToggleTripItemPayload,
  BulkCheckTripItemsPayload,
  UpdateChecklistTripItemPayload,
  ReorderTripItemsPayload,
} from "@/types/checklist"

// ============================================================================
// Checklist Templates (Read-only for users)
// ============================================================================

/**
 * Hook to fetch all checklist templates (with optional type filter)
 */
export function useChecklistTemplates(type?: ChecklistType) {
  return useQuery({
    queryKey: type ? ["checklistTemplates", "byType", type] : ["checklistTemplates"],
    queryFn: () => getChecklistTemplates(type),
  })
}

/**
 * Hook to fetch checklist templates by type
 */
export function useChecklistTemplatesByType(type: ChecklistType) {
  return useQuery({
    queryKey: ["checklistTemplates", "byType", type],
    queryFn: () => getChecklistTemplatesByType(type),
  })
}

/**
 * Hook to fetch a single checklist template by ID
 */
export function useChecklistTemplate(id: string) {
  return useQuery({
    queryKey: ["checklistTemplate", id],
    queryFn: () => getChecklistTemplateById(id),
    enabled: !!id,
  })
}

// ============================================================================
// Checklist Users (Personal Checklists)
// ============================================================================

/**
 * Hook to fetch user's personal checklists
 */
export function useChecklistUsers() {
  return useQuery({
    queryKey: ["checklistUsers"],
    queryFn: getChecklistUsers,
  })
}

/**
 * Hook to fetch a single user checklist by ID
 */
export function useChecklistUser(id: string) {
  return useQuery({
    queryKey: ["checklistUser", id],
    queryFn: () => getChecklistUserById(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a personal checklist
 */
export function useCreateChecklistUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateChecklistUserPayload) =>
      createChecklistUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistUsers"] })
    },
  })
}

/**
 * Hook to copy a template to user's personal checklist
 */
export function useCopyChecklistFromTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CopyFromTemplatePayload) =>
      copyChecklistFromTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistUsers"] })
    },
  })
}

/**
 * Hook to delete a personal checklist
 */
export function useDeleteChecklistUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteChecklistUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistUsers"] })
    },
  })
}

// ============================================================================
// Checklist Trips (Trip-specific Checklists)
// ============================================================================

/**
 * Hook to fetch all trip checklists (unfiltered)
 */
export function useChecklistTrips() {
  return useQuery({
    queryKey: ["checklistTrips"],
    queryFn: getChecklistTrips,
  })
}

/**
 * Hook to fetch checklist trips filtered by trip ID
 * Use this for the checklist sidebar when viewing a specific trip
 * @param tripId - The trip ID to filter by
 * @param includeItems - When true, fetches full item details for each checklist
 */
export function useChecklistTripsByTripId(tripId: string, includeItems = false) {
  return useQuery({
    queryKey: ["checklistTrips", "byTrip", tripId, includeItems],
    queryFn: () => getChecklistTripsByTripId(tripId, includeItems),
    enabled: !!tripId,
  })
}

/**
 * Hook to fetch a single trip checklist by ID
 */
export function useChecklistTrip(id: string) {
  return useQuery({
    queryKey: ["checklistTrip", id],
    queryFn: () => getChecklistTripById(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a trip checklist
 */
export function useCreateChecklistTrip(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateChecklistTripPayload) =>
      createChecklistTrip(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrips"] })
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
    },
  })
}

/**
 * Hook to copy a user checklist to a trip
 */
export function useCopyChecklistToTrip(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CopyFromUserChecklistPayload) =>
      copyChecklistFromUserChecklist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrips"] })
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
    },
  })
}

/**
 * Hook to copy a template directly to a trip
 */
export function useCopyTemplateToTrip(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { tripId: string; templateId: string }) =>
      copyChecklistFromTemplateToTrip(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrips"] })
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
    },
  })
}

/**
 * Hook to update a trip checklist
 */
export function useUpdateChecklistTrip(tripId: string, checklistId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateChecklistTripPayload) =>
      updateChecklistTrip(checklistId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrip", checklistId] })
      queryClient.invalidateQueries({ queryKey: ["checklistTrips"] })
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
    },
  })
}

/**
 * Hook to delete a trip checklist
 */
export function useDeleteChecklistTrip(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (checklistId: string) => deleteChecklistTrip(checklistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrips"] })
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
    },
  })
}

// ============================================================================
// Checklist Trip Items
// ============================================================================

/**
 * Hook to add an item to a trip checklist
 */
export function useAddChecklistTripItem(checklistId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateChecklistTripItemPayload) =>
      createChecklistTripItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrip", checklistId] })
    },
  })
}

/**
 * Hook to toggle a checklist item (check/uncheck)
 * Call when user clicks checkbox - no debounce
 */
export function useToggleChecklistTripItem(checklistId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, userId }: { itemId: string; userId: string }) =>
      toggleChecklistTripItem(itemId, { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrip", checklistId] })
      queryClient.invalidateQueries({ queryKey: ["checklistTrips"] })
    },
  })
}

/**
 * Hook to bulk check multiple items
 */
export function useBulkCheckTripItems(checklistId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BulkCheckTripItemsPayload) =>
      bulkCheckTripItems(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrip", checklistId] })
    },
  })
}

/**
 * Hook to update a checklist item
 */
export function useUpdateChecklistTripItem(checklistId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string
      payload: UpdateChecklistTripItemPayload
    }) => updateChecklistTripItem(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrip", checklistId] })
      queryClient.invalidateQueries({ queryKey: ["checklistTrips"] })
    },
  })
}

/**
 * Hook to delete a checklist item
 */
export function useDeleteChecklistTripItem(checklistId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => deleteChecklistTripItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrip", checklistId] })
      queryClient.invalidateQueries({ queryKey: ["checklistTrips"] })
    },
  })
}

/**
 * Hook to reorder checklist items
 */
export function useReorderChecklistTripItems(checklistId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReorderTripItemsPayload) =>
      reorderChecklistTripItems(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistTrip", checklistId] })
    },
  })
}
