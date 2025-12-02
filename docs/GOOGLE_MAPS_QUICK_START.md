# Google Maps Quick Start for Trippi

## TL;DR - What You Need

### Essential Google Maps APIs
1. **Maps JavaScript API** - Display maps
2. **Places API** - Search & get place information
3. **Distance Matrix API** - Calculate travel time/distance
4. **Directions API** - Show routes

### Estimated Cost
- **Free Tier**: $200/month credit
- **Your Estimated Usage**: $100-$200/month
- **Net Cost**: $0-$50/month initially

---

## Quick Setup (30 minutes)

### Step 1: Google Cloud Console (10 min)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project "Trippi"
3. Enable billing (required for API access)
4. Go to "APIs & Services" → "Library"
5. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Distance Matrix API
   - Directions API
   - Geocoding API

### Step 2: Get API Key (5 min)
1. Go to "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the key
4. Click "Restrict Key":
   - HTTP referrers: Add `localhost:3000/*` and your domain
   - API restrictions: Select only the enabled APIs

### Step 3: Install Packages (5 min)
```bash
npm install @googlemaps/js-api-loader
npm install -D @types/google.maps
```

### Step 4: Add Environment Variable (2 min)
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Step 5: Create Map Loader (5 min)
Create `src/lib/google-maps-loader.ts`:
```typescript
import { Loader } from "@googlemaps/js-api-loader"

let loader: Loader | null = null

export const loadGoogleMaps = async () => {
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["places", "geometry"],
    })
  }
  return await loader.load()
}
```

### Step 6: Test with Simple Map (3 min)
```typescript
"use client"

import { useEffect, useRef } from "react"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

export function TestMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (mapRef.current) {
        new google.maps.Map(mapRef.current, {
          center: { lat: 35.6762, lng: 139.6503 }, // Tokyo
          zoom: 12,
        })
      }
    })
  }, [])

  return <div ref={mapRef} className="w-full h-96" />
}
```

Done! You have Google Maps working. 🎉

---

## Common Use Cases (Copy-Paste Ready)

### 1. Place Search with Autocomplete
```typescript
"use client"

import { useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { loadGoogleMaps } from "@/lib/google-maps-loader"

export function PlaceSearch({ onSelect }) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadGoogleMaps().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current!,
        { fields: ["place_id", "name", "formatted_address", "geometry"] }
      )

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace()
        onSelect({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        })
      })
    })
  }, [onSelect])

  return <Input ref={inputRef} placeholder="Search places..." />
}
```

### 2. Calculate Distance Between Places
```typescript
export async function getDistance(origin, destination) {
  await loadGoogleMaps()
  
  const service = new google.maps.DistanceMatrixService()
  
  const result = await service.getDistanceMatrix({
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
  })

  const element = result.rows[0].elements[0]
  
  return {
    distance: element.distance.text, // "10.5 km"
    duration: element.duration.text, // "25 mins"
    distanceValue: element.distance.value, // 10500 (meters)
    durationValue: element.duration.value, // 1500 (seconds)
  }
}
```

### 3. Get Place Details
```typescript
export async function getPlaceInfo(placeId: string) {
  await loadGoogleMaps()
  
  const service = new google.maps.places.PlacesService(
    document.createElement("div")
  )

  return new Promise((resolve) => {
    service.getDetails(
      {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "rating",
          "photos",
          "price_level",
          "opening_hours",
        ],
      },
      (place) => resolve(place)
    )
  })
}
```

### 4. Display Route on Map
```typescript
export async function showRoute(map, origin, destination) {
  await loadGoogleMaps()
  
  const directionsService = new google.maps.DirectionsService()
  const directionsRenderer = new google.maps.DirectionsRenderer()
  
  directionsRenderer.setMap(map)

  const result = await directionsService.route({
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING,
  })

  directionsRenderer.setDirections(result)
  
  return result.routes[0].legs[0]
}
```

---

## Your App's Features → Implementation

### Trip Planning Page
```typescript
import { TripMap } from "@/components/organisms/trip-map"
import { PlaceSearch } from "@/features/trip/components/place-search"

export default function PlanTripPage() {
  const [places, setPlaces] = useState([])

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left: Form */}
      <div>
        <h2>Add Places</h2>
        <PlaceSearch onSelect={(place) => setPlaces([...places, place])} />
        
        <div>
          {places.map((place, i) => (
            <div key={i}>
              {i + 1}. {place.name}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Map */}
      <TripMap places={places} />
    </div>
  )
}
```

