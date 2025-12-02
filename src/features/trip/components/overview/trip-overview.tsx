'use client'

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, MapPin, DollarSign, Users, Edit, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Trip } from "@/types/trip"
import { MemberAvatarGroup } from "./member-avatar-group"

type TripOverviewProps = {
  trip: Trip
  onEdit?: () => void
  onAddMember?: () => void
  onMemberClick?: (memberId: string) => void
}

const statusConfig = {
  PLANNING: { label: "Planning", color: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  UPCOMING: { label: "Upcoming", color: "bg-green-500/10 text-green-700 border-green-500/20" },
  ONGOING: { label: "Ongoing", color: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
  COMPLETED: { label: "Completed", color: "bg-gray-500/10 text-gray-700 border-gray-500/20" },
  CANCELLED: { label: "Cancelled", color: "bg-red-500/10 text-red-700 border-red-500/20" },
}

export function TripOverview({ trip, onEdit, onAddMember, onMemberClick }: TripOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const statusStyle = statusConfig[trip.status]
  const startDate = format(new Date(trip.startDate), "MMM d, yyyy")
  const endDate = format(new Date(trip.endDate), "MMM d, yyyy")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-xl sm:text-2xl truncate">{trip.name}</CardTitle>
              <Badge variant="outline" className={statusStyle.color}>
                {statusStyle.label}
              </Badge>
            </div>

            {trip.description && !isExpanded && (
              <p className="text-sm text-muted-foreground line-clamp-1">{trip.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onEdit && (
              <Button variant="outline" size="icon" onClick={onEdit}>
                <Edit className="size-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Collapsed View - Minimal Info */}
        {!isExpanded && (
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {trip.destination && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">{trip.destination}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {trip.totalDays} {trip.totalDays === 1 ? "day" : "days"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                ${trip.totalEstimatedCost?.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {trip.members?.length} {trip.members?.length === 1 ? "member" : "members"}
              </span>
            </div>
          </div>
        )}

        {/* Expanded View - Detailed Info */}
        {isExpanded && (
          <>
            {trip.description && (
              <p className="text-sm text-muted-foreground mb-6">{trip.description}</p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Destination */}
              {trip.destination && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 shrink-0">
                    <MapPin className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="text-sm font-medium break-all">{trip.destination}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-primary/10 shrink-0">
                  <Calendar className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">
                    {startDate} - {endDate}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {trip.totalDays} {trip.totalDays === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-primary/10 shrink-0">
                  <DollarSign className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Estimated Budget</p>
                  <p className="text-sm font-medium">
                    ${trip.totalEstimatedCost?.toFixed(2)}
                  </p>
                  {trip.totalActualCost && trip.totalActualCost > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Spent: ${trip.totalActualCost.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Members */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-primary/10 shrink-0">
                  <Users className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-2">
                    {trip.members?.length} {trip.members?.length === 1 ? "Member" : "Members"}
                  </p>
                  <MemberAvatarGroup
                    members={trip.members ?? []}
                    maxDisplay={3}
                    onAddMember={onAddMember}
                    onMemberClick={(member) => onMemberClick?.(member.id)}
                  />
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            {trip.days?.length && trip.days.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-sm font-semibold mb-3">Daily Budget Breakdown</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {trip.days.map((day) => (
                      <div
                        key={day.id}
                        className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        <p className="text-xs text-muted-foreground">Day {day.dayNumber}</p>
                        <p className="text-lg font-semibold">
                          ${day.totalEstimatedCost?.toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {day.items.length} {day.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}




