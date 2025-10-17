import { useState, useEffect, useCallback } from 'react'
import { loadTranslations, getLocale, setLocale, type Locale, type Translations } from '@/lib/i18n'

interface UseTranslationsOptions {
  namespace?: string
  locale?: Locale
}

interface UseTranslationsReturn {
  t: (key: string, fallback?: string) => string
  locale: Locale
  setLocale: (locale: Locale) => void
  isLoading: boolean
  error: string | null
}

export function useTranslations(options: UseTranslationsOptions = {}): UseTranslationsReturn {
  const { namespace = 'common' } = options
  const [translations, setTranslations] = useState<Translations>({})
  const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
    // Use default locale on server, getLocale() on client
    if (typeof window === 'undefined') {
      return 'bn' // Default locale for SSR
    }
    return getLocale()
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Load translations
  const loadTranslationsForLocale = useCallback(async (locale: Locale) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const loadedTranslations = await loadTranslations(namespace, locale)
      setTranslations(loadedTranslations)
      setCurrentLocale(locale)
    } catch (err) {
      console.error(`Error loading translations for ${namespace}:`, err)
      setError(`Failed to load translations for ${namespace}`)
      setTranslations({})
    } finally {
      setIsLoading(false)
    }
  }, [namespace])

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
    // On client, check if we need to update locale from localStorage
    const clientLocale = getLocale()
    if (clientLocale !== currentLocale) {
      setCurrentLocale(clientLocale)
    }
  }, [])

  // Initial load
  useEffect(() => {
    if (isClient) {
      loadTranslationsForLocale(currentLocale)
    }
  }, [loadTranslationsForLocale, currentLocale, isClient])

  // Listen for locale changes
  useEffect(() => {
    if (!isClient) return

    const handleLocaleChange = (event: CustomEvent<{ locale: Locale }>) => {
      if (event.detail.locale !== currentLocale) {
        loadTranslationsForLocale(event.detail.locale)
      }
    }

    window.addEventListener('localeChange', handleLocaleChange as EventListener)
    
    return () => {
      window.removeEventListener('localeChange', handleLocaleChange as EventListener)
    }
  }, [currentLocale, loadTranslationsForLocale, isClient])

  // Translation function
  const t = useCallback((key: string, fallback?: string): string => {
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
  }, [translations])

  // Set locale function
  const handleSetLocale = useCallback((locale: Locale) => {
    if (isClient) {
      setLocale(locale)
    }
  }, [isClient])

  return {
    t,
    locale: currentLocale,
    setLocale: handleSetLocale,
    isLoading,
    error,
  }
}

// Hook for multiple namespaces
export function useMultipleTranslations(namespaces: string[]) {
  const [translations, setTranslations] = useState<Record<string, Translations>>({})
  const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
    if (typeof window === 'undefined') {
      return 'bn' // Default locale for SSR
    }
    return getLocale()
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  const loadAllTranslations = useCallback(async (locale: Locale) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const loadedTranslations: Record<string, Translations> = {}
      
      await Promise.all(
        namespaces.map(async (namespace) => {
          const translations = await loadTranslations(namespace, locale)
          loadedTranslations[namespace] = translations
        })
      )
      
      setTranslations(loadedTranslations)
      setCurrentLocale(locale)
    } catch (err) {
      console.error('Error loading multiple translations:', err)
      setError('Failed to load translations')
      setTranslations({})
    } finally {
      setIsLoading(false)
    }
  }, [namespaces])

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
    const clientLocale = getLocale()
    if (clientLocale !== currentLocale) {
      setCurrentLocale(clientLocale)
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      loadAllTranslations(currentLocale)
    }
  }, [loadAllTranslations, currentLocale, isClient])

  useEffect(() => {
    if (!isClient) return

    const handleLocaleChange = (event: CustomEvent<{ locale: Locale }>) => {
      if (event.detail.locale !== currentLocale) {
        loadAllTranslations(event.detail.locale)
      }
    }

    window.addEventListener('localeChange', handleLocaleChange as EventListener)
    
    return () => {
      window.removeEventListener('localeChange', handleLocaleChange as EventListener)
    }
  }, [currentLocale, loadAllTranslations, isClient])

  const t = useCallback((namespace: string, key: string, fallback?: string): string => {
    const namespaceTranslations = translations[namespace] || {}
    const keys = key.split('.')
    let value: any = namespaceTranslations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return fallback || key
      }
    }
    
    return typeof value === 'string' ? value : fallback || key
  }, [translations])

  const handleSetLocale = useCallback((locale: Locale) => {
    if (isClient) {
      setLocale(locale)
    }
  }, [isClient])

  return {
    t,
    locale: currentLocale,
    setLocale: handleSetLocale,
    isLoading,
    error,
    translations,
  }
}