### Day Itinerary with Travel Times
```typescript
export function DayItinerary({ day }) {
  const [travelTimes, setTravelTimes] = useState([])

  useEffect(() => {
    calculateAllTravelTimes(day.places).then(setTravelTimes)
  }, [day.places])

  return (
    <div>
      {day.places.map((place, i) => (
        <div key={i}>
          <div>📍 {place.name}</div>
          <div>⏱️ {place.duration} minutes</div>
          
          {i < day.places.length - 1 && (
            <div>
              🚗 {travelTimes[i]?.duration} to next place
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

async function calculateAllTravelTimes(places) {
  const times = []
  
  for (let i = 0; i < places.length - 1; i++) {
    const distance = await getDistance(
      places[i].location,
      places[i + 1].location
    )
    times.push(distance)
  }
  
  return times
}
```

### Cost Estimator
```typescript
export function CostEstimator({ trip }) {
  const [costs, setCosts] = useState(null)

  useEffect(() => {
    calculateCosts(trip).then(setCosts)
  }, [trip])

  return (
    <div className="border rounded p-4">
      <h3>Estimated Costs</h3>
      
      {costs && (
        <>
          <div>Transport: ${costs.transport}</div>
          <div>Food: ${costs.food}</div>
          <div>Activities: ${costs.activities}</div>
          <div className="font-bold">Total: ${costs.total}</div>
        </>
      )}
    </div>
  )
}

async function calculateCosts(trip) {
  // Calculate transport costs
  let totalDistance = 0
  for (let day of trip.days) {
    for (let i = 0; i < day.places.length - 1; i++) {
      const distance = await getDistance(
        day.places[i].location,
        day.places[i + 1].location
      )
      totalDistance += distance.distanceValue / 1000 // km
    }
  }
  
  const transportCost = totalDistance * 0.5 // $0.50 per km
  
  // Food costs from Google price levels
  const foodCost = trip.days
    .flatMap(d => d.places)
    .filter(p => p.type.includes('restaurant'))
    .reduce((sum, p) => sum + estimateMealCost(p.priceLevel), 0)

  return {
    transport: transportCost,
    food: foodCost,
    activities: trip.activities * 30, // $30 per activity
    total: transportCost + foodCost + (trip.activities * 30),
  }
}

function estimateMealCost(priceLevel) {
  const prices = [0, 15, 35, 60, 100]
  return prices[priceLevel] || 35
}
```

---

## Folder Structure

```
src/
├── lib/
│   └── google-maps-loader.ts        # Map loader utility
│
├── services/
│   └── google-maps/
│       ├── places.ts                # Place search & details
│       ├── directions.ts            # Route calculation
│       └── distance.ts              # Distance/time calculation
│
├── components/
│   └── organisms/
│       ├── trip-map.tsx             # Main map component
│       └── place-card.tsx           # Display place info
│
└── features/
    └── trip/
        └── components/
            ├── place-search.tsx     # Search input
            ├── day-planner.tsx      # Day itinerary
            └── cost-estimator.tsx   # Cost calculator
```

---

## Testing Checklist

- [ ] Map loads without errors
- [ ] Place search shows suggestions
- [ ] Selecting place gets details
- [ ] Map displays markers for places
- [ ] Distance calculation works
- [ ] Route displays on map
- [ ] Cost estimation calculates
- [ ] API key is restricted
- [ ] Environment variables work in production

---

## Common Issues & Solutions

### Issue: "This API project is not authorized..."
**Solution:** Make sure you enabled the API in Google Cloud Console

### Issue: "RefererNotAllowedMapError"
**Solution:** Add your domain to API key restrictions

### Issue: Map not displaying
```typescript
// Make sure div has explicit height
<div className="h-96 w-full"> {/* ✅ Has height */}
  <Map />
</div>
```

### Issue: "Cannot read properties of undefined"
```typescript
// Always check if Google Maps loaded
if (typeof google === 'undefined') {
  return <div>Loading map...</div>
}
```

---

## Next Steps

1. ✅ Complete setup (above)
2. ✅ Test with sample data
3. Create trip planning UI
4. Integrate with your trip database
5. Add cost estimation
6. Implement bill splitting
7. Build template sharing
8. Monitor API usage
9. Optimize costs

---

## Resources

- [Full Implementation Guide](./GOOGLE_MAPS_INTEGRATION_GUIDE.md)
- [Feature Mapping](./GOOGLE_MAPS_FEATURES_FOR_TRIPPI.md)
- [Google Maps Docs](https://developers.google.com/maps)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)

---

**Setup Time:** 30 minutes  
**Development Time:** 2-3 weeks for full integration  
**Monthly Cost:** ~$100-$200 (optimized)

You're ready to build an amazing travel planning app! 🚀✈️🗺️

