"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Plus } from "lucide-react"
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

  // Fetch checklists for this trip with full item details
  const { data: tripChecklists, isLoading } = useChecklistTripsByTripId(tripId, true)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          showClose={false}
          className="w-full md:w-[400px] p-0 flex flex-col gap-0 min-h-0 h-full z-[100]"
        >
          <SheetHeader className="px-4 md:px-6 py-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base">Checklists</SheetTitle>
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
