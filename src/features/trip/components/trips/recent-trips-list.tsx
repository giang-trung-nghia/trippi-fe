'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Calendar, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUserStore } from "@/store/use-user-store"
import { getRecentTrips } from "@/services/trips"

type RecentTripsListProps = {
  collapsed: boolean
}

export function RecentTripsList({ collapsed }: RecentTripsListProps) {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const router = useRouter()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  const { data: trips, isLoading } = useQuery({
    queryKey: ["recentTrips"],
    queryFn: () => getRecentTrips(10),
    enabled: isAuthenticated,
  })
  
  const handleTripClick = (tripId: string) => {
    setSelectedTripId(tripId)
    router.push(`/trips/${tripId}`)
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
    <ScrollArea className="flex-1">
      <div className="space-y-1">
        {trips.map((trip) => (
          <Button
            key={trip.id}
            variant={selectedTripId === trip.id ? "secondary" : "ghost"}
            className={cn(
              "justify-start h-auto py-3",
              collapsed ? "w-10 px-0" : "w-full"
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
              <div className="flex flex-col items-start gap-1 w-full overflow-hidden">
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
                  {trip.destination && (
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      <span className="truncate max-w-[100px]">
                        {trip.destination}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}


