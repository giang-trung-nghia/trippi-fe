# Google Maps Integration Guide for Trippi

## Overview

Your travel planning app needs comprehensive geolocation services for trip planning, place discovery, cost estimation, and itinerary management. Google Maps Platform offers several APIs that align perfectly with your requirements.

## Relevant Google Maps APIs for Your App

### 🗺️ Core APIs (Essential)

#### 1. **Maps JavaScript API** - Primary Map Display
**Purpose**: Render interactive maps in your web application

**Use Cases in Trippi:**
- Display trip destination on map
- Show all places in itinerary with markers
- Draw routes between locations
- Interactive map for place selection
- Day-by-day route visualization

**Pricing**: $7 per 1,000 map loads (first 28,000 free monthly)

**Features You'll Use:**
- Custom markers for each place
- Info windows for place details
- Drawing routes between locations
- Clustering markers when zoomed out
- Custom map styling

---

#### 2. **Places API** - Place Information & Search
**Purpose**: Search for places, get place details, photos, and reviews

**Use Cases in Trippi:**
- Search restaurants, hotels, attractions
- Get place details (address, phone, website, hours)
- Display place photos
- Show Google ratings and reviews
- Autocomplete when adding places to trip
- Get place categories (restaurant, museum, park)

**Key Endpoints:**
- **Place Search**: Find places by text query or nearby
- **Place Details**: Get comprehensive information
- **Place Photos**: Retrieve place images
- **Place Autocomplete**: Search suggestions as user types
- **Find Place**: Search by phone number or address

**Pricing**: 
- Place Search: $32 per 1,000 requests
- Place Details: $17 per 1,000 requests
- Place Autocomplete: $2.83 per 1,000 requests

---

#### 3. **Geocoding API** - Convert Addresses to Coordinates
**Purpose**: Convert addresses to lat/lng and vice versa

**Use Cases in Trippi:**
- Convert user-entered addresses to map coordinates
- Get formatted address from coordinates
- Validate addresses before saving
- Display address when user clicks on map

**Pricing**: $5 per 1,000 requests

---

#### 4. **Directions API** - Route Planning
**Purpose**: Get directions between multiple locations

**Use Cases in Trippi:**
- Calculate routes between itinerary locations
- Show travel time between places
- Estimate travel distance
- Support different travel modes (driving, walking, transit)
- Optimize route order for day planning

**Pricing**: $5 per 1,000 requests

**Travel Modes:**
- Driving
- Walking
- Bicycling
- Transit (public transportation)

---

### 💰 Cost Estimation APIs (Important)

#### 5. **Distance Matrix API** - Travel Time & Distance
**Purpose**: Calculate travel time and distance between multiple origins and destinations

**Use Cases in Trippi:**
- Estimate travel time between all places in itinerary
- Calculate total trip distance
- Help optimize day schedule based on travel time
- Show "Is this realistic?" for day plans

**Pricing**: $5 per 1,000 elements (origin-destination pairs)

**Example:**
```
Origin: Hotel → Destinations: [Restaurant, Museum, Park]
= 3 elements
```

---

#### 6. **Time Zone API** - Handle Different Time Zones
**Purpose**: Get time zone for any location

**Use Cases in Trippi:**
- Display local time at destination
- Handle multi-city trips across time zones
- Schedule reminders in local time
- Show "What time is it there?" feature

**Pricing**: $5 per 1,000 requests

---

### 🎯 Enhanced Features (Nice to Have)

#### 7. **Places API - Nearby Search**
**Purpose**: Find places near a specific location

**Use Cases in Trippi:**
- "Find restaurants near my hotel"
- "What's nearby?" feature
- Suggest places to visit based on current location
- Find ATMs, gas stations, pharmacies nearby

---

#### 8. **Places API - Text Search**
**Purpose**: Search places by text query

**Use Cases in Trippi:**
- "Find Eiffel Tower in Paris"
- Search attractions by name
- Find specific restaurants or hotels
- Search by category + location

---

#### 9. **Static Maps API** - Generate Map Images
**Purpose**: Create static map images without JavaScript

