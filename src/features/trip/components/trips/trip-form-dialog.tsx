'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { createTrip, updateTrip } from "@/services/trips"
import type { CreateTripPayload, Trip } from "@/types/trip"

type TripFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip?: Trip // If provided, we're editing; otherwise creating
}

type TripFormValues = Omit<CreateTripPayload, 'startDate' | 'endDate'> & {
  budget?: number
  inviteEmail?: string
}

export function TripFormDialog({ open, onOpenChange, trip }: TripFormDialogProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEditMode = !!trip
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TripFormValues>({
    defaultValues: {
      name: "",
      description: "",
      destination: "",
      budget: undefined,
      inviteEmail: "",
    },
  })

  // Pre-fill form when editing
  useEffect(() => {
    if (trip && open) {
      setValue("name", trip.name)
      setValue("description", trip.description || "")
      setValue("destination", trip.destination || "")
      setValue("budget", trip.totalEstimatedCost)
      
      setDateRange({
        from: new Date(trip.startDate),
        to: new Date(trip.endDate),
      })
    } else if (!open) {
      // Reset form when dialog closes
      reset()
      setDateRange(undefined)
    }
  }, [trip, open, setValue, reset])

  const createMutation = useMutation({
    mutationFn: async (payload: CreateTripPayload) => createTrip(payload),
    onSuccess: (newTrip) => {
      queryClient.invalidateQueries({ queryKey: ["recentTrips"] })
      queryClient.invalidateQueries({ queryKey: ["trips"] })
      reset()
      setDateRange(undefined)
      onOpenChange(false)
      router.push(`/trips/${newTrip.id}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: CreateTripPayload) => 
      updateTrip(trip!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", trip!.id] })
      queryClient.invalidateQueries({ queryKey: ["recentTrips"] })
      queryClient.invalidateQueries({ queryKey: ["trips"] })
      onOpenChange(false)
    },
  })

  const mutation = isEditMode ? updateMutation : createMutation

  const onSubmit = handleSubmit((values) => {
    // Validate date range
    if (!dateRange?.from || !dateRange?.to) {
      return
    }

    const startDate = format(dateRange.from, "yyyy-MM-dd")
    const endDate = format(dateRange.to, "yyyy-MM-dd")

    const payload: CreateTripPayload = {
      name: values.name,
      description: values.description,
      destination: values.destination,
      startDate,
      endDate,
      totalEstimatedCost: values.budget,
      inviteEmails: values.inviteEmail && !isEditMode ? [values.inviteEmail] : undefined,
    }

    mutation.mutate(payload)
  })

  const mutationError =
    mutation.error && mutation.error instanceof Error
      ? mutation.error.message
      : mutation.isError
        ? `Failed to ${isEditMode ? 'update' : 'create'} trip`
        : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit trip' : 'Create a new trip'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update your trip details below.'
              : 'Give your trip a name, pick the dates, and invite a partner to plan together.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="trip-name">
              Trip name<span className="text-destructive ml-0.5">*</span>
            </Label>
            <Input
              id="trip-name"
              placeholder="Japan Adventure"
              {...register("name", { required: "Trip name is required" })}
              aria-invalid={errors.name ? "true" : "false"}
              disabled={mutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-range">
              Date Range<span className="text-destructive ml-0.5">*</span>
            </Label>
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              placeholder="Select trip dates"
              disabled={mutation.isPending}
            />
            {!dateRange?.from && (
              <p className="text-xs text-muted-foreground">
                Select the start and end dates for your trip
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">
              Destination
            </Label>
            <Input
              id="destination"
              placeholder="Tokyo, Japan"
              {...register("destination")}
              disabled={mutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">
              Budget (optional)
            </Label>
            <Input
              id="budget"
              type="number"
              placeholder="5000"
              min="0"
              step="0.01"
              {...register("budget", {
                valueAsNumber: true,
                validate: (value) => {
                  if (value !== undefined && value < 0) {
                    return "Budget must be a positive number"
                  }
                  return true
                },
              })}
              aria-invalid={errors.budget ? "true" : "false"}
              disabled={mutation.isPending}
            />
            {errors.budget && (
              <p className="text-sm text-destructive">{errors.budget.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Total estimated cost for this trip (USD)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description (optional)
            </Label>
            <Input
              id="description"
              placeholder="Summer vacation with family"
              {...register("description")}
              disabled={mutation.isPending}
            />
          </div>

          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="invite-email">
                Invite friend (optional)
              </Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="friend@email.com"
                {...register("inviteEmail", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                aria-invalid={errors.inviteEmail ? "true" : "false"}
                disabled={mutation.isPending}
              />
              {errors.inviteEmail && (
                <p className="text-sm text-destructive">
                  {errors.inviteEmail.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                You can invite more people later
              </p>
            </div>
          )}

          {mutationError && (
            <p className="text-sm text-destructive">{mutationError}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !dateRange?.from || !dateRange?.to}
            >
              {mutation.isPending 
                ? (isEditMode ? "Updating..." : "Creating...")
                : (isEditMode ? "Update trip" : "Create trip")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

