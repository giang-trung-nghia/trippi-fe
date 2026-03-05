"use client"

import { calculateChecklistProgress } from "@/features/checklist/constants"
import { cn } from "@/lib/utils"

type ChecklistProgressProps = {
  totalItems: number
  checkedItems: number
  className?: string
}

export function ChecklistProgress({
  totalItems,
  checkedItems,
  className,
}: ChecklistProgressProps) {
  const progress = calculateChecklistProgress(totalItems, checkedItems)

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {checkedItems} of {totalItems} completed
        </span>
        <span className="font-medium text-primary">{progress}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
