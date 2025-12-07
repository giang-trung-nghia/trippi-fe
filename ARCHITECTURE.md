# Trippi Maps - Component Architecture

## Visual Component Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                      /maps (Page Route)                          │
│                     src/app/maps/page.tsx                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              APIProvider (Google Maps)                      │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │                  Container Div                        │  │ │
│  │  │  ┌─────────────────┐  ┌──────────────────────────┐   │  │ │
│  │  │  │   MapSidebar    │  │       MapView            │   │  │ │
│  │  │  │  (Left Panel)   │  │   (Main Map Area)        │   │  │ │
│  │  │  │                 │  │  ┌────────────────────┐  │   │  │ │
│  │  │  │ • Trip Info     │  │  │   Google Map       │  │   │  │ │
│  │  │  │ • View All Btn  │  │  │                    │  │   │  │ │
│  │  │  │ • Day Cards     │  │  │  • Markers         │  │   │  │ │
│  │  │  │   - Day 1       │  │  │  • InfoWindows     │  │   │  │ │
│  │  │  │   - Day 2       │  │  │  • Polylines       │  │   │  │ │
│  │  │  │   - Day 3       │  │  │                    │  │   │  │ │
│  │  │  │ • Stats Footer  │  │  └────────────────────┘  │   │  │ │
│  │  │  │                 │  │  ┌────────────────────┐  │   │  │ │
│  │  │  └─────────────────┘  │  │  MapControls       │  │   │  │ │
│  │  │                       │  │  (Top Right)       │  │   │  │ │
│  │  │                       │  │  • Routes Toggle   │  │   │  │ │
│  │  │                       │  │  • Legend Toggle   │  │   │  │ │
│  │  │                       │  │  • MapTypeControl  │  │   │  │ │
│  │  │                       │  │  • Fit Bounds      │  │   │  │ │
│  │  │                       │  │  • Info Panel      │  │   │  │ │
│  │  │                       │  └────────────────────┘  │   │  │ │
│  │  │                       │  ┌────────────────────┐  │   │  │ │
│  │  │                       │  │   MapLegend        │  │   │  │ │
│  │  │                       │  │  (Bottom Right)    │  │   │  │ │
│  │  │                       │  │  • Color Guide     │  │   │  │ │
│  │  │                       │  └────────────────────┘  │   │  │ │
│  │  │                       │  ┌────────────────────┐  │   │  │ │
│  │  │                       │  │ AddPlaceDialog     │  │   │  │ │
│  │  │                       │  │  (Bottom Center)   │  │   │  │ │
│  │  │                       │  │  • Search Button   │  │   │  │ │
│  │  │                       │  │  • PlaceSearch     │  │   │  │ │
│  │  │                       │  └────────────────────┘  │   │  │ │
│  │  │                       └──────────────────────────┘   │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. **Page Level** (`src/app/maps/page.tsx`)
- Entry point for `/maps` route
- Manages global state (selectedTrip, selectedDayId)
- Wraps everything in APIProvider with Google Maps API key

### 2. **MapView** (`map-view.tsx`) - Main Map Component
**Purpose**: Renders the Google Map with markers, routes, and controls

**State**:
- `selectedMarker` - Currently clicked marker
- `showRoutes` - Toggle for route visibility
- `showLegend` - Toggle for legend visibility
- `mapType` - Current map type (roadmap/satellite/hybrid/terrain)
- `mapCenter` - Map center coordinates
- `mapZoom` - Current zoom level

**Children**:
- Map (from @vis.gl/react-google-maps)
- Marker components (for each location)
- InfoWindow (when marker clicked)
- RoutePolyline
- MapControls
- MapLegend
- AddPlaceDialog

**Data Flow**:
```
Trip Data → Filter by Day → Extract Locations → Render Markers
                                              → Generate Routes
```

### 3. **MapSidebar** (`map-sidebar.tsx`) - Navigation Panel
**Purpose**: Display trip info and day navigation

**Features**:
- Trip header (name, destination, dates)
- "View All Days" button
- Scrollable day list
- Day cards with:
  - Day number and date
  - Title and description
  - Location count, duration, cost
  - Expandable item list (when selected)
- Footer stats

**Interactions**:
- Click "View All Days" → Show all markers
- Click day card → Filter map to that day

### 4. **MapControls** (`map-controls.tsx`) - Control Panel
**Purpose**: Provide map control buttons

**Buttons**:
- **Routes Toggle**: Show/hide connecting routes
- **Legend Toggle**: Show/hide color legend
- **Map Type Control**: Dropdown for map types
- **Fit Bounds**: Zoom to show all locations
- **Info Panel**: Shows marker count

**Position**: Top-right corner (absolute positioning)

### 5. **MapLegend** (`map-legend.tsx`) - Color Guide
**Purpose**: Explain marker colors

**Content**:
- Color-coded icons for each location type
- Labels (Hotel, Meal, Transport, etc.)
- Compact, clean design

**Position**: Bottom-right corner

