"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MapPin, Clock, DollarSign, ChevronRight, Pencil, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TripDay, TripItem } from "@/types/trip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DayCardProps = {
  day: TripDay;
  isSelected: boolean;
  onClick: () => void;
  onItemClick?: (item: TripItem) => void;
  onItemDelete?: (itemId: string) => void;
  onItemUpdate?: (itemId: string, updates: { startTime?: string; endTime?: string; cost?: number }) => void;
};

export function DayCard({ day, isSelected, onClick, onItemClick, onItemDelete, onItemUpdate }: DayCardProps) {
  const itemsWithLocation = day.items;
  
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  
  // Edit form state
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editCost, setEditCost] = useState("");

  const handleEditClick = (item: TripItem) => {
    setEditingItemId(item.id);
    setEditStartTime(formatTime(item.startTime || ""));
    setEditEndTime(formatTime(item.endTime || ""));
    setEditCost(item.cost?.toString() || "");
  };

  const handleSaveEdit = () => {
    if (editingItemId && onItemUpdate) {
      onItemUpdate(editingItemId, {
        startTime: editStartTime || undefined,
        endTime: editEndTime || undefined,
        cost: editCost ? parseFloat(editCost) : undefined,
      });
    }
    setEditingItemId(null);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteItemId && onItemDelete) {
      onItemDelete(deleteItemId);
    }
    setDeleteItemId(null);
  };

  // Format time to HH:MM (remove seconds if present)
  const formatTime = (time: string | null) => {
    if (!time) return "";
    const parts = time.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return time;
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border-2 bg-white p-4 text-left transition-all hover:shadow-md",
        isSelected
          ? "border-blue-500 shadow-md"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-semibold",
                isSelected
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              )}
            >
              Day {day.dayIndex}
            </span>
            {day.date && (
              <span className="text-xs text-gray-500">
                {format(new Date(day.date), "MMM d")}
              </span>
            )}
          </div>

          {day.title && (
            <h3 className="mt-2 font-semibold text-gray-900">{day.title}</h3>
          )}

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{itemsWithLocation.length} places</span>
            </div>
            {day.totalDuration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{Math.floor(day.totalDuration / 60)}h</span>
              </div>
            )}
            {day.totalEstimatedCost && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>{day.totalEstimatedCost}</span>
              </div>
            )}
          </div>
        </div>

        <ChevronRight
          className={cn(
            "h-5 w-5 transition-transform",
            isSelected ? "rotate-90 text-blue-600" : "text-gray-400"
          )}
        />
      </div>

      {/* Items preview (when selected) */}
      {isSelected && itemsWithLocation.length > 0 && (
        <div className="mt-3 space-y-2 border-t pt-3">
          {itemsWithLocation.map((item, index) => (
            <div
              key={item.id}
              className="relative group"
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
            >
              {editingItemId === item.id ? (
                // Edit Mode
                <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700 truncate">Edit: {item.name}</span>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSaveEdit}
                        className="h-6 w-6"
                        title="Save"
                      >
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEdit}
                        className="h-6 w-6"
                        title="Cancel"
                      >
                        <X className="h-3.5 w-3.5 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Responsive grid: 3 columns on large screens, stack on small screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500 mb-1 block">Start Time (24h)</label>
                      <input
                        type="time"
                        value={editStartTime}
                        onChange={(e) => setEditStartTime(formatTime(e.target.value))}
                        className="flex h-7 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        step="300"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 mb-1 block">End Time (24h)</label>
                      <input
                        type="time"
                        value={editEndTime}
                        onChange={(e) => setEditEndTime(formatTime(e.target.value))}
                        className="flex h-7 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        step="300"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 mb-1 block">Cost ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editCost}
                        onChange={(e) => setEditCost(e.target.value)}
                        className="h-7 text-xs"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div
                  className="flex items-start gap-2 text-sm p-1 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onItemClick && item.location) {
                      onItemClick(item);
                    }
                  }}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.startTime && (
                        <p className="text-xs text-gray-500">{formatTime(item.startTime)}</p>
                      )}
                      {item.cost && item.cost > 0 && (
                        <p className="text-xs text-gray-500">${item.cost}</p>
                      )}
                    </div>
                  </div>
                  {/* Hover Actions */}
                  {hoveredItemId === item.id && (
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item);
                        }}
                        className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteItemId(item.id);
                        }}
                        className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteConfirm();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </button>
  );
}
