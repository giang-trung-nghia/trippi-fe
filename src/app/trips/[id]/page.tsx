'use client'

import { useState } from "react"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { TripOverview } from "@/features/trip/components/overview/trip-overview"
import { TripBoard } from "@/features/trip/components/board/trip-board"
import { AddItemDialog } from "@/features/trip/components/items/add-item-dialog"
import { InviteMemberDialog } from "@/features/trip/components/members/invite-member-dialog"
import { MemberDetailsSheet } from "@/features/trip/components/members/member-details-sheet"
import { TripFormDialog } from "@/features/trip/components/trips/trip-form-dialog"
import type { TripMember } from "@/types/trip"
import { useQuery } from "@tanstack/react-query"
import { getTripById } from "@/services/trips"

export default function TripDetailPage() {
  const params = useParams()
  const tripId = params.id as string
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<TripMember | null>(null)
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false)
  const [inviteMemberDialogOpen, setInviteMemberDialogOpen] = useState(false)
  const [memberDetailsOpen, setMemberDetailsOpen] = useState(false)
  const [editTripDialogOpen, setEditTripDialogOpen] = useState(false)

  // TODO: Enable this when API is ready
  const { data: trip, isLoading, error } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getTripById(tripId),
  })

  // For development - using mock data
  // const trip = mockTrip
  // const isLoading = false
  // const error = null

  const handleEditItem = () => {
    // TODO: Open edit item dialog
  }

  const handleAddItem = (dayId: string) => {
    setSelectedDayId(dayId)
    setAddItemDialogOpen(true)
  }

  const handleAddMember = () => {
    setInviteMemberDialogOpen(true)
  }

  const handleMemberClick = (memberId: string) => {
    const member = trip?.members.find((m) => m.id === memberId)
    if (member) {
      setSelectedMember(member)
      setMemberDetailsOpen(true)
    }
  }

  const handleEditTrip = () => {
    setEditTripDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-full overflow-hidden">
        <Skeleton className="h-32 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="border rounded-lg p-4">
            <div className="flex gap-4 overflow-x-auto">
              <Skeleton className="h-96 w-80 shrink-0" />
              <Skeleton className="h-96 w-80 shrink-0" />
              <Skeleton className="h-96 w-80 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">Failed to load trip. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <TripOverview
        trip={trip}
        onEdit={handleEditTrip}
        onAddMember={handleAddMember}
        onMemberClick={handleMemberClick}
      />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Itinerary</h2>
        <div className="w-full overflow-hidden">
          <TripBoard
            trip={trip}
            onEditItem={handleEditItem}
            onAddItem={handleAddItem}
          />
        </div>
      </div>

      {/* Edit Trip Dialog */}
      <TripFormDialog
        open={editTripDialogOpen}
        onOpenChange={setEditTripDialogOpen}
        trip={trip}
      />

      {/* Add Item Dialog */}
      {selectedDayId && (
        <AddItemDialog
          open={addItemDialogOpen}
          onOpenChange={setAddItemDialogOpen}
          tripDayId={selectedDayId}
          tripId={tripId}
        />
      )}

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={inviteMemberDialogOpen}
        onOpenChange={setInviteMemberDialogOpen}
        tripId={tripId}
      />

      {/* Member Details Sheet */}
      <MemberDetailsSheet
        open={memberDetailsOpen}
        onOpenChange={setMemberDetailsOpen}
        member={selectedMember}
        tripId={tripId}
        isOwner={trip.createdBy === "user-1"} // TODO: Check against current user
      />
    </div>
  )
}