**Use Cases in Trippi:**
- Trip preview images
- Share trip maps on social media
- Email notifications with map snapshot
- PDF trip itinerary export

**Pricing**: $2 per 1,000 requests

---

### 📊 Analytics & Social Features

#### 10. **Geolocation API** (Browser API, Free)
**Purpose**: Get user's current location

**Use Cases in Trippi:**
- "Plan trip from my location"
- Show nearby trips (templates)
- "Find trips near me"
- Auto-detect home city

---

## Recommended API Combination for Trippi

### Phase 1 (MVP) - Essential
```
✅ Maps JavaScript API      - Display maps
✅ Places API (Autocomplete) - Search places
✅ Places API (Details)      - Get place info
✅ Geocoding API            - Address validation
✅ Directions API           - Route planning
```

**Estimated Cost for 10,000 trips/month:**
- Maps: $700
- Places Autocomplete: $28
- Places Details: $170
- Geocoding: $50
- Directions: $50
**Total: ~$1,000/month** (after free tier)

### Phase 2 - Enhanced Features
```
✅ Distance Matrix API      - Time/distance calculation
✅ Time Zone API           - Multi-timezone support
✅ Nearby Search           - Discover places
✅ Static Maps API         - Trip previews
```

---

## Step-by-Step Implementation Guide

### Step 1: Setup Google Cloud Project

1. **Create Google Cloud Account**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Sign in with Google account
   - Enable billing (required even for free tier)

2. **Create New Project**
   ```
   Project Name: Trippi
   Project ID: trippi-[random]
   ```

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Search and enable:
     - Maps JavaScript API
     - Places API
     - Geocoding API
     - Directions API
     - Distance Matrix API

4. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
   - **Important**: Restrict your API key!

5. **Restrict API Key (Security)**
   - Click on your API key
   - Under "Application restrictions":
     - Choose "HTTP referrers"
     - Add: `localhost:3000/*` (development)
     - Add: `yourdomain.com/*` (production)
   - Under "API restrictions":
     - Choose "Restrict key"
     - Select enabled APIs only

---

### Step 2: Install Required Packages

```bash
# Google Maps React wrapper
npm install @vis.gl/react-google-maps

# Or use official library
npm install @googlemaps/js-api-loader

# Type definitions
npm install -D @types/google.maps

# For date/time handling with timezones
npm install date-fns-tz
```

---

### Step 3: Environment Configuration

Create `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Add to `.gitignore`:
```
.env.local
.env*.local
```

---

### Step 4: Create Google Maps Provider

**File:** `src/lib/google-maps-loader.ts`
```typescript
import { Loader } from "@googlemaps/js-api-loader"

let loaderInstance: Loader | null = null

export const getGoogleMapsLoader = () => {
  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["places", "geometry", "drawing"],
    })
  }
  return loaderInstance
}

export const loadGoogleMaps = async () => {
  const loader = getGoogleMapsLoader()
  return await loader.load()
}
```

---

### Step 5: Create Map Component

**File:** `src/components/organisms/trip-map.tsx`
```typescript
"use client"

import { useEffect, useRef, useState } from "react"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

type TripMapProps = {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{
    id: string
    position: { lat: number; lng: number }
    title: string
  }>
  className?: string
}

export function TripMap({ 
  center = { lat: 35.6762, lng: 139.6503 }, // Tokyo default
  zoom = 12,
  markers = [],
  className = "w-full h-96"
}: TripMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load Google Maps
  useEffect(() => {
    loadGoogleMaps()
      .then(() => setIsLoaded(true))
      .catch((error) => console.error("Failed to load Google Maps:", error))
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return

    const newMap = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    setMap(newMap)
  }, [isLoaded, center, zoom, map])

  // Add markers
  useEffect(() => {
    if (!map || !markers.length) return

    const googleMarkers = markers.map(marker => 
      new google.maps.Marker({
        position: marker.position,
        map,
        title: marker.title,
      })
    )

    return () => {
      googleMarkers.forEach(marker => marker.setMap(null))
    }
  }, [map, markers])

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  )
}
```

---

### Step 6: Create Place Search Component

**File:** `src/features/trip/components/place-search.tsx`
```typescript
"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

