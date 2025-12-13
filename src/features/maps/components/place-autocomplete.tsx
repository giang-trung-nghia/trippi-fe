"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { searchPlaces } from "@/services/maps"
import type { PlaceResult } from "@/features/maps/types"

type PlaceAutocompleteProps = {
  onPlaceSelect: (place: PlaceResult) => void
  onPlaceInfo?: (place: PlaceResult) => void
  placeholder?: string
  className?: string
}

export function PlaceAutocomplete({
  onPlaceSelect,
  onPlaceInfo,
  placeholder = "Search places...",
  className,
}: PlaceAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PlaceResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Search function (can be called directly or debounced)
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setShowResults(true)

    try {
      const data = await searchPlaces(searchQuery, {
        maxResultCount: 5,
      })

      if (data.places && data.places.length > 0) {
        const formattedResults: PlaceResult[] = data.places.map((place) => ({
          placeId: place.id,
          name: place.displayName.text,
          formattedAddress: place.formattedAddress,
          location: {
            lat: place.location.latitude,
            lng: place.location.longitude,
          },
          types: place.types,
        }))
        setResults(formattedResults)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced search function
  const debouncedSearch = (searchQuery: string) => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchQuery)
    }, 200) // 0.2s debounce
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    setIsLoading(true)
    debouncedSearch(value)
  }

  const handleSelectPlace = (place: PlaceResult) => {
    setQuery(place.name)
    setShowResults(false)
    setResults([])
    
    if (onPlaceInfo) {
      onPlaceInfo(place)
    }
    
    onPlaceSelect(place)
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
  }

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".place-autocomplete-container")) {
        setShowResults(false)
      }
    }

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [showResults])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <div className={cn("relative w-full max-w-lg place-autocomplete-container", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              e.preventDefault()
              // Clear debounce and search immediately
              if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
              }
              // Search immediately without debounce
              performSearch(query)
            }
          }}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true)
            }
          }}
          placeholder={placeholder}
          className="pl-9 pr-9 bg-white shadow-lg border-gray-300"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-9 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && (query.trim() || results.length > 0) && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-white shadow-xl max-h-80 overflow-hidden">
          {results.length > 0 ? (
            <ScrollArea className="max-h-80">
              <div className="p-2">
                {results.map((place) => (
                  <button
                    key={place.placeId}
                    onClick={() => handleSelectPlace(place)}
                    className="flex w-full items-start gap-3 rounded-md p-3 text-left hover:bg-gray-100 transition-colors"
                  >
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="font-medium text-gray-900 truncate whitespace-nowrap">
                        {place.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate whitespace-nowrap">
                        {place.formattedAddress}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="p-6 text-center text-sm text-gray-500">
              {isLoading ? "Searching..." : "No places found"}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

