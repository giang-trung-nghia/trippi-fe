import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { MapTypeId } from "@/features/maps/types"

type UserPreferencesState = {
  // Sidebar preferences
  sidebarCollapsed: boolean
  
  // Map preferences
  mapShowLegend: boolean
  mapType: MapTypeId
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setMapShowLegend: (show: boolean) => void
  setMapType: (type: MapTypeId) => void
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      // Default values
      sidebarCollapsed: false,
      mapShowLegend: true,
      mapType: "roadmap",

      // Actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setMapShowLegend: (show) => set({ mapShowLegend: show }),
      
      setMapType: (type) => set({ mapType: type }),
    }),
    {
      name: "user-preferences-storage",
      // Only persist these fields
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        mapShowLegend: state.mapShowLegend,
        mapType: state.mapType,
      }),
    }
  )
)

