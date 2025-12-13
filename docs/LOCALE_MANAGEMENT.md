# Locale Management Guide

## Overview

Trippi uses a centralized locale management system to ensure consistent language settings across:
- Google Maps API calls (Places, Routes, Geocoding)
- Map display language
- Future i18n implementation

## How It Works

### 1. Locale Store (`src/store/use-locale-store.ts`)

The locale is managed using **Zustand** with **localStorage persistence**, similar to user preferences.

**Key Features:**
- Automatically detects browser locale on first load
- Persists user's locale choice in localStorage
- Provides helper functions to extract language/region codes
- Supports multiple locales (currently: vi-VN, en-US, en-GB, ja-JP, ko-KR, zh-CN, fr-FR, de-DE, es-ES)

### 2. How to Get User Locale

#### In React Components (Recommended)

```tsx
import { useLocaleStore } from "@/store/use-locale-store"

function MyComponent() {
  const locale = useLocaleStore((state) => state.locale)
  const setLocale = useLocaleStore((state) => state.setLocale)
  
  // Use locale
  console.log("Current locale:", locale) // e.g., "vi-VN"
  
  // Change locale
  setLocale("en-US")
}
```

#### Outside React Components

```tsx
import { getCurrentLocale, getCurrentLanguageCode } from "@/store/use-locale-store"

// Get full locale
const locale = getCurrentLocale() // "vi-VN"

// Get language code only
const lang = getCurrentLanguageCode() // "vi"
```

### 3. Where Locale is Stored

- **In Memory**: Zustand store (for reactive updates)
- **Persistent Storage**: `localStorage` with key `"locale-storage"`
- **Browser Detection**: Automatically detects on first visit if no stored preference exists

### 4. Current Implementation

#### Google Maps API Integration

All Google Maps API calls automatically use the current locale:

- **Routes API**: Uses `languageCode` parameter
- **Places API**: Uses `languageCode` parameter  
- **Geocoding API**: Uses `language` parameter (language code only)

**Example:**
```tsx
// In src/services/maps/index.ts
import { getCurrentLocale } from "@/store/use-locale-store"

// Routes API
languageCode: getCurrentLocale(), // "vi-VN"

// Places API
languageCode: getCurrentLocale(), // "vi-VN"

// Geocoding API
language: getCurrentLocale().split("-")[0], // "vi"
```

#### Map Display

The `APIProvider` component uses the locale for map UI:

```tsx
// In src/app/maps/page.tsx
const locale = useLocaleStore((state) => state.locale)

<APIProvider apiKey={apiKey} language={locale}>
  {/* Map components */}
</APIProvider>
```

## Future Multi-Language Implementation

### Recommended Approach: `next-intl`

