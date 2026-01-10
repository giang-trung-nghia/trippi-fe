# Trippi Maps Feature

This feature provides a comprehensive map interface for visualizing and managing trip locations using Google Maps Platform and @vis.gl/react-google-maps.

## Features Implemented

### 1. **Interactive Map Display**
- Full-screen map interface with gesture controls
- Responsive design that adapts to different screen sizes
- Smooth pan and zoom capabilities
- Custom map styling support

### 2. **Trip Visualization**
- **Markers**: Custom colored markers for different location types:
  - 🏨 Hotels (Purple)
  - 🍴 Meals/Restaurants (Orange)
  - 🚌 Transport (Cyan)
  - 🎯 Activities (Green)
  - 🏛️ Places/Attractions (Blue)
  - 📍 Other (Gray)
- **Numbered markers**: Each location shows its order in the itinerary
- **Info Windows**: Click markers to see detailed information about each location

### 3. **Route Visualization**
- Polyline routes connecting all locations in sequential order
- Toggle routes on/off
- Color-coded route paths
- Geodesic lines for accurate distance representation

### 4. **Sidebar Navigation**
- Trip overview with destination and dates
- Day-by-day breakdown
- Filter map by specific day or view all days
- Visual indicators for:
  - Number of locations per day
  - Estimated duration
  - Estimated cost
- Expandable day cards showing itinerary items

### 5. **Place Search**
- Google Places API integration
- Real-time place search with autocomplete
- Search results with place details:
  - Name
  - Address
  - Coordinates
  - Place ID
  - Types
- Add places directly to trip (foundation for integration)

### 6. **Map Controls**
- **Routes Toggle**: Show/hide connecting routes
- **Legend Toggle**: Display marker color legend
- **Fit Bounds**: Automatically zoom to show all locations
- **Location Counter**: Shows total number of markers

### 7. **Map Legend**
- Visual guide for marker colors
- Icon reference for each location type
- Toggle visibility

### 8. **Add Place Dialog**
- Modal dialog for searching and adding places
- Integrated place search
- User-friendly interface

## Components Structure

```
src/features/maps/
├── components/
│   ├── map-view.tsx          # Main map component with markers and routes
│   ├── map-sidebar.tsx        # Trip navigation sidebar
│   ├── map-controls.tsx       # Map control buttons
│   ├── map-legend.tsx         # Marker color legend
│   ├── route-polyline.tsx     # Route visualization
│   ├── place-search.tsx       # Google Places search
│   ├── add-place-dialog.tsx   # Add place modal
│   └── index.ts               # Component exports
```

## Setup Instructions

### 1. Environment Variables
Add your Google Maps API key to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 2. Required Google Maps APIs
Enable these APIs in your Google Cloud Console:
- Maps JavaScript API
- Places API
- Geocoding API (for future features)
- Routes API (for future distance/duration calculations)

### 3. Dependencies
Already installed:
- `@vis.gl/react-google-maps` - React wrapper for Google Maps
- `lucide-react` - Icons
- All shadcn/ui components used

## Usage

Navigate to `/maps` to view the maps page.

### Example: Viewing a Trip on Map

```tsx
import { MapView } from "@/features/maps/components"
import { Trip } from "@/types/trip"

function MyMapPage() {
  const trip: Trip = // ... your trip data
  
  return (
    <MapView 
      trip={trip} 
      selectedDayId={null} // null = show all days
    />
  )
}
```

### Example: Search for Places

```tsx
import { PlaceSearch } from "@/features/maps/components"

function MyComponent() {
  const handlePlaceSelect = (place) => {
    // Add place to your trip
  }
  
  return (
    <PlaceSearch 
      onPlaceSelect={handlePlaceSelect}
      placeholder="Search for restaurants, hotels..."
    />
  )
}
```

## Future Enhancements

### Planned Features
1. **Distance & Duration Calculation**
   - Use Google Routes API to calculate real travel time
   - Show estimated travel duration between locations
   - Display total trip distance

2. **Directions Integration**
   - Turn-by-turn directions
   - Multiple transport modes (driving, walking, transit)
   - Traffic-aware routing

3. **Street View Integration**
   - Preview locations in Street View
   - Virtual tour of trip locations

4. **Clustering**
   - Marker clustering for trips with many locations
   - Improved performance for dense areas

5. **Drawing Tools**
   - Draw custom areas or notes on map
   - Highlight regions of interest

6. **Offline Support**
   - Cache map tiles for offline viewing
   - Download trip maps for offline access

7. **Sharing**
   - Generate shareable map links
   - Export map as image/PDF

8. **Advanced Filters**
   - Filter by location type
   - Filter by cost range
   - Filter by time of day

9. **Real-time Collaboration**
   - See other users' cursors on map
   - Real-time marker updates

10. **Mobile Optimization**
    - Touch-optimized controls
    - Native-like gestures
    - GPS integration

## API Cost Optimization

The current implementation uses:
- **Maps JavaScript API**: Dynamic map loading (~$7 per 1000 loads)
- **Places API**: Search and details (~$17 per 1000 requests)

### Optimization Strategies
1. **Caching**: Store place details in local database
2. **Lazy Loading**: Only load map when needed
3. **Request Batching**: Combine multiple place requests
4. **Static Maps**: Use static maps for trip previews
5. **Session Tokens**: Use for autocomplete to reduce costs

## Troubleshooting

### Map doesn't load
- Check if `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
- Verify API key has Maps JavaScript API enabled
- Check browser console for API errors

### Markers not showing
- Verify trip items have `location` property with `lat` and `lng`
- Check if coordinates are valid (lat: -90 to 90, lng: -180 to 180)

### Routes not drawing
- Ensure at least 2 locations have coordinates
- Check if "Routes" toggle is enabled

### Search not working
- Verify Places API is enabled
- Check API key restrictions aren't blocking requests

## Technical Details

### Marker Icons
Markers use Google Maps Symbol markers with custom colors instead of custom HTML to improve performance and compatibility.

### Polyline Rendering
Routes use `google.maps.Polyline` with geodesic paths for accurate distance representation on curved earth surface.

### State Management
Currently uses local React state. For production, consider:
- Zustand for global map state
- React Query for API data caching
- Context API for shared map preferences

## Performance Considerations

- **Marker Optimization**: Using native Google Maps markers instead of custom HTML overlays
- **Memo Usage**: `useMemo` for expensive calculations (marker filtering, route coordinates)
- **Lazy Rendering**: Only render info windows when clicked
- **Efficient Re-renders**: Controlled map center/zoom updates

## Browser Support

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Credits

Built with:
- [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/)
- [Google Maps Platform](https://developers.google.com/maps)
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

