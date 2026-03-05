"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Add Checklist to Trip</DialogTitle>
          <DialogDescription>
            Choose a checklist from your personal collection or browse templates
          </DialogDescription>
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
