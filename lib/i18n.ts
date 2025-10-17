// Centralized i18n management for Next.js App Router
export type Locale = 'bn' | 'en'

export const defaultLocale: Locale = 'bn'
export const locales: Locale[] = ['bn', 'en']

// Translation types
export interface Translations {
  [key: string]: string | Translations
}

// Global translation cache
const translationCache = new Map<string, Translations>()

// Get locale from various sources
export function getLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale
  
  // Check localStorage first
  const storedLocale = localStorage.getItem('preferredLocale') as Locale
  if (storedLocale && locales.includes(storedLocale)) {
    return storedLocale
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0]
  if (browserLang === 'bn' || browserLang === 'en') {
    return browserLang as Locale
  }
  
  return defaultLocale
}

// Set locale preference
export function setLocale(locale: Locale): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('preferredLocale', locale)
  
  // Clear translation cache to force reload
  translationCache.clear()
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale } }))
}

// Load translations with caching
export async function loadTranslations(namespace: string, locale: Locale = getLocale()): Promise<Translations> {
  const cacheKey = `${locale}:${namespace}`
  
  // Return cached translations if available
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }
  
  try {
    const response = await fetch(`/locales/${locale}/${namespace}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load translations: ${response.status}`)
    }
    
    const translations = await response.json()
    
    // Cache the translations
    translationCache.set(cacheKey, translations)
    
    return translations
  } catch (error) {
    console.error(`Error loading translations for ${namespace}:`, error)
    
    // Return empty translations as fallback
    return {}
  }
}

// Translation function with fallback
export function t(translations: Translations, key: string, fallback?: string): string {
  const keys = key.split('.')
  let value: any = translations
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return fallback || key
    }
  }
  
  return typeof value === 'string' ? value : fallback || key
}

// Get nested translation value
export function getNestedTranslation(translations: Translations, path: string): string | undefined {
  const keys = path.split('.')
  let value: any = translations
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return undefined
    }
  }
  
  return typeof value === 'string' ? value : undefined
}

// Format numbers based on locale
export function formatNumber(num: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-US').format(num)
}

// Format dates based on locale
export function formatDate(date: string | Date, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

// Clear translation cache (useful for development)
export function clearTranslationCache(): void {
  translationCache.clear()
}
