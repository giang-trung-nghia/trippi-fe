'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X, Plus } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { inviteMember } from "@/services/trips"
import { MemberRole } from "@/features/trip/enums"

type InviteMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tripId: string
}

type FormValues = {
  email: string
  role: MemberRole
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  tripId,
}: InviteMemberDialogProps) {
  const queryClient = useQueryClient()
  const [emails, setEmails] = useState<string[]>([])
  const [role, setRole] = useState<MemberRole>(MemberRole.EDITOR)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      role: MemberRole.EDITOR,
    },
  })

  const mutation = useMutation({
    mutationFn: async () => {
      // Send invitations to all emails
      const promises = emails.map((email) =>
        inviteMember({
          tripId,
          email,
          role,
        })
      )
      return Promise.all(promises)
    },
    onSuccess: () => {
      // Invalidate trip query to refetch members
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
      setEmails([])
      reset()
      onOpenChange(false)
    },
  })

  const handleAddEmail = handleSubmit((values: FormValues) => {
    const email = values.email.trim()
    
    // Check if email already exists
    if (emails.includes(email)) {
      setError("email", {
        type: "manual",
        message: "This email has already been added",
      })
      return
    }

    // Add email to list
    setEmails([...emails, email])
    reset({ email: "" })
    clearErrors("email")
  })

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
  }

  const handleSendInvitations = () => {
    if (emails.length === 0) {
      setError("email", {
        type: "manual",
        message: "Please add at least one email",
      })
      return
    }
    mutation.mutate()
  }

  const handleClose = () => {
    setEmails([])
    reset()
    onOpenChange(false)
  }

  const mutationError =
    mutation.error && mutation.error instanceof Error
      ? mutation.error.message
      : mutation.isError
        ? "Failed to send invitations"
        : null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Invite people to collaborate on this trip
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address<span className="text-destructive ml-0.5">*</span></Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                disabled={mutation.isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddEmail()
                  }
                }}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleAddEmail}
                disabled={mutation.isPending}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Press Enter or click + to add email
            </p>
          </div>

          {/* Email List */}
          {emails.length > 0 && (
            <div className="space-y-2">
              <Label>Invited Emails ({emails.length})</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50 max-h-32 overflow-y-auto">
                {emails.map((email) => (
                  <Badge
                    key={email}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <span className="text-sm">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      disabled={mutation.isPending}
                      className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role for All Members</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as MemberRole)}
              disabled={mutation.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MemberRole.EDITOR}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Editor</span>
                    <span className="text-xs text-muted-foreground">
                      Can view and edit the trip
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value={MemberRole.VIEWER}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Viewer</span>
                    <span className="text-xs text-muted-foreground">
                      Can only view the trip
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              All invited members will have this role
            </p>
          </div>

          {mutationError && (
            <p className="text-sm text-destructive">{mutationError}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendInvitations}
            disabled={mutation.isPending || emails.length === 0}
          >
            {mutation.isPending
              ? "Sending..."
              : `Send ${emails.length} Invitation${emails.length !== 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}




