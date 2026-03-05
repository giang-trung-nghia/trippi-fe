"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useToggleChecklistTripItem } from "@/features/checklist/hooks/use-checklist-mutations"
import { useUserStore } from "@/store/use-user-store"
import { toast } from "@/lib/toast"

type SaveState = "idle" | "saving" | "error"

export function useDebouncedToggle(checklistId: string) {
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const toggleMutation = useToggleChecklistTripItem(checklistId)
  const userId = useUserStore((state) => state.user?.id)
  const pendingTogglesRef = useRef<Map<string, boolean>>(new Map())

  // Debounced save function - 2.5 seconds
  const debouncedSave = useDebouncedCallback(
    async (itemId: string, newState: boolean) => {
      if (!userId) return

      setSaveState("saving")
      
      try {
        await toggleMutation.mutateAsync({ itemId, userId })
        setSaveState("idle")
        pendingTogglesRef.current.delete(itemId)
      } catch (error) {
        setSaveState("error")
        toast.error("Failed to save changes")
        
        // Keep the pending toggle to retry or notify user
        setTimeout(() => setSaveState("idle"), 3000)
      }
    },
    2500 // 2.5 seconds debounce
  )

  const toggleItem = useCallback(
    (itemId: string, currentState: boolean) => {
      const newState = !currentState
      
      // Store the pending toggle
      pendingTogglesRef.current.set(itemId, newState)
      
      // Trigger debounced save
      debouncedSave(itemId, newState)
    },
    [debouncedSave]
  )

  // Check if there are pending saves
  const hasPendingSaves = pendingTogglesRef.current.size > 0

  return {
    toggleItem,
    isSaving: saveState === "saving" || hasPendingSaves,
    saveState,
  }
}
