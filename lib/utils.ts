import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to locale string
 */
export function formatDate(date: string | Date, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (locale === 'bn') {
    return dateObj.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format date range
 */
export function formatDateRange(
  startDate: string,
  endDate: string | null | undefined,
  locale: string = 'en',
  presentText: string = 'Present'
): string {
  const start = formatDate(startDate, locale)
  if (!endDate) {
    return `${start} - ${presentText}`
  }
  const end = formatDate(endDate, locale)
  return `${start} - ${end}`
}

/**
 * Generate username from name
 */
export function generateUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20)
}

/**
 * Validate username
 */
export function isValidUsername(username: string): boolean {
  return /^[a-z0-9_-]{3,30}$/.test(username)
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Format number with locale
 */
export function formatNumber(num: number, locale: string = 'en'): string {
  if (locale === 'bn') {
    return num.toLocaleString('bn-BD')
  }
  return num.toLocaleString('en-US')
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get public profile URL
 */
export function getPublicProfileUrl(username: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/${username}`
}

/**
 * Download file from URL
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(blobUrl)
  } catch (err) {
    console.error('Failed to download file:', err)
    throw err
  }
}