### 6. **RoutePolyline** (`route-polyline.tsx`) - Route Lines
**Purpose**: Draw connecting lines between locations

**Technical**:
- Uses Google Maps Polyline API
- Creates geodesic paths
- Renders in sequence order
- Cleanup on unmount

**Props**:
- `path` - Array of coordinates
- `strokeColor` - Line color
- `strokeWeight` - Line thickness
- `strokeOpacity` - Line transparency

### 7. **AddPlaceDialog** (`add-place-dialog.tsx`) - Add Place Modal
**Purpose**: Dialog for searching and adding places

**Features**:
- Floating action button (bottom-center)
- Modal dialog with PlaceSearch
- Handles place selection
- Ready for backend integration

### 8. **PlaceSearch** (`place-search.tsx`) - Search Component
**Purpose**: Google Places search functionality

**Features**:
- Search input with icon
- Real-time search via Places API
- Results dropdown with:
  - Place name
  - Formatted address
  - Click to select
- Loading states
- Backdrop to close

**API**: Google Places Text Search

### 9. **MapTypeControl** (`map-type-control.tsx`) - Map Type Switcher
**Purpose**: Change map visualization type

**Options**:
- Roadmap (default)
- Satellite
- Hybrid
- Terrain

**UI**: Dropdown menu

## Data Flow Diagram

```
┌─────────────┐
│  Mock Data  │
│ trip-data.ts│
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  MapsPage.tsx   │
│  • Trip State   │
│  • Day Filter   │
└────┬───────┬────┘
     │       │
     │       └──────────────────────┐
     │                              │
     ▼                              ▼
┌─────────────┐              ┌─────────────┐
│ MapSidebar  │              │   MapView   │
│             │              │             │
│ Display:    │              │ Process:    │
│ • Trip Info │              │ • Filter    │
│ • Days      │              │ • Extract   │
│ • Stats     │              │   Locations │
│             │              │             │
│ Emit:       │              │ Render:     │
│ • Day Click │◄─────────────┤ • Markers   │
└─────────────┘              │ • Routes    │
                             │ • Controls  │
                             │ • Legend    │
                             └─────────────┘
                                    │
                                    ▼
                             ┌─────────────┐
                             │Google Maps  │
                             │ JavaScript  │
                             │     API     │
                             └─────────────┘
```

## State Management

### Local State (React useState)
- `selectedMarker` - UI state for info windows
- `showRoutes` - UI preference
- `showLegend` - UI preference
- `mapType` - Map visualization preference
- `mapCenter` - Map position
- `mapZoom` - Map zoom level

### Props Drilling
- `trip` - Passed from page to MapView and MapSidebar
- `selectedDayId` - Passed from page, controls filtering
- Callbacks - Event handlers passed down

### Computed Values (useMemo)
- `markers` - Filtered and transformed from trip data
- `routeCoordinates` - Sorted array of positions

## Styling Architecture

### Tailwind CSS Classes
- Utility-first approach
- Responsive modifiers
- Custom colors via hex values

### shadcn/ui Components
- Button
- Dialog
- DropdownMenu
- ScrollArea
- Separator
- Input

### Custom Styling
- Absolute positioning for overlays
- Z-index management for layers
- Shadow and border for depth

## Performance Optimizations

1. **useMemo** for expensive calculations:
   - Marker filtering
   - Route coordinates
   
2. **Conditional Rendering**:
   - InfoWindow only when marker clicked
   - Legend only when toggled
   - Routes only when enabled

3. **Efficient Re-renders**:
   - Controlled map updates
   - Proper key props on lists
   - Event handler stability

4. **API Optimization**:
   - Limit search results (5 max)
   - Debounce search input (planned)
   - Session tokens (planned)

## Integration Points

### Backend Integration Ready
- Place search results → API call to save
- Trip data → Fetch from your backend
- Real-time updates → WebSocket/polling

### External APIs
- **Google Maps JavaScript API** - Map rendering
- **Google Places API** - Place search
- **Routes API** - (Future) Distance/duration

## File Sizes (Approximate)

```
map-view.tsx          ~280 lines  (Main component)
map-sidebar.tsx       ~210 lines  (Sidebar)
map-controls.tsx      ~85 lines   (Controls)
place-search.tsx      ~130 lines  (Search)
map-legend.tsx        ~40 lines   (Legend)
add-place-dialog.tsx  ~50 lines   (Dialog)
map-type-control.tsx  ~45 lines   (Map type)
route-polyline.tsx    ~50 lines   (Routes)
page.tsx              ~50 lines   (Entry)
```

**Total**: ~940 lines of code

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (responsive)

## Accessibility

- Keyboard navigation (button focus)
- Screen reader support (button labels)
- Proper semantic HTML
- ARIA attributes via shadcn/ui

---

**Architecture Principles**:
- 🎯 Component composition
- 🔄 Unidirectional data flow
- 🎨 Presentational vs. container pattern
- 🧩 Reusable, modular components
- 📦 Single responsibility principle

