'use client'

import { format } from "date-fns"
import { Mail, Calendar, Crown, Edit2, Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { updateMemberRole, removeMember } from "@/services/trips"
import type { TripMember } from "@/types/trip"
import { MemberRole } from "@/features/trip/enums"

type MemberDetailsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TripMember | null
  tripId: string
  isOwner?: boolean
}

export function MemberDetailsSheet({
  open,
  onOpenChange,
  member,
  tripId,
  isOwner = false,
}: MemberDetailsSheetProps) {
  const queryClient = useQueryClient()

  const updateRoleMutation = useMutation({
    mutationFn: async (newRole: MemberRole) => {
      if (!member) return
      return updateMemberRole(member.id, { role: newRole })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: async () => {
      if (!member) return
      return removeMember(member.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] })
      onOpenChange(false)
    },
  })

  if (!member) return null

  const roleConfig = {
    OWNER: { label: "Owner", icon: <Crown className="size-3" />, color: "bg-yellow-500/10 text-yellow-700" },
    EDITOR: { label: "Editor", icon: <Edit2 className="size-3" />, color: "bg-blue-500/10 text-blue-700" },
    VIEWER: { label: "Viewer", icon: null, color: "bg-gray-500/10 text-gray-700" },
  }

  const currentRole = roleConfig[member.role]
  const joinedDate = format(new Date(member.joinedAt), "MMM d, yyyy")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Member Details</SheetTitle>
          <SheetDescription>View and manage trip member</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Member Info */}
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={member.user.avatarUrl} alt={member.user.name} />
              <AvatarFallback className="text-lg">
                {member.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{member.user.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-3" />
                <span>{member.user.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Role Badge */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Role</p>
            <Badge variant="outline" className={`${currentRole.color} flex items-center gap-1 w-fit`}>
              {currentRole.icon}
              {currentRole.label}
            </Badge>
          </div>

          {/* Joined Date */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Joined</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>{joinedDate}</span>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && member.role !== "OWNER" && (
            <>
              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Change Role</p>
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      updateRoleMutation.mutate(value as MemberRole)
                    }
                    disabled={updateRoleMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EDITOR">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Editor</span>
                          <span className="text-xs text-muted-foreground">
                            Can view and edit
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="VIEWER">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Viewer</span>
                          <span className="text-xs text-muted-foreground">
                            Can only view
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Remove Member */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={removeMemberMutation.isPending}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Remove from Trip
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Member?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {member.user.name} from this
                        trip? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeMemberMutation.mutate()}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}




