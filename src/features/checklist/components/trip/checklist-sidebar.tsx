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
import { useQuery } from "@tanstack/react-query"
import { getChecklistTrips } from "@/services/checklists"
import { TripChecklistCard } from "./trip-checklist-card"
import { AddChecklistSourceDialog } from "./add-checklist-source-dialog"
import { ChecklistEmptyState } from "./checklist-empty-state"
import { SaveIndicator } from "./save-indicator"

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

  const { data: allChecklists, isLoading } = useQuery({
    queryKey: ["checklistTrips"],
    queryFn: getChecklistTrips,
    enabled: isOpen,
  })

  // Filter checklists for this trip
  const tripChecklists = allChecklists?.filter((c) => c.trip?.id === tripId) || []

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full md:w-[400px] p-0 flex flex-col"
        >
          <SheetHeader className="px-4 md:px-6 py-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle>Checklists</SheetTitle>
              <SaveIndicator />
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-4 md:px-6">
            <div className="py-4 space-y-3">
              {isLoading ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Loading checklists...
                </div>
              ) : tripChecklists.length === 0 ? (
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

          <div className="px-4 md:px-6 py-4 border-t shrink-0">
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
