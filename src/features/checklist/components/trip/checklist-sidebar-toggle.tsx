"use client"

import { CheckSquare, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

type ChecklistSidebarToggleProps = {
  isOpen: boolean
  onToggle: () => void
  checklistCount: number
}

export function ChecklistSidebarToggle({
  isOpen,
  onToggle,
  checklistCount,
}: ChecklistSidebarToggleProps) {
  // Don't show toggle when sidebar is open
  if (isOpen) return null

  return (
    <button
      onClick={onToggle}
      className={cn(
        "fixed top-1/2 -translate-y-1/2 z-20",
        "right-0 rounded-l-full",
        "bg-primary text-primary-foreground",
        "opacity-70 hover:opacity-100",
        "transition-all duration-300",
        "shadow-lg hover:shadow-xl",
        "flex items-center gap-2 py-3 pl-4 pr-2",
        "group"
      )}
      aria-label="Open checklists"
    >
      <div className="relative">
        <CheckSquare className="h-5 w-5" />
        {checklistCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] font-bold">
            {checklistCount}
          </span>
        )}
      </div>
      <ChevronLeft className="h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
    </button>
  )
}
