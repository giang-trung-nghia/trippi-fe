"use client"

import { useState } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { ChevronDown, ChevronRight, MoreVertical, Trash2 } from "lucide-react"
import { ChecklistProgress } from "./checklist-progress"
import { ChecklistItemRow } from "./checklist-item-row"
import { AddChecklistItemForm } from "./add-checklist-item-form"
import { useDeleteChecklistTrip } from "@/features/checklist/hooks/use-checklist-mutations"
import { getChecklistTypeIcon } from "@/features/checklist/constants"
import { toast } from "@/lib/toast"
import type { ChecklistTrip } from "@/types/checklist"
import { cn } from "@/lib/utils"

type TripChecklistCardProps = {
  checklist: ChecklistTrip
  tripId: string
}

export function TripChecklistCard({
  checklist,
  tripId,
}: TripChecklistCardProps) {
  const [isOpen, setIsOpen] = useState(true) // Default expanded
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const deleteMutation = useDeleteChecklistTrip(tripId)

  const totalItems = checklist.items?.length || 0
  const checkedItems =
    checklist.items?.filter((item) => item.isChecked).length || 0
  const typeIcon = getChecklistTypeIcon(
    checklist.checklistUser?.template?.type || "OTHER"
  )

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(checklist.id)
      toast.success("Checklist deleted successfully")
      setDeleteDialogOpen(false)
    } catch {
      toast.error("Failed to delete checklist")
    }
  }

  return (
    <>
      <Collapsible.Root
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border rounded-lg bg-card shadow-sm"
      >
        <div className="p-2">
          <div className="flex items-start gap-1.5">
            <Collapsible.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0 mt-0.5"
              >
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </Button>
            </Collapsible.Trigger>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1.5 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base">{typeIcon}</span>
                  <h3 className="font-semibold text-xs truncate">
                    {checklist.name}
                  </h3>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {isOpen ? (
                <ChecklistProgress
                  totalItems={totalItems}
                  checkedItems={checkedItems}
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {checkedItems}/{totalItems}
                </span>
              )}
            </div>
          </div>
        </div>

        <Collapsible.Content className={cn("overflow-hidden", isOpen && "border-t")}>
          <div className="p-2 space-y-0">
            {checklist.items && checklist.items.length > 0 && (
              checklist.items.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  checklistId={checklist.id}
                />
              ))
            )}
            <AddChecklistItemForm checklistId={checklist.id} />
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete checklist?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              checklist and all its items.
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
