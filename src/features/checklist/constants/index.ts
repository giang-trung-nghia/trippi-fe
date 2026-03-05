/**
 * Checklist Constants
 * Helper constants and utilities for checklist feature
 */

import type { ChecklistType } from "@/types/checklist"

// Checklist type options for UI
export const CHECKLIST_TYPES: { value: ChecklistType; label: string; icon: string }[] = [
  { value: "PACKING", label: "Packing", icon: "🎒" },
  { value: "DOCUMENT", label: "Documents", icon: "📄" },
  { value: "FOOD", label: "Food & Snacks", icon: "🍱" },
  { value: "EQUIPMENT", label: "Equipment", icon: "🔧" },
  { value: "BABY", label: "Baby Items", icon: "👶" },
  { value: "OTHER", label: "Other", icon: "📋" },
]

// Get label for checklist type
export const getChecklistTypeLabel = (type: ChecklistType): string => {
  const typeConfig = CHECKLIST_TYPES.find((t) => t.value === type)
  return typeConfig?.label || type
}

// Get icon for checklist type
export const getChecklistTypeIcon = (type: ChecklistType): string => {
  const typeConfig = CHECKLIST_TYPES.find((t) => t.value === type)
  return typeConfig?.icon || "📋"
}

// Calculate checklist progress
export const calculateChecklistProgress = (
  totalItems: number,
  checkedItems: number
): number => {
  if (totalItems === 0) return 0
  return Math.round((checkedItems / totalItems) * 100)
}
