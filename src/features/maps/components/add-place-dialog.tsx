"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { PlaceSearch } from "./place-search"
import type { PlaceResult } from "@/features/maps/types"

type AddPlaceDialogProps = {
  onPlaceAdd: (place: PlaceResult) => void
}

export function AddPlaceDialog({ onPlaceAdd }: AddPlaceDialogProps) {
  const [open, setOpen] = useState(false)

  const handlePlaceSelect = (place: PlaceResult) => {
    onPlaceAdd(place)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="absolute bottom-6 left-[420px] z-10 rounded-full shadow-lg"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Place to Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Place to Trip</DialogTitle>
          <DialogDescription>
            Search for a place to add to your trip itinerary
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <PlaceSearch
            onPlaceSelect={handlePlaceSelect}
            placeholder="Search for restaurants, hotels, attractions..."
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
