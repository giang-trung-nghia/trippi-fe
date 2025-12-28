'use client'

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Clock, DollarSign, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { TripItem } from "@/types/trip"
import { TripItemType } from "@/features/trip/enums"

type TripItemCardProps = {
  item: TripItem
  onToggleComplete?: (id: string) => void
  onEdit?: (id: string) => void
}

const itemTypeConfig: Record<
  TripItemType,
  { icon: string; color: string; label: string }
> = {
  PLACE: { icon: "📍", color: "bg-blue-500/10 text-blue-700 border-blue-500/20", label: "Place" },
  NOTE: { icon: "📝", color: "bg-gray-500/10 text-gray-700 border-gray-500/20", label: "Note" },
  TRANSPORT: { icon: "🚗", color: "bg-green-500/10 text-green-700 border-green-500/20", label: "Transport" },
  MEAL: { icon: "🍜", color: "bg-orange-500/10 text-orange-700 border-orange-500/20", label: "Meal" },
  HOTEL: { icon: "🏨", color: "bg-purple-500/10 text-purple-700 border-purple-500/20", label: "Hotel" },
  ACTIVITY: { icon: "🎯", color: "bg-red-500/10 text-red-700 border-red-500/20", label: "Activity" },
}

export function TripItemCard({ item, onToggleComplete, onEdit }: TripItemCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const config = itemTypeConfig[item.type]
  const hasTime = item.startTime && item.endTime

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          "cursor-pointer hover:shadow-md transition-all",
          isDragging && "opacity-50 shadow-lg",
          item.isCompleted && "opacity-60"
        )}
        onClick={() => onEdit?.(item.id)}
      >
        <CardContent className="p-3 space-y-2">
          {/* Header with drag handle and checkbox */}
          <div className="flex items-start gap-2">
            <button
              type="button"
              className="cursor-grab active:cursor-grabbing touch-none mt-1"
              {...listeners}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <GripVertical className="size-4 text-muted-foreground" />
            </button>

            <Checkbox
              checked={item.isCompleted}
              onCheckedChange={() => onToggleComplete?.(item.id)}
              onClick={(e) => e.stopPropagation()}
              className="mt-1"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-1">
                <span className="text-lg leading-none">{config.icon}</span>
                <h4
                  className={cn(
                    "font-medium text-sm flex-1",
                    item.isCompleted && "line-through text-muted-foreground"
                  )}
                >
                  {item.customName || item.name}
                </h4>
              </div>

              <Badge variant="outline" className={cn("text-xs", config.color)}>
                {config.label}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1 pl-6 ml-5">
            {hasTime && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span>
                  {item.startTime} - {item.endTime}
                  {item.durationMinutes && ` (${item.durationMinutes} min)`}
                </span>
              </div>
            )}

            {item.address && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                <span className="truncate">{item.address}</span>
              </div>
            )}

            {item.cost !== undefined && item.cost !== null && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <DollarSign className="size-3" />
                <span>${item.cost.toFixed(2)}</span>
              </div>
            )}

            {item.note && !item.isCompleted && (
              <p className="text-xs text-muted-foreground italic pt-1 border-t">
                {item.note}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

