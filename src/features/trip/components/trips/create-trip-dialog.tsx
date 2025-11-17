'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createTrip } from "@/services/trips"
import type { CreateTripPayload } from "@/types/trip"

type CreateTripDialogProps = {
  collapsed: boolean
}

type CreateTripFormValues = CreateTripPayload & {
  partnerEmail?: string
}

export function CreateTripDialog({ collapsed }: CreateTripDialogProps) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateTripFormValues>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      partnerEmail: "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: CreateTripFormValues) => {
      return createTrip(values)
    },
    onSuccess: () => {
      reset()
      setOpen(false)
    },
  })

  const onSubmit = handleSubmit((values) => {
    if (
      values.startDate &&
      values.endDate &&
      new Date(values.endDate) < new Date(values.startDate)
    ) {
      setError("endDate", {
        type: "validate",
        message: "End date must be after the start date",
      })
      return
    }

    mutation.mutate(values)
  })

  const mutationError =
    mutation.error && mutation.error instanceof Error
      ? mutation.error.message
      : mutation.isError
        ? "Failed to create trip"
        : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className={cn(
            "justify-center gap-2",
            collapsed ? "w-10 h-10 rounded-full p-0" : "w-full"
          )}
        >
          <PlusIcon className="size-4" />
          <span className={collapsed ? "sr-only" : ""}>Create new trip</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new trip</DialogTitle>
          <DialogDescription>
            Give your trip a name, pick the dates, and invite a partner to plan
            together.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="trip-name">
              Trip name
            </label>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="start-date">
                Start date
              </label>
              <Input
                id="start-date"
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                aria-invalid={errors.startDate ? "true" : "false"}
                disabled={mutation.isPending}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="end-date">
                End date
              </label>
              <Input
                id="end-date"
                type="date"
                {...register("endDate", {
                  required: "End date is required",
                })}
                aria-invalid={errors.endDate ? "true" : "false"}
                disabled={mutation.isPending}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="partner-email">
              Invite partner (email)
            </label>
            <Input
              id="partner-email"
              type="email"
              placeholder="partner@email.com"
              {...register("partnerEmail", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              aria-invalid={errors.partnerEmail ? "true" : "false"}
              disabled={mutation.isPending}
            />
            {errors.partnerEmail && (
              <p className="text-sm text-destructive">
                {errors.partnerEmail.message}
              </p>
            )}
          </div>

          {mutationError && (
            <p className="text-sm text-destructive">{mutationError}</p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create trip"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

