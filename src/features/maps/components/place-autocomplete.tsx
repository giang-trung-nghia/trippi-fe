"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  const [isExpanded, setIsExpanded] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
      console.log("data", data)

      if (data.places && data.places.length > 0) {
        const formattedResults: PlaceResult[] = data.places.map((place) => ({
          placeId: place.id,
          name: place.displayName.text,
          formattedAddress: place.formattedAddress,
          location: {
            lat: place.location.latitude,
            lng: place.location.longitude,
          },
          photos: place.photos?.map((photo) => ({
            name: photo.name,
            photoUri: photo.flagContentUri,
            widthPx: photo.widthPx,
            heightPx: photo.heightPx,
          })),
          viewport: place.viewport
            ? {
                northeast: {
                  lat: place.viewport.high.lat,
                  lng: place.viewport.high.lng,
                },
                southwest: {
                  lat: place.viewport.low.lat,
                  lng: place.viewport.low.lng,
                },
              }
            : undefined,
          types: place.types || [],
          rating: place.rating,
          userRatingsTotal: place.userRatingCount,
          phoneNumber: place.nationalPhoneNumber || place.internationalPhoneNumber,
          website: place.websiteUri,
        }))
        setResults(formattedResults)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error("Error searching places:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input change with debounce (0.2s)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(query)
    }, 200)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query])

  // Handle click outside to collapse search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false) // Collapse to icon
        setShowResults(false) // Close results
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Immediately trigger search on Enter
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      performSearch(query)
    }
  }

  const handleResultClick = (place: PlaceResult) => {
    if (onPlaceInfo) {
      onPlaceInfo(place)
      console.log("placeinfo", place)
    } else {
      onPlaceSelect(place)
    }
    setShowResults(false)
    // Keep search text, don't clear it
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  const handleExpand = () => {
    setIsExpanded(true)
  }

  // Collapsed state - just an icon button
  if (!isExpanded) {
    return (
      <div className={cn("absolute top-4 left-4 z-10", className)}>
        <Button
          onClick={handleExpand}
          size="sm"
          className="h-9 w-9 rounded-full shadow-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
          variant="outline"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute top-4 left-4 z-10 w-full max-w-sm animate-in slide-in-from-left-2 duration-200",
        className
      )}
    >
      <div className="relative bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Search Input */}
        <div className="flex items-center gap-2 px-3 py-2">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-7 text-sm"
            autoFocus
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin shrink-0" />
          )}
          {query && !isLoading && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-6 w-6 shrink-0"
              title="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Results */}
        {showResults && results.length > 0 && (
          <div className="border-t border-gray-200">
            <ScrollArea className="max-h-[250px]">
              <div className="py-1">
                {results.map((place) => (
                  <button
                    key={place.placeId}
                    onClick={() => handleResultClick(place)}
                    className="w-full px-3 py-2 hover:bg-gray-50 transition-colors text-left flex items-start gap-2 group"
                  >
                    <MapPin className="h-4 w-4 text-gray-400 group-hover:text-blue-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate overflow-hidden whitespace-nowrap">
                        {place.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate overflow-hidden whitespace-nowrap">
                        {place.formattedAddress}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* No Results */}
        {showResults && !isLoading && query && results.length === 0 && (
          <div className="border-t border-gray-200 px-3 py-4 text-center text-xs text-gray-500">
            No places found. Try a different search term.
          </div>
        )}
      </div>
    </div>
  )
}
