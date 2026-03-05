"use client"

import { useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getTripById, exportTripCsv, exportTripExcel } from "@/services/trips"
import { getChecklistTrips } from "@/services/checklists"
import { Skeleton } from "@/components/ui/skeleton"
import { TripOverview } from "@/features/trip/components/overview/trip-overview"
import type { TripViewType } from "@/features/trip/components/trip-tabs"
import { TripBoardView } from "@/features/trip/components/trip-board-view"
import { TripMapView } from "@/features/trip/components/trip-map-view"
import { TripFormDialog } from "@/features/trip/components/trips/trip-form-dialog"
import { ChecklistSidebar } from "@/features/checklist/components/trip/checklist-sidebar"
import { ChecklistSidebarToggle } from "@/features/checklist/components/trip/checklist-sidebar-toggle"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"

export default function TripDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const tripId = params.id as string

  // Get view from URL query parameter, default to 'board'
  const currentView = (searchParams.get("view") as TripViewType) || "board"

  const [editTripDialogOpen, setEditTripDialogOpen] = useState(false)
  const [checklistSidebarOpen, setChecklistSidebarOpen] = useState(false)

  // Fetch trip data (shared between both views)
  const { data: trip, isLoading, error } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getTripById(tripId),
  })

  // Fetch checklist data for the badge count
  const { data: allChecklists } = useQuery({
    queryKey: ["checklistTrips"],
    queryFn: getChecklistTrips,
  })

  const tripChecklists = allChecklists?.filter((c) => c.trip?.id === tripId) || []

  const handleViewChange = (view: TripViewType) => {
    router.push(`/trips/${tripId}?view=${view}`, { scroll: false })
  }

  const handleEditTrip = () => {
    setEditTripDialogOpen(true)
  }

  const handleDownloadCsv = async () => {
    try {
      const blob = await exportTripCsv(tripId)
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${trip?.name || 'trip'}.csv`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success("CSV downloaded successfully!")
    } catch (error) {
      console.error("Error downloading CSV:", error)
      toast.error("Failed to download CSV. Please try again.")
    }
  }

  const handleDownloadExcel = async () => {
    try {
      const blob = await exportTripExcel(tripId)
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${trip?.name || 'trip'}.xlsx`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success("Excel downloaded successfully!")
    } catch (error) {
      console.error("Error downloading Excel:", error)
      toast.error("Failed to download Excel. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-full overflow-hidden">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
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
      {/* Trip Overview with integrated tabs */}
      <TripOverview 
        trip={trip} 
        onEdit={handleEditTrip}
        onDownloadCsv={handleDownloadCsv}
        onDownloadExcel={handleDownloadExcel}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* View Content with Checklist Sidebar */}
      <div className="relative min-h-0">
        {/* Main View Content */}
        <div
          className={cn(
            "transition-all duration-300",
            checklistSidebarOpen && "md:mr-[400px]"
          )}
        >
          {currentView === "board" && <TripBoardView trip={trip} />}
          {currentView === "map" && <TripMapView trip={trip} />}
        </div>

        {/* Floating Checklist Toggle Button */}
        <ChecklistSidebarToggle
          isOpen={checklistSidebarOpen}
          onToggle={() => setChecklistSidebarOpen(!checklistSidebarOpen)}
          checklistCount={tripChecklists.length}
        />

        {/* Checklist Sidebar */}
        <ChecklistSidebar
          tripId={tripId}
          isOpen={checklistSidebarOpen}
          onClose={() => setChecklistSidebarOpen(false)}
        />
      </div>

      {/* Edit Trip Dialog - Shared by both views */}
      <TripFormDialog
        open={editTripDialogOpen}
        onOpenChange={setEditTripDialogOpen}
        trip={trip}
      />
    </div>
  )
}