type Place = {
  placeId: string
  name: string
  address: string
  location: { lat: number; lng: number }
  types: string[]
}

type PlaceSearchProps = {
  onPlaceSelect: (place: Place) => void
  placeholder?: string
}

export function PlaceSearch({ 
  onPlaceSelect, 
  placeholder = "Search for a place..." 
}: PlaceSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [autocomplete, setAutocomplete] = 
    useState<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (!inputRef.current) return

      const auto = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ["place_id", "name", "formatted_address", "geometry", "types"],
        types: ["establishment", "geocode"],
      })

      auto.addListener("place_changed", () => {
        const place = auto.getPlace()
        
        if (!place.geometry?.location) return

        onPlaceSelect({
          placeId: place.place_id!,
          name: place.name!,
          address: place.formatted_address!,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          types: place.types || [],
        })
      })

      setAutocomplete(auto)
    })
  }, [onPlaceSelect])

  return <Input ref={inputRef} placeholder={placeholder} />
}
```

---

### Step 7: Get Place Details

**File:** `src/services/google-maps/places.ts`
```typescript
export type PlaceDetails = {
  placeId: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  userRatingsTotal?: number
  priceLevel?: number
  photos?: string[]
  openingHours?: {
    isOpen: boolean
    weekdayText: string[]
  }
  location: { lat: number; lng: number }
}

export const getPlaceDetails = async (
  placeId: string
): Promise<PlaceDetails | null> => {
  const { PlacesService } = await google.maps.importLibrary("places")
  
  return new Promise((resolve) => {
    const service = new PlacesService(document.createElement("div"))
    
    service.getDetails(
      {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "website",
          "rating",
          "user_ratings_total",
          "price_level",
          "photos",
          "opening_hours",
          "geometry",
        ],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve({
            placeId,
            name: place.name!,
            address: place.formatted_address!,
            phone: place.formatted_phone_number,
            website: place.website,
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            priceLevel: place.price_level,
            photos: place.photos?.map(photo => photo.getUrl()) || [],
            openingHours: place.opening_hours
              ? {
                  isOpen: place.opening_hours.isOpen() || false,
                  weekdayText: place.opening_hours.weekday_text || [],
                }
              : undefined,
            location: {
              lat: place.geometry!.location!.lat(),
              lng: place.geometry!.location!.lng(),
            },
          })
        } else {
          resolve(null)
        }
      }
    )
  })
}
```

---

### Step 8: Calculate Route & Distance

**File:** `src/services/google-maps/directions.ts`
```typescript
export type RouteInfo = {
  distance: string // "10.5 km"
  duration: string // "25 mins"
  steps: Array<{
    instruction: string
    distance: string
    duration: string
  }>
}

