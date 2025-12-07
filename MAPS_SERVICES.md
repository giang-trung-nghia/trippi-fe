# 🔧 Maps Services & UI Updates

## ✅ Changes Completed

### 1. **Legend Button Styling - FIXED** ✅

**Before**:
```typescript
<Button variant="ghost" size="sm" onClick={onToggleLegend}>
  <Layers className="h-4 w-4" />
  <span className="text-xs">Legend</span>
</Button>
```

**After**:
```typescript
<Button
  variant={showLegend ? "default" : "ghost"}
  size="sm"
  onClick={onToggleLegend}
  className={cn(
    "gap-2",
    showLegend && "bg-blue-600 hover:bg-blue-700"
  )}
  title="Toggle legend"
>
  <Layers className="h-4 w-4" />
  <span className="text-xs">Legend</span>
</Button>
```

**Result**: Legend button now shows blue background when enabled, just like the Routes button! ✅

### 2. **Dual Axios Clients - CREATED** ✅

Created two separate axios clients for different purposes:

#### **Backend API Client** (existing)
```typescript
// src/configs/axios.ts
export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Has auth interceptors
  // Handles token refresh
  // Backend-specific logic
})
```

#### **Google Maps API Clients** (new)
```typescript
// src/configs/google-maps-axios.ts

// Routes API client
export const routesApiClient = axios.create({
  baseURL: "https://routes.googleapis.com",
  headers: {
    "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
  },
})

// Places API client
export const placesApiClient = axios.create({
  baseURL: "https://places.googleapis.com/v1",
  headers: {
    "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
  },
})

// Geocoding API client
export const geocodingApiClient = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api",
})
```

### 3. **Maps Services - CREATED** ✅

Created comprehensive service layer in `src/services/maps/index.ts`:

#### **Routes API Services**

```typescript
// Calculate single route
await calculateRoute(waypoints, {
  travelMode: "DRIVE",
  routingPreference: "TRAFFIC_AWARE",
  avoidTolls: false,
  avoidHighways: false,
})

// Calculate alternative routes
await calculateAlternativeRoutes(waypoints, options)
```

#### **Places API Services**

```typescript
// Search for places
await searchPlaces("restaurants in Hanoi", {
  location: { lat: 21.0285, lng: 105.8542 },
  radius: 5000,
  maxResultCount: 10,
})

// Get place details
await getPlaceDetails(placeId)
```

#### **Geocoding Services**

```typescript
// Address to coordinates
await geocodeAddress("Ha Giang, Vietnam")

// Coordinates to address
await reverseGeocode(22.8237, 104.9784)
```

#### **Helper Functions**

```typescript
// Decode polyline
const coordinates = decodePolyline(encodedPolyline)

// Format distance
formatDistance(98500) // "98.5 km"

// Format duration
formatDuration(13500) // "3h 45m"
```

## 📁 New File Structure

```
src/
├── configs/
│   ├── axios.ts                    # Backend API client (existing)
│   └── google-maps-axios.ts        # Google Maps API clients (NEW)
│
└── services/
    ├── maps/
    │   └── index.ts                # Maps services (NEW)
    ├── trips/
    │   └── index.ts                # Trip services (existing)
    └── auth/
        └── index.ts                # Auth services (existing)
```

## 🎯 Usage Examples

### Use Backend API
```typescript
import { httpClient } from "@/configs/axios"

// Calls your backend
const trips = await httpClient.get("/trips")
```

### Use Google Maps API
```typescript
import { calculateRoute, searchPlaces } from "@/services/maps"

// Calls Google Maps API
const route = await calculateRoute(waypoints)
const places = await searchPlaces("hotels")
```

## 🔧 Technical Details

### Why Separate Clients?

**Backend Client** (`httpClient`):
- ✅ Auth token handling
- ✅ Token refresh logic
- ✅ Backend-specific headers
- ✅ Redirects to login on 401

**Google Maps Clients**:
- ✅ Google API key in headers
- ✅ No auth token needed
- ✅ Google-specific error handling
- ✅ Different base URLs

### Benefits

1. **Separation of Concerns**
   - Backend logic separate from Google API logic
   - No auth interceptors on Google API calls
   - Clean, focused clients

2. **Type Safety**
   - Typed request/response models
   - Autocomplete support
   - Compile-time checks

3. **Maintainability**
   - Single source of truth for API calls
   - Easy to update
   - Consistent error handling

4. **Testability**
   - Easy to mock services
   - Unit test friendly
   - Integration test ready

## 📊 Service Layer Architecture

