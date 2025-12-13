/**
 * Locale Utilities
 * Helper functions for locale management and future i18n support
 */

import type { LanguageCode } from "@/store/use-locale-store"

/**
 * Get language display name
 * Useful for showing language in UI (e.g., language selector)
 */
export function getLanguageDisplayName(languageCode: LanguageCode): string {
  const displayNames: Record<LanguageCode, string> = {
    "vi": "Tiếng Việt",
    "en": "English",
  }

  return displayNames[languageCode] || languageCode
}

/**
 * Get language flag emoji (for UI display)
 */
export function getLanguageFlag(languageCode: LanguageCode): string {
  const flags: Record<LanguageCode, string> = {
    "vi": "🇻🇳",
    "en": "🇺🇸",
  }

  return flags[languageCode] || "🌐"
}

/**
 * Convert language code to full locale format
 * Example: "vi" -> "vi-VN", "en" -> "en-US"
 */
export function getFullLocale(languageCode: LanguageCode): string {
  return languageCode === "vi" ? "vi-VN" : "en-US"
}

/**
 * Check if language is RTL (Right-to-Left)
 * Currently all supported languages are LTR, but this is useful for future expansion
 */
export function isRTL(languageCode: LanguageCode): boolean {
  // RTL languages: Arabic (ar), Hebrew (he), etc.
  const rtlLanguages = ["ar", "he", "fa", "ur"]
  return rtlLanguages.includes(languageCode)
}

/**
 * Format number according to language
 * This is a placeholder for future i18n implementation
 * For now, uses browser's Intl.NumberFormat with full locale
 */
export function formatNumber(value: number, languageCode: LanguageCode): string {
  const locale = getFullLocale(languageCode)
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Format date according to language
 * This is a placeholder for future i18n implementation
 * For now, uses browser's Intl.DateTimeFormat with full locale
 */
export function formatDate(date: Date, languageCode: LanguageCode, options?: Intl.DateTimeFormatOptions): string {
  const locale = getFullLocale(languageCode)
  return new Intl.DateTimeFormat(locale, options).format(date)
}

/**
 * Format currency according to language
 * This is a placeholder for future i18n implementation
 */
export function formatCurrency(
  value: number,
  languageCode: LanguageCode,
  currency: string = "USD"
): string {
  const locale = getFullLocale(languageCode)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value)
}

/**
 * Get supported language codes list
 * Useful for building language selector UI
 */
export function getSupportedLanguageCodes(): LanguageCode[] {
  return ["vi", "en"]
}