export const calculateRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
): Promise<RouteInfo | null> => {
  const { DirectionsService } = await google.maps.importLibrary("routes")
  
  const service = new DirectionsService()
  
  try {
    const result = await service.route({
      origin,
      destination,
      travelMode,
    })

    if (result.routes[0]) {
      const route = result.routes[0]
      const leg = route.legs[0]

      return {
        distance: leg.distance!.text,
        duration: leg.duration!.text,
        steps: leg.steps!.map(step => ({
          instruction: step.instructions,
          distance: step.distance!.text,
          duration: step.duration!.text,
        })),
      }
    }
  } catch (error) {
    console.error("Error calculating route:", error)
  }

  return null
}
```

---

## Feature Implementation Examples

### 1. Day-by-Day Itinerary Map

```typescript
// Show all places for a specific day with numbered markers
const DayItineraryMap = ({ dayPlaces }) => {
  const markers = dayPlaces.map((place, index) => ({
    id: place.id,
    position: place.location,
    title: `${index + 1}. ${place.name}`,
    label: (index + 1).toString(),
  }))

  return <TripMap markers={markers} />
}
```

### 2. Travel Time Between Places

```typescript
const calculateDayTravelTime = async (places) => {
  let totalMinutes = 0
  
  for (let i = 0; i < places.length - 1; i++) {
    const route = await calculateRoute(
      places[i].location,
      places[i + 1].location
    )
    
    if (route) {
      // Parse "25 mins" to minutes
      totalMinutes += parseInt(route.duration)
    }
  }
  
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
}
```

### 3. Cost Estimation Based on Distance

```typescript
const estimateTravelCost = (distance: string, mode: 'driving' | 'transit') => {
  const km = parseFloat(distance) // Extract km from "10.5 km"
  
  const rates = {
    driving: 0.5, // $0.50 per km (gas + parking)
    transit: 0.15, // $0.15 per km (public transport)
  }
  
  return km * rates[mode]
}
```

### 4. Nearby Place Suggestions

```typescript
export const findNearbyPlaces = async (
  location: { lat: number; lng: number },
  type: string,
  radius: number = 1000
) => {
  const { PlacesService } = await google.maps.importLibrary("places")
  
  return new Promise((resolve) => {
    const service = new PlacesService(document.createElement("div"))
    
    service.nearbySearch(
      {
        location,
        radius,
        type, // 'restaurant', 'hotel', 'tourist_attraction'
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results)
        } else {
          resolve([])
        }
      }
    )
  })
}
```

---

## Best Practices

### 1. **API Key Security**
```typescript
// ❌ Bad: Exposing API key in client
const apiKey = "AIzaSyB..."

// ✅ Good: Use environment variables
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

// ✅ Better: Backend proxy for sensitive operations
// Frontend → Your Backend → Google Maps API
```

### 2. **Optimize API Calls**
```typescript
// Cache place details to avoid repeated calls
const placeCache = new Map<string, PlaceDetails>()

export const getPlaceDetailsCached = async (placeId: string) => {
  if (placeCache.has(placeId)) {
    return placeCache.get(placeId)!
  }
  
  const details = await getPlaceDetails(placeId)
  if (details) {
    placeCache.set(placeId, details)
  }
  
  return details
}
```

### 3. **Error Handling**
```typescript
try {
  const route = await calculateRoute(origin, destination)
} catch (error) {
  // Show user-friendly message
  toast.error("Unable to calculate route. Please try again.")
  // Log for debugging
  console.error("Route calculation failed:", error)
}
```

### 4. **Loading States**
```typescript
const [isLoadingMap, setIsLoadingMap] = useState(true)

<TripMap 
  onLoad={() => setIsLoadingMap(false)}
  fallback={<Skeleton className="w-full h-96" />}
/>
```

---

## Cost Optimization Tips

### 1. **Use Autocomplete Instead of Search**
- Autocomplete: $2.83 per 1,000
- Place Search: $32 per 1,000
- **Savings: 91%**

### 2. **Limit Place Details Fields**
```typescript
// Only request fields you need
fields: ["name", "formatted_address", "geometry"]
// Instead of all fields
```

### 3. **Cache Frequently Accessed Data**
- Cache place details for 24 hours
- Cache static map images
- Cache route calculations

### 4. **Use Static Maps for Previews**
```typescript
// Generate static map image URL (cheaper)
const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=400x300&key=${apiKey}`

// Use for:
// - Trip thumbnails
// - Email notifications
// - Social media shares
```

---

## Next Steps

1. ✅ Set up Google Cloud Project
2. ✅ Get API key and configure restrictions
3. ✅ Install required packages
4. ✅ Create map loader utility
5. ✅ Build basic map component
6. ✅ Implement place search
7. ✅ Add place details retrieval
8. ✅ Calculate routes and distances
9. Test with sample trips
10. Monitor API usage and costs

---

## Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Directions API Documentation](https://developers.google.com/maps/documentation/directions)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [Code Samples](https://github.com/googlemaps/js-samples)

---

**Estimated Development Time:**
- Basic map integration: 2-3 days
- Place search & details: 2-3 days
- Route calculation: 1-2 days
- Cost estimation features: 1-2 days
- UI polish & optimization: 2-3 days

**Total: ~2 weeks for full Google Maps integration**

