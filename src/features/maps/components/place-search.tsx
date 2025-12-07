"use client"

import { useState } from "react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { Search, MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { PlaceResult } from "@/features/maps/types"

type PlaceSearchProps = {
  onPlaceSelect: (place: PlaceResult) => void
  placeholder?: string
  className?: string
}

export function PlaceSearch({
  onPlaceSelect,
  placeholder = "Search for places...",
  className,
}: PlaceSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PlaceResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const places = useMapsLibrary("places")

  const handleSearch = async () => {
    if (!places || !query.trim()) return

    setIsLoading(true)
    setShowResults(true)

    try {
      const service = new places.PlacesService(
        document.createElement("div")
      )

      service.textSearch(
        {
          query: query,
        },
        (results, status) => {
          if (status === places.PlacesServiceStatus.OK && results) {
            const formattedResults: PlaceResult[] = results
              .slice(0, 5)
              .map((result) => ({
                placeId: result.place_id || "",
                name: result.name || "",
                formattedAddress: result.formatted_address || "",
                location: {
                  lat: result.geometry?.location?.lat() || 0,
                  lng: result.geometry?.location?.lng() || 0,
                },
                types: result.types,
              }))
            setResults(formattedResults)
          } else {
            setResults([])
          }
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.error("Search error:", error)
      setIsLoading(false)
    }
  }

  const handleSelectPlace = (place: PlaceResult) => {
    onPlaceSelect(place)
    setShowResults(false)
    setQuery("")
    setResults([])
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
            placeholder={placeholder}
            className="pl-9"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          size="default"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
          {results.length > 0 ? (
            <ScrollArea className="max-h-80">
              <div className="p-2">
                {results.map((place) => (
                  <button
                    key={place.placeId}
                    onClick={() => handleSelectPlace(place)}
                    className="flex w-full items-start gap-3 rounded-md p-3 text-left hover:bg-gray-100"
                  >
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">
                        {place.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
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

      {/* Backdrop to close results */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  )
}
