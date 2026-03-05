"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import {
  useChecklistTemplates,
  useCopyTemplateToTrip,
} from "@/features/checklist/hooks/use-checklist-mutations"
import { CHECKLIST_TYPES, getChecklistTypeIcon } from "@/features/checklist/constants"
import { toast } from "@/lib/toast"
import type { ChecklistType } from "@/types/checklist"

type TemplatesBrowserProps = {
  tripId: string
  onSuccess: () => void
}

export function TemplatesBrowser({
  tripId,
  onSuccess,
}: TemplatesBrowserProps) {
  const [selectedType, setSelectedType] = useState<ChecklistType | "ALL">("ALL")
  
  // Use single endpoint with optional type parameter
  const { data: templates, isLoading } = useChecklistTemplates(
    selectedType === "ALL" ? undefined : selectedType
  )
  
  const copyMutation = useCopyTemplateToTrip(tripId)

  const handleCopyTemplate = async (templateId: string) => {
    try {
      await copyMutation.mutateAsync({
        tripId,
        templateId,
      })
      toast.success("Template added to trip!")
      onSuccess()
    } catch {
      toast.error("Failed to add template to trip")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs
        value={selectedType}
        onValueChange={(v) => setSelectedType(v as ChecklistType | "ALL")}
      >
        <TabsList className="w-full flex-wrap h-auto">
          <TabsTrigger value="ALL">All</TabsTrigger>
          {CHECKLIST_TYPES.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              <span className="mr-1">{type.icon}</span>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {templates && templates.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((template) => {
            const typeIcon = getChecklistTypeIcon(template.type)
            const itemCount = template.items?.length || 0

            return (
              <div
                key={template.id}
                className="flex flex-col p-4 border rounded-lg hover:border-primary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{typeIcon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                {template.items && template.items.length > 0 && (
                  <div className="mb-3 space-y-1 text-xs text-muted-foreground">
                    {template.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span className="truncate">{item.name}</span>
                      </div>
                    ))}
                    {template.items.length > 3 && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span>+{template.items.length - 3} more</span>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  size="sm"
                  onClick={() => handleCopyTemplate(template.id)}
                  disabled={copyMutation.isPending}
                  className="w-full mt-auto"
                >
                  {copyMutation.isPending ? "Adding..." : "Add to My Trip"}
                </Button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found</p>
        </div>
      )}
    </div>
  )
}
