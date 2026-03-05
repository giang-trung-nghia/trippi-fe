"use client"

import { Button } from "@/components/ui/button"
import { ClipboardList } from "lucide-react"

type ChecklistEmptyStateProps = {
  onAddClick: () => void
}

export function ChecklistEmptyState({ onAddClick }: ChecklistEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-secondary p-4 mb-4">
        <ClipboardList className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No checklists yet
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Add a checklist to track what you need for this trip
      </p>
      <Button onClick={onAddClick}>
        Add Your First Checklist
      </Button>
    </div>
  )
}
