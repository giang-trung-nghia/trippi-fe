"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteChecklistTripItem } from "@/features/checklist/hooks/use-checklist-mutations"
import { useDebouncedToggle } from "@/features/checklist/hooks/use-debounced-toggle"
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [optimisticChecked, setOptimisticChecked] = useState(item.isChecked)
  
  const deleteMutation = useDeleteChecklistTripItem(checklistId)
  const { toggleItem } = useDebouncedToggle(checklistId)

  const handleToggle = (checked: boolean) => {
    // Optimistic UI update
    setOptimisticChecked(checked)
    
    // Trigger debounced save
    toggleItem(item.id, item.isChecked)
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(item.id)
      toast.success("Item deleted successfully")
      setDeleteDialogOpen(false)
    } catch {
      toast.error("Failed to delete item")
    }
  }

  return (
    <>
      <div
        className="group flex items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-50 transition-colors min-h-[44px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Checkbox
          id={`item-${item.id}`}
          checked={optimisticChecked}
          onCheckedChange={handleToggle}
          className="shrink-0 h-5 w-5"
        />
        
        <label
          htmlFor={`item-${item.id}`}
          className={cn(
            "flex-1 text-sm cursor-pointer select-none",
            optimisticChecked && "line-through text-muted-foreground"
          )}
        >
          {item.name}
        </label>

        {isHovered && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{item.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
