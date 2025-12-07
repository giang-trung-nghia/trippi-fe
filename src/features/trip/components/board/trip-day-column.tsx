"use client";

import { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { format } from "date-fns";
import { Calendar, DollarSign, Clock, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { TripDay } from "@/types/trip";
import { TripItemCard } from "./trip-item-card";

type TripDayColumnProps = {
  day: TripDay;
  onToggleComplete?: (itemId: string) => void;
  onEditItem?: () => void;
  onAddItem?: (dayId: string) => void;
};

export function TripDayColumn({
  day,
  onToggleComplete,
  onEditItem,
  onAddItem,
}: TripDayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: day.id });
  const [formattedDate, setFormattedDate] = useState<string>("");
  const itemIds = day.items.map((item) => item.id);

  // Format date on client side only to prevent hydration mismatch
  useEffect(() => {
    setFormattedDate(format(new Date(day.date), "EEE, MMM d"));
  }, [day.date]);

  return (
    <Card
      className={cn(
        "flex flex-col w-80 flex-shrink-0",
        isOver && "ring-2 ring-primary"
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div>
            <div className="font-bold">Day {day.dayIndex}</div>
            {formattedDate && (
              <div className="text-sm text-muted-foreground font-normal flex items-center gap-1 mt-1">
                <Calendar className="size-3" />
                {formattedDate}
              </div>
            )}
          </div>
          <div>
            ${day.totalEstimatedCost?.toFixed(0)}
            <div className="text-xs text-muted-foreground font-normal">
              {day.items.length} {day.items.length === 1 ? "item" : "items"}
            </div>
          </div>
        </CardTitle>

        {day.title && (
          <p className="text-sm font-medium text-foreground mt-2">
            {day.title}
          </p>
        )}

        {day.description && (
          <p className="text-xs text-muted-foreground">{day.description}</p>
        )}

        {/* Day Summary */}
        <div className="flex items-center gap-4 mt-3 text-xs">
          {day.totalEstimatedCost > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="size-3" />
              <span>${day.totalEstimatedCost.toFixed(0)}</span>
            </div>
          )}
          {day.totalDuration > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              <span>
                {Math.floor(day.totalDuration / 60)}h {day.totalDuration % 60}m
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-3 flex-1 min-h-0">
        <div
          ref={setNodeRef}
          className={cn(
            "space-y-2 min-h-[200px]",
            isOver && "bg-accent/20 rounded-md"
          )}
        >
          <SortableContext
            items={itemIds}
            strategy={verticalListSortingStrategy}
          >
            {day.items.map((item) => (
              <TripItemCard
                key={item.id}
                item={item}
                onToggleComplete={onToggleComplete}
                onEdit={() => onEditItem?.()}
              />
            ))}
          </SortableContext>

          {/* Add Item Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => onAddItem?.(day.id)}
          >
            <Plus className="size-4 mr-2" />
            Add item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
