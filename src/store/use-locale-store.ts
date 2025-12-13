import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * Supported language codes in the application
 * ISO 639-1 language codes: "vi" (Vietnamese), "en" (English)
 */
export type LanguageCode = "vi" | "en"

/**
 * Locale Store
 * Manages user's preferred language for the application
 * 
 * The language is used for:
 * - Google Maps API calls (Places, Routes, Geocoding)
 * - Map display language
 * - Future i18n implementation
 */
type LocaleState = {
  languageCode: LanguageCode
  
  // Actions
  setLanguageCode: (languageCode: LanguageCode) => void
  
  // Helper: Get full locale format for APIs that require it (e.g., "vi-VN", "en-US")
  getFullLocale: () => string
}


function detectBrowserLanguage(): LanguageCode {
  // Always default to Vietnamese
  // Only use English if user explicitly sets it (stored in localStorage)
  return "vi"
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      // Initialize with browser language or default (Vietnamese)
      languageCode: detectBrowserLanguage(),

      setLanguageCode: (languageCode) => set({ languageCode }),

      getFullLocale: () => {
        const code = get().languageCode
        // Convert to full locale format for APIs that require it
        return code === "vi" ? "vi-VN" : "en-US"
      },
    }),
    {
      name: "locale-storage",
      version: 1, // Version for migration
      partialize: (state) => ({
        languageCode: state.languageCode,
      }),
      // Handle rehydration from localStorage
      onRehydrateStorage: () => (state) => {
        if (typeof window === "undefined") return
        
        // If no state or invalid language code, default to Vietnamese
        if (!state || (state.languageCode !== "vi" && state.languageCode !== "en")) {
          useLocaleStore.getState().setLanguageCode("vi")
          return
        }
        
        // Migration: Reset to Vietnamese as default for existing users
        // This ensures Vietnamese is always the default going forward
        // Users can still change it manually if they want English
        const storedVersion = localStorage.getItem("locale-storage-version")
        if (storedVersion !== "1") {
          // First time with new version - reset to Vietnamese
          useLocaleStore.getState().setLanguageCode("vi")
          localStorage.setItem("locale-storage-version", "1")
        }
      },
    }
  )
)

/**
 * Get current language code (for use outside React components)
 */
export function getCurrentLanguageCode(): LanguageCode {
  return useLocaleStore.getState().languageCode
}

/**
 * Get current full locale (for use outside React components)
 * Returns "vi-VN" or "en-US" for APIs that require full locale format
 */
export function getCurrentLocale(): string {
  return useLocaleStore.getState().getFullLocale()
}

