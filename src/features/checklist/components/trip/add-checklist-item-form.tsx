"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useAddChecklistTripItem } from "@/features/checklist/hooks/use-checklist-mutations"
import { toast } from "@/lib/toast"

type AddChecklistItemFormProps = {
  checklistId: string
}

export function AddChecklistItemForm({
  checklistId,
}: AddChecklistItemFormProps) {
  const [name, setName] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addMutation = useAddChecklistTripItem(checklistId)

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    try {
      // Get the current items count to calculate order index
      const orderIndex = 0 // Backend will handle ordering
      
      await addMutation.mutateAsync({
        name: name.trim(),
        orderIndex,
        checklistTripId: checklistId,
      })
      
      setName("")
      toast.success("Item added successfully")
      
      // Keep the form open for adding more items
      inputRef.current?.focus()
    } catch {
      toast.error("Failed to add item")
    }
  }

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsAdding(true)}
        className="w-full justify-start text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add item
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name..."
        className="flex-1"
        onBlur={() => {
          if (!name.trim()) {
            setIsAdding(false)
          }
        }}
        disabled={addMutation.isPending}
      />
      <Button
        type="submit"
        size="sm"
        disabled={!name.trim() || addMutation.isPending}
      >
        {addMutation.isPending ? "Adding..." : "Add"}
      </Button>
    </form>
  )
}
