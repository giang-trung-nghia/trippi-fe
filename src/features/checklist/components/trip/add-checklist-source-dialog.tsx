"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilePlus2 } from "lucide-react"
import { useCreateChecklistTrip } from "@/features/checklist/hooks/use-checklist-mutations"
import { toast } from "@/lib/toast"
import { MyChecklistsSelector } from "./my-checklists-selector"
import { TemplatesBrowser } from "./templates-browser"

type AddChecklistSourceDialogProps = {
  tripId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddChecklistSourceDialog({
  tripId,
  open,
  onOpenChange,
}: AddChecklistSourceDialogProps) {
  const [activeTab, setActiveTab] = useState<"my-checklists" | "templates">(
    "my-checklists"
  )
  const createMutation = useCreateChecklistTrip(tripId)

  const handleAddEmptyChecklist = async () => {
    try {
      await createMutation.mutateAsync({
        name: "New Checklist",
        tripId,
      })
      toast.success("Empty checklist added")
      onOpenChange(false)
    } catch {
      toast.error("Failed to add checklist")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle>Add Checklist to Trip</DialogTitle>
              <DialogDescription>
                Choose a checklist from your personal collection or browse templates
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddEmptyChecklist}
              disabled={createMutation.isPending}
              className="shrink-0 gap-2"
            >
              <FilePlus2 className="h-4 w-4" />
              {createMutation.isPending ? "Adding..." : "Add empty checklist"}
            </Button>
          </div>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "my-checklists" | "templates")}
          className="flex-1 flex flex-col min-h-0 px-6 pb-6"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="my-checklists">My Checklists</TabsTrigger>
            <TabsTrigger value="templates">Browse Templates</TabsTrigger>
          </TabsList>

          <TabsContent
            value="my-checklists"
            className="flex-1 overflow-auto mt-0"
          >
            <MyChecklistsSelector
              tripId={tripId}
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>

          <TabsContent
            value="templates"
            className="flex-1 overflow-auto mt-0"
          >
            <TemplatesBrowser
              tripId={tripId}
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
