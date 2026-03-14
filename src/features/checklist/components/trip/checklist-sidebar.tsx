"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Plus, ChevronDown, ChevronUp } from "lucide-react"
import { useChecklistTripsByTripId } from "@/features/checklist/hooks/use-checklist-mutations"
import { TripChecklistCard } from "./trip-checklist-card"
import { AddChecklistSourceDialog } from "./add-checklist-source-dialog"
import { ChecklistEmptyState } from "./checklist-empty-state"

type ChecklistSidebarProps = {
  tripId: string
  isOpen: boolean
  onClose: () => void
}

export function ChecklistSidebar({
  tripId,
  isOpen,
  onClose,
}: ChecklistSidebarProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [userCollapsedAll, setUserCollapsedAll] = useState(false)

  // Fetch checklists for this trip with full item details
  const { data: tripChecklists, isLoading } = useChecklistTripsByTripId(tripId, true)

  // Derive effective expanded set: empty + not user-collapsed-all => all expanded
  const effectiveExpandedIds = useMemo(() => {
    if (
      tripChecklists?.length &&
      expandedIds.size === 0 &&
      !userCollapsedAll
    ) {
      return new Set(tripChecklists.map((c) => c.id))
    }
    return expandedIds
  }, [tripChecklists, expandedIds, userCollapsedAll])

  const allExpanded =
    tripChecklists != null &&
    tripChecklists.length > 0 &&
    effectiveExpandedIds.size >= tripChecklists.length

  const toggleExpandAll = useCallback(() => {
    if (!tripChecklists?.length) return
    if (allExpanded) {
      setUserCollapsedAll(true)
      setExpandedIds(new Set())
    } else {
      setUserCollapsedAll(false)
      setExpandedIds(new Set(tripChecklists.map((c) => c.id)))
    }
  }, [tripChecklists, allExpanded])

  const handleCardOpenChange = useCallback(
    (checklistId: string, open: boolean) => {
      setExpandedIds((prev) => {
        const base =
          prev.size === 0 &&
          !userCollapsedAll &&
          tripChecklists?.length
            ? new Set(tripChecklists.map((c) => c.id))
            : new Set(prev)
        if (open) base.add(checklistId)
        else base.delete(checklistId)
        return base
      })
    },
    [userCollapsedAll, tripChecklists]
  )

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          showClose={false}
          className="w-full md:w-[400px] p-0 flex flex-col gap-0 min-h-0 h-full z-[100]"
        >
          <SheetHeader className="px-4 md:px-6 py-3 border-b shrink-0">
            <div className="flex items-center justify-between gap-2">
              <SheetTitle className="text-base">Checklists</SheetTitle>
              {tripChecklists && tripChecklists.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={toggleExpandAll}
                  aria-label={allExpanded ? "Collapse all" : "Expand all"}
                >
                  {allExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-4 md:px-6 py-3 space-y-2">
                {isLoading ? (
                  <div className="text-sm text-muted-foreground text-center py-6">
                    Loading checklists...
                  </div>
                ) : !tripChecklists || tripChecklists.length === 0 ? (
                  <ChecklistEmptyState onAddClick={() => setAddDialogOpen(true)} />
                ) : (
                  tripChecklists.map((checklist) => (
                    <TripChecklistCard
                      key={checklist.id}
                      checklist={checklist}
                      tripId={tripId}
                      isOpen={effectiveExpandedIds.has(checklist.id)}
                      onOpenChange={(open) => handleCardOpenChange(checklist.id, open)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="px-4 md:px-6 py-3 border-t shrink-0">
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Checklist
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AddChecklistSourceDialog
        tripId={tripId}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </>
  )
}
