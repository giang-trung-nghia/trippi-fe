"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, Plus } from "lucide-react"
import { useChecklistUsers, useCopyChecklistToTrip } from "@/features/checklist/hooks/use-checklist-mutations"
import { getChecklistTypeIcon } from "@/features/checklist/constants"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"

type MyChecklistsSelectorProps = {
  tripId: string
  onSuccess: () => void
}

export function MyChecklistsSelector({
  tripId,
  onSuccess,
}: MyChecklistsSelectorProps) {
  const [search, setSearch] = useState("")
  const { data: checklists, isLoading } = useChecklistUsers()
  const copyMutation = useCopyChecklistToTrip(tripId)

  const filteredChecklists = checklists?.filter((checklist) =>
    checklist.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleCopy = async (checklistUserId: string) => {
    try {
      await copyMutation.mutateAsync({
        tripId,
        checklistUserId,
      })
      toast.success("Checklist added to trip!")
      onSuccess()
    } catch {
      toast.error("Failed to add checklist")
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your checklists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredChecklists && filteredChecklists.length > 0 ? (
        <div className="space-y-2">
          {filteredChecklists.map((checklist) => {
            const typeIcon = getChecklistTypeIcon(
              checklist.template?.type || "OTHER"
            )
            const itemCount = checklist.items?.length || 0

            return (
              <div
                key={checklist.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-2xl">{typeIcon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate">
                      {checklist.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleCopy(checklist.id)}
                  disabled={copyMutation.isPending}
                  className="shrink-0"
                >
                  {copyMutation.isPending ? "Adding..." : "Add"}
                </Button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-secondary p-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium mb-1">
                {search ? "No checklists found" : "No personal checklists yet"}
              </p>
              {!search && (
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first checklist or browse templates
                </p>
              )}
            </div>
            {!search && (
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create New Checklist
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
