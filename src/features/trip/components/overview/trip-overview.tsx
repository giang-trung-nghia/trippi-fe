"use client";

import { format } from "date-fns";
import { Calendar, MapPin, DollarSign, Edit, Clock, Users } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Trip } from "@/types/trip";
import { MemberAvatarGroup } from "./member-avatar-group";
import { TripTabs, type TripViewType } from "../trip-tabs";

type TripOverviewProps = {
  trip: Trip;
  onEdit?: () => void;
  onAddMember?: () => void;
  onMemberClick?: (memberId: string) => void;
  currentView?: TripViewType;
  onViewChange?: (view: TripViewType) => void;
};

const statusConfig = {
  PLANNING: {
    label: "Planning",
    color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  UPCOMING: {
    label: "Upcoming",
    color: "bg-green-500/10 text-green-700 border-green-500/20",
  },
  ONGOING: {
    label: "Ongoing",
    color: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-700 border-red-500/20",
  },
};

export function TripOverview({
  trip,
  onEdit,
  onAddMember,
  onMemberClick,
  currentView,
  onViewChange,
}: TripOverviewProps) {
  const statusStyle = statusConfig[trip.status];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-xl sm:text-2xl truncate">
                {trip.name}
              </CardTitle>
              <Badge variant="outline" className={statusStyle.color}>
                {statusStyle.label}
              </Badge>
            </div>

            {trip.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {trip.description}
              </p>
            )}
            <div className="flex items-center justify-between gap-2 w-[50%] text-sm text-gray-600">
              {trip.startDate && trip.endDate && (
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(trip.startDate), "MMM d")} -{" "}
                    {format(new Date(trip.endDate), "MMM d, yyyy")}
                  </span>
                  <span>
                    ({trip.totalDays} {trip.totalDays === 1 ? "day" : "days"})
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="">
                  {trip.days.reduce(
                    (acc, day) =>
                      acc + day.items.filter((item) => item.location).length,
                    0
                  )}{" "}
                  places
                </span>
              </div>

              {trip.days.reduce(
                (acc, day) => acc + (day.totalDuration ?? 0),
                0
              ) > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {Math.floor(
                      trip.days.reduce(
                        (acc, day) => acc + (day.totalDuration ?? 0),
                        0
                      ) / 60
                    )}
                    h
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <p className="font-medium">
                  {trip.totalEstimatedCost} / {trip.budget}
                </p>
                {trip.totalActualCost != 0 && (
                  <p className=" mt-0.5">Spent: {trip.totalActualCost}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <p className="font-medium">({trip.members?.length})</p>
                <MemberAvatarGroup
                  members={trip.members ?? []}
                  maxDisplay={3}
                  onAddMember={onAddMember}
                  onMemberClick={(member) => onMemberClick?.(member.id)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Tab Navigation */}
            {currentView && onViewChange && (
              <TripTabs currentView={currentView} onViewChange={onViewChange} />
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="outline" size="icon" onClick={onEdit}>
                  <Edit className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
