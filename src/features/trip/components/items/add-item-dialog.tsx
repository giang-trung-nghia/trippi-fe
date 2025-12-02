'use client'

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TimeInput } from "@/components/ui/time-picker"
import { createTripItem } from "@/services/trips"
import type { CreateTripItemPayload } from "@/types/trip"
import { TripItemType } from "@/features/trip/enums"

type AddItemDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tripDayId: string
  tripId: string
}

const itemTypes: Array<{ value: TripItemType; label: string; icon: string }> = [
  { value: TripItemType.PLACE, label: "Place", icon: "📍" },
  { value: TripItemType.NOTE, label: "Note", icon: "📝" },
  { value: TripItemType.TRANSPORT, label: "Transport", icon: "🚗" },
  { value: TripItemType.MEAL, label: "Meal", icon: "🍜" },
  { value: TripItemType.HOTEL, label: "Hotel", icon: "🏨" },
  { value: TripItemType.ACTIVITY, label: "Activity", icon: "🎯" },
]

type FormValues = {
  type: TripItemType
  name: string
  description?: string
  notes?: string
  address?: string
  startTime?: string
  endTime?: string
  estimatedCost?: number
}

export function AddItemDialog({
  open,
  onOpenChange,
  tripDayId,
  tripId,
}: AddItemDialogProps) {
  const [selectedType, setSelectedType] = useState<TripItemType>(TripItemType.PLACE)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type: TripItemType.PLACE,
      name: "",
      description: "",
      notes: "",
      address: "",
      startTime: "",
      endTime: "",
      estimatedCost: undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: CreateTripItemPayload = {
        tripDayId,
        type: values.type,
        name: values.name,
        description: values.description,
        notes: values.notes,
        address: values.address,
        startTime: values.startTime,
        endTime: values.endTime,
        estimatedCost: values.estimatedCost,
        order: 0, // Will be set by backend
      }
      return createTripItem(payload)
    },
    onSuccess: () => {
      // Invalidate trip query to refetch
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
      reset()
      onOpenChange(false)
    },
  })

  const onSubmit = handleSubmit((values: FormValues) => {
    mutation.mutate(values)
  })

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  // Type-specific fields visibility
  const showLocationFields = ["PLACE", "MEAL", "HOTEL", "ACTIVITY"].includes(selectedType)
  const showTimeFields = selectedType !== "NOTE"
  const showCostFields = true

  const mutationError =
    mutation.error && mutation.error instanceof Error
      ? mutation.error.message
      : mutation.isError
        ? "Failed to add item"
        : null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Trip Item</DialogTitle>
          <DialogDescription>
            Add a new activity, place, or note to your itinerary
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Item Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value as TripItemType)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("type")} value={selectedType} />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Tokyo Tower"
              {...register("name", { required: "Name is required" })}
              disabled={mutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Location Fields */}
          {showLocationFields && (
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Search for a place... (TODO: Google Places integration)"
                {...register("address")}
                disabled={mutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Google Places integration coming soon
              </p>
            </div>
          )}

          {/* Time Fields */}
          {showTimeFields && (
            <div className="space-y-2">
              <Label>Time Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-xs text-muted-foreground">
                    Start Time
                  </Label>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <TimeInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="09:00"
                        disabled={mutation.isPending}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-xs text-muted-foreground">
                    End Time
                  </Label>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <TimeInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="17:00"
                        disabled={mutation.isPending}
                      />
                    )}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                24-hour format (e.g., 09:00, 17:30)
              </p>
            </div>
          )}

          {/* Cost Field */}
          {showCostFields && (
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost</Label>
              <Input
                id="estimatedCost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("estimatedCost", {
                  valueAsNumber: true,
                })}
                disabled={mutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Enter amount without currency symbol
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or reminders..."
              {...register("notes")}
              disabled={mutation.isPending}
              rows={3}
            />
          </div>

          {mutationError && (
            <p className="text-sm text-destructive">{mutationError}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}




