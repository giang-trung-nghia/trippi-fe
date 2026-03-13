"use client"

import { useState, useRef, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Pencil } from "lucide-react"
import { useDeleteChecklistTripItem, useToggleChecklistTripItem, useUpdateChecklistTripItem } from "@/features/checklist/hooks/use-checklist-mutations"
import { useUserStore } from "@/store/use-user-store"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import type { ChecklistTripItem } from "@/types/checklist"

type ChecklistItemRowProps = {
  item: ChecklistTripItem
  checklistId: string
}

export function ChecklistItemRow({
  item,
  checklistId,
}: ChecklistItemRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [optimisticChecked, setOptimisticChecked] = useState(item.isChecked)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const userId = useUserStore((state) => state.user?.id)
  const deleteMutation = useDeleteChecklistTripItem(checklistId)
  const toggleMutation = useToggleChecklistTripItem(checklistId)
  const updateMutation = useUpdateChecklistTripItem(checklistId)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleToggle = async (checked: boolean) => {
    if (!userId) return
    setOptimisticChecked(checked)
    try {
      await toggleMutation.mutateAsync({ itemId: item.id, userId })
    } catch {
      setOptimisticChecked(!checked)
      toast.error("Failed to update")
    }
  }

  const handleDelete = () => {
    deleteMutation.mutate(item.id, {
      onSuccess: () => toast.success("Item deleted"),
      onError: () => toast.error("Failed to delete item"),
    })
  }

  const handleStartEdit = () => {
    setEditName(item.name)
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    const trimmed = editName.trim()
    if (trimmed === item.name || !trimmed) {
      setIsEditing(false)
      setEditName(item.name)
      return
    }
    try {
      await updateMutation.mutateAsync({
        itemId: item.id,
        payload: { name: trimmed },
      })
      toast.success("Item updated")
      setIsEditing(false)
    } catch {
      toast.error("Failed to update item")
    }
  }

  return (
    <div
      className="group flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-secondary/50 transition-colors min-h-[32px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        id={`item-${item.id}`}
        checked={optimisticChecked}
        onCheckedChange={(checked) => handleToggle(checked === true)}
        disabled={toggleMutation.isPending}
        className="shrink-0 h-4 w-4"
      />

      {isEditing ? (
        <Input
          ref={inputRef}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveEdit()
            if (e.key === "Escape") {
              setEditName(item.name)
              setIsEditing(false)
              inputRef.current?.blur()
            }
          }}
          className="h-7 text-xs flex-1 min-w-0"
        />
      ) : (
        <label
          htmlFor={`item-${item.id}`}
          className={cn(
            "flex-1 min-w-0 text-xs cursor-pointer select-none truncate",
            optimisticChecked && "line-through text-muted-foreground"
          )}
        >
          {item.name}
        </label>
      )}

      {/* Reserve space for edit + delete so row height doesn't change on hover */}
      <div className="w-14 shrink-0 flex items-center justify-end gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
            isHovered && "opacity-100"
          )}
          onClick={(e) => {
            e.preventDefault()
            handleStartEdit()
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive",
            isHovered && "opacity-100"
          )}
          onClick={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
