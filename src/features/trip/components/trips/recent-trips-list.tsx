'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Calendar, MoreVertical, Pin, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useUserStore } from "@/store/use-user-store"
import { getRecentTrips } from "@/services/trips"
import { useDeleteTrip } from "@/features/trip/hooks/use-trip-mutations"
import { toast } from "@/lib/toast"

type RecentTripsListProps = {
  collapsed: boolean
}

export function RecentTripsList({ collapsed }: RecentTripsListProps) {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [hoveredTripId, setHoveredTripId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tripToDelete, setTripToDelete] = useState<string | null>(null)
  const router = useRouter()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const deleteTripMutation = useDeleteTrip()

  const { data: trips, isLoading } = useQuery({
    queryKey: ["recentTrips"],
    queryFn: () => getRecentTrips(10),
    enabled: isAuthenticated,
  })
  
  const handleTripClick = (tripId: string) => {
    setSelectedTripId(tripId)
    router.push(`/trips/${tripId}`)
  }

  const handleDeleteClick = (tripId: string) => {
    setTripToDelete(tripId)
    setDeleteDialogOpen(true)
    setOpenDropdownId(null)
  }

  const handlePinClick = (tripId: string) => {
    // TODO: Implement pin functionality in the future
    toast.info("Pin feature coming soon!")
    setOpenDropdownId(null)
  }

  const confirmDelete = async () => {
    if (!tripToDelete) return

    try {
      await deleteTripMutation.mutateAsync(tripToDelete)
      toast.success("Trip deleted successfully")
      setDeleteDialogOpen(false)
      setTripToDelete(null)
      
      // If we're currently on the deleted trip's page, navigate to trips list
      if (selectedTripId === tripToDelete) {
        router.push("/trips")
      }
    } catch {
      toast.error("Failed to delete trip")
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className={cn("h-16", collapsed ? "w-10" : "w-full")} />
        ))}
      </div>
    )
  }

  if (!trips || trips.length === 0) {
    return (
      <div className={cn("text-center py-8", collapsed && "hidden")}>
        <p className="text-sm text-muted-foreground">No trips yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Create your first trip above
        </p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {trips.map((trip) => {
            const showMenu = !collapsed && (hoveredTripId === trip.id || openDropdownId === trip.id)
            
            return (
              <div
                key={trip.id}
                className="relative"
                onMouseEnter={() => setHoveredTripId(trip.id)}
                onMouseLeave={() => setHoveredTripId(null)}
              >
                <Button
                  variant={selectedTripId === trip.id ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start h-auto py-3 w-full",
                    collapsed ? "px-0" : ""
                  )}
                  onClick={() => handleTripClick(trip.id)}
                >
                  {collapsed ? (
                    <div className="flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {trip.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-1 w-full overflow-hidden pr-10">
                      <span className="font-medium text-sm truncate w-full text-left">
                        {trip.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Button>

                {/* Three-dot menu */}
                {showMenu && (
                  <div 
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu
                      open={openDropdownId === trip.id}
                      onOpenChange={(open) => {
                        setOpenDropdownId(open ? trip.id : null)
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-accent"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handlePinClick(trip.id)}>
                          <Pin className="h-4 w-4" />
                          <span>Pin trip</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeleteClick(trip.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete trip</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trip
              and all associated data including days, items, and members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
              disabled={deleteTripMutation.isPending}
            >
              {deleteTripMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


