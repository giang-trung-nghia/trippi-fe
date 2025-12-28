"use client"

import { useState } from "react"
import { TripBoard } from "./board/trip-board"
import { AddItemDialog } from "./items/add-item-dialog"
import { InviteMemberDialog } from "./members/invite-member-dialog"
import { MemberDetailsSheet } from "./members/member-details-sheet"
import type { Trip, TripMember } from "@/types/trip"

type TripBoardViewProps = {
  trip: Trip
}

/**
 * Board view component - handles itinerary board and related dialogs
 */
export function TripBoardView({ trip }: TripBoardViewProps) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<TripMember | null>(null)
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false)
  const [inviteMemberDialogOpen, setInviteMemberDialogOpen] = useState(false)
  const [memberDetailsOpen, setMemberDetailsOpen] = useState(false)

  const handleEditItem = () => {
    // TODO: Open edit item dialog
    console.log("Edit item")
  }

  const handleAddItem = (dayId: string) => {
    setSelectedDayId(dayId)
    setAddItemDialogOpen(true)
  }

  const handleAddMember = () => {
    setInviteMemberDialogOpen(true)
  }

  const handleMemberClick = (memberId: string) => {
    const member = trip.members.find((m) => m.id === memberId)
    if (member) {
      setSelectedMember(member)
      setMemberDetailsOpen(true)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="w-full overflow-hidden">
          <TripBoard
            trip={trip}
            onEditItem={handleEditItem}
            onAddItem={handleAddItem}
          />
        </div>
      </div>

      {/* Add Item Dialog */}
      {selectedDayId && (
        <AddItemDialog
          open={addItemDialogOpen}
          onOpenChange={setAddItemDialogOpen}
          tripDayId={selectedDayId}
          tripId={trip.id}
        />
      )}

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={inviteMemberDialogOpen}
        onOpenChange={setInviteMemberDialogOpen}
        tripId={trip.id}
      />

      {/* Member Details Sheet */}
      <MemberDetailsSheet
        open={memberDetailsOpen}
        onOpenChange={setMemberDetailsOpen}
        member={selectedMember}
        tripId={trip.id}
        isOwner={trip.createdBy === "user-1"} // TODO: Check against current user
      />
    </>
  )
}