For full i18n support (translating UI text, dates, numbers, etc.), we recommend using [`next-intl`](https://next-intl-docs.vercel.app/):

#### Step 1: Install next-intl

```bash
npm install next-intl
```

#### Step 2: Create Translation Files

```
src/
├── messages/
│   ├── vi-VN.json
│   ├── en-US.json
│   └── ...
```

**Example `messages/vi-VN.json`:**
```json
{
  "common": {
    "welcome": "Chào mừng",
    "search": "Tìm kiếm",
    "add": "Thêm"
  },
  "maps": {
    "searchPlaces": "Tìm kiếm địa điểm...",
    "addToTrip": "Thêm vào chuyến đi",
    "routeDistance": "Khoảng cách",
    "routeDuration": "Thời gian"
  }
}
```

#### Step 3: Integrate with Locale Store

```tsx
// src/store/use-locale-store.ts
import { useLocaleStore } from "./use-locale-store"

// In your components
import { useTranslations } from "next-intl"
import { useLocaleStore } from "@/store/use-locale-store"

function MyComponent() {
  const locale = useLocaleStore((state) => state.locale)
  const t = useTranslations()
  
  return <h1>{t("common.welcome")}</h1>
}
```

#### Step 4: Update Next.js Config

```ts
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

export default withNextIntl({
  // ... your config
})
```

#### Step 5: Create Middleware

```ts
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { getCurrentLocale } from '@/store/use-locale-store'

export default createMiddleware({
  locales: ['vi-VN', 'en-US', 'en-GB', 'ja-JP', 'ko-KR', 'zh-CN', 'fr-FR', 'de-DE', 'es-ES'],
  defaultLocale: getCurrentLocale() || 'vi-VN'
})
```

### Alternative: Manual Translation System

If you prefer a lighter solution, you can create a simple translation hook:

```tsx
// src/lib/translations.ts
import { getCurrentLocale } from "@/store/use-locale-store"

const translations = {
  "vi-VN": {
    "search": "Tìm kiếm",
    "add": "Thêm",
    // ...
  },
  "en-US": {
    "search": "Search",
    "add": "Add",
    // ...
  },
}

export function useTranslation() {
  const locale = getCurrentLocale()
  return (key: string) => translations[locale]?.[key] || key
}
```

## Locale Utilities

The `src/lib/locale.ts` file provides helper functions:

```tsx
import {
  getLocaleDisplayName,
  getLocaleFlag,
  formatNumber,
  formatDate,
  formatCurrency,
  getSupportedLocales,
} from "@/lib/locale"

// Display name
getLocaleDisplayName("vi-VN") // "Tiếng Việt"

// Flag emoji
getLocaleFlag("vi-VN") // "🇻🇳"

// Format numbers
formatNumber(1234.56, "vi-VN") // "1.234,56" (Vietnamese format)

// Format dates
formatDate(new Date(), "vi-VN") // "01/01/2024"

// Format currency
formatCurrency(1000, "vi-VN", "VND") // "1.000 ₫"

// Get all supported locales
getSupportedLocales() // ["vi-VN", "en-US", ...]
```

## Adding a New Locale

1. **Update Locale Type** (`src/store/use-locale-store.ts`):
```ts
export type Locale = "vi-VN" | "en-US" | "th-TH" // Add new locale
```

2. **Update Browser Detection**:
```ts
const localeMap: Record<string, Locale> = {
  // ... existing
  "th": "th-TH",
  "th-TH": "th-TH",
}
```

3. **Update Display Names** (`src/lib/locale.ts`):
```ts
const displayNames: Record<Locale, string> = {
  // ... existing
  "th-TH": "ไทย",
}
```

4. **Update Flags**:
```ts
const flags: Record<Locale, string> = {
  // ... existing
  "th-TH": "🇹🇭",
}
```

## Best Practices

1. **Always use the locale store** - Don't hardcode locale values
2. **Use locale utilities** - For formatting numbers, dates, currency
3. **Test with different locales** - Ensure UI works with RTL languages (if added)
4. **Persist user choice** - The store already handles this automatically
5. **Provide locale selector** - Let users change their preference

## Example: Locale Selector Component

```tsx
"use client"

import { useLocaleStore } from "@/store/use-locale-store"
import { getLocaleDisplayName, getLocaleFlag, getSupportedLocales } from "@/lib/locale"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LocaleSelector() {
  const locale = useLocaleStore((state) => state.locale)
  const setLocale = useLocaleStore((state) => state.setLocale)

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {getSupportedLocales().map((loc) => (
          <SelectItem key={loc} value={loc}>
            <span className="flex items-center gap-2">
              <span>{getLocaleFlag(loc)}</span>
              <span>{getLocaleDisplayName(loc)}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Troubleshooting

### Locale not updating in Google Maps

- Ensure `APIProvider` has the `language` prop set
- Check that API calls use `getCurrentLocale()` from the store
- Clear localStorage and reload to reset locale

### Browser locale not detected

- Check browser language settings
- Verify `navigator.language` is available (may not work in SSR)
- Fallback to "en-US" if detection fails

### API returns English despite locale setting

- Verify locale format matches Google's supported locales
- Check API request includes `languageCode` or `language` parameter
- Some APIs may require language code only (e.g., "vi" not "vi-VN")

## Summary

- **Store**: Zustand with localStorage persistence
- **Detection**: Automatic browser locale detection
- **Usage**: `useLocaleStore()` hook in components
- **APIs**: All Google Maps APIs use locale automatically
- **Future**: Ready for `next-intl` or custom translation system