```
Component
   ↓
Service (src/services/maps/index.ts)
   ↓
Axios Client (src/configs/google-maps-axios.ts)
   ↓
Google Maps API
```

### Before (Direct API Calls)
```typescript
// In component - BAD
const response = await fetch("https://routes.googleapis.com/...", {
  method: "POST",
  headers: {
    "X-Goog-Api-Key": apiKey,
  },
  body: JSON.stringify(requestBody),
})
```

### After (Service Layer)
```typescript
// In component - GOOD
const route = await calculateRoute(waypoints, options)
```

## 🎨 Updated Components

### RoutePolyline Component

**Before**:
```typescript
// Direct fetch call
const response = await fetch(API_CONFIG.ROUTES_API_URL, {
  method: "POST",
  headers: { ... },
  body: JSON.stringify(requestBody),
})
```

**After**:
```typescript
// Using service
import { calculateRoute, decodePolyline, formatDistance } from "@/services/maps"

const data = await calculateRoute(path, {
  travelMode: "DRIVE",
  routingPreference: "TRAFFIC_AWARE",
})
```

**Benefits**:
- ✅ Cleaner code
- ✅ Reusable logic
- ✅ Type-safe
- ✅ Easy to test

## 🧪 Testing

### Test Legend Button
1. Open `/maps`
2. Click "Legend" button
3. ✅ Button turns blue (enabled)
4. ✅ Legend appears
5. Click again
6. ✅ Button turns gray (disabled)
7. ✅ Legend disappears

### Test Routes Service
1. Click "Day 1"
2. Enable Routes
3. ✅ Route calculates via service
4. ✅ Distance/duration display
5. ✅ No console errors

### Test Error Handling
1. Disconnect internet
2. Try to calculate route
3. ✅ Fallback to simple polyline
4. ✅ Graceful error handling

## 📚 API Reference

### Routes API

```typescript
calculateRoute(
  waypoints: google.maps.LatLngLiteral[],
  options?: {
    travelMode?: "DRIVE" | "BICYCLE" | "WALK" | "TWO_WHEELER"
    routingPreference?: "TRAFFIC_AWARE" | "TRAFFIC_AWARE_OPTIMAL" | "TRAFFIC_UNAWARE"
    avoidTolls?: boolean
    avoidHighways?: boolean
    avoidFerries?: boolean
  }
): Promise<RoutesAPIResponse>
```

### Places API

```typescript
searchPlaces(
  query: string,
  options?: {
    location?: google.maps.LatLngLiteral
    radius?: number
    maxResultCount?: number
  }
): Promise<PlaceSearchResult>
```

### Geocoding API

```typescript
geocodeAddress(address: string): Promise<GeocodingResult>
reverseGeocode(lat: number, lng: number): Promise<GeocodingResult>
```

## 🔮 Future Enhancements

### Easy to Add

1. **Distance Matrix API**
```typescript
export const calculateDistanceMatrix = async (
  origins: google.maps.LatLngLiteral[],
  destinations: google.maps.LatLngLiteral[]
) => {
  // Implementation
}
```

2. **Elevation API**
```typescript
export const getElevation = async (
  locations: google.maps.LatLngLiteral[]
) => {
  // Implementation
}
```

3. **Timezone API**
```typescript
export const getTimezone = async (
  location: google.maps.LatLngLiteral,
  timestamp: number
) => {
  // Implementation
}
```

## 💡 Best Practices

### Use Services, Not Direct Calls

❌ **Don't do this**:
```typescript
const response = await fetch("https://routes.googleapis.com/...")
```

✅ **Do this**:
```typescript
import { calculateRoute } from "@/services/maps"
const route = await calculateRoute(waypoints)
```

### Handle Errors Properly

```typescript
try {
  const route = await calculateRoute(waypoints)
  // Use route data
} catch (error) {
  console.error("Route calculation failed:", error)
  // Show error to user
  // Fall back to alternative
}
```

### Type Everything

```typescript
import type { RoutesAPIResponse } from "@/features/maps/types"

const route: RoutesAPIResponse = await calculateRoute(waypoints)
```

## ✅ Summary

**UI Updates**:
- ✅ Legend button styled like Routes button
- ✅ Shows blue background when enabled
- ✅ Consistent UI across controls

**Architecture**:
- ✅ Dual axios clients (backend + Google Maps)
- ✅ Service layer for all API calls
- ✅ Separation of concerns
- ✅ Type-safe implementations

**Benefits**:
- 🎯 Cleaner code
- 🔧 Easier maintenance
- 🧪 More testable
- 📦 Better organization
- 🚀 Ready for expansion

**Your maps now have professional service architecture!** 🗺️✨

