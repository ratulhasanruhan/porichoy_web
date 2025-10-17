import type { Metadata } from 'next'
import { Inter, Noto_Sans_Bengali } from 'next/font/google'
import './globals.css'
import './fonts.css'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { StructuredData } from '@/components/StructuredData'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansBengali = Noto_Sans_Bengali({ 
  subsets: ['bengali'],
  variable: '--font-noto-sans-bengali',
})

export const metadata: Metadata = {
  title: 'Porichoy - পরিচয় | Professional Resume Builder for Bangladesh',
  description: 'Create your professional resume and portfolio in Bangla and English. Build, customize, and share your unique career story. Free resume builder for Bangladeshi professionals.',
  keywords: [
    'resume builder', 'cv maker', 'portfolio creator', 'bangla resume', 'english resume',
    'bangladesh jobs', 'career development', 'professional resume', 'job application',
    'porichoy', 'পরিচয়', 'resume template', 'cv template', 'free resume builder'
  ],
  authors: [{ name: 'Porichoy Team' }],
  creator: 'Porichoy',
  publisher: 'Porichoy',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/icons/favicon.ico', sizes: 'any' },
      { url: '/images/icons/icon.png', type: 'image/png' }
    ],
    shortcut: '/images/icons/favicon.ico',
    apple: '/images/icons/icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    alternateLocale: ['en_US'],
    title: 'Porichoy - পরিচয় | Professional Resume Builder',
    description: 'Create your professional resume and portfolio in Bangla and English. Free resume builder for Bangladeshi professionals.',
    siteName: 'Porichoy',
    url: 'https://porichoy.me',
    images: [
      {
        url: '/images/logos/porichoy_with_bg.png',
        width: 1200,
        height: 630,
        alt: 'Porichoy - Professional Resume Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Porichoy - পরিচয় | Professional Resume Builder',
    description: 'Create your professional resume and portfolio in Bangla and English. Free resume builder for Bangladeshi professionals.',
    images: ['/images/logos/porichoy_with_bg.png'],
    creator: '@porichoy',
  },
  alternates: {
    canonical: 'https://porichoy.me',
    languages: {
      'bn-BD': 'https://porichoy.me',
      'en-US': 'https://porichoy.me/en',
    },
  },
  category: 'technology',
  classification: 'Resume Builder, Career Development, Job Application',
  other: {
    'application-name': 'Porichoy',
    'apple-mobile-web-app-title': 'Porichoy',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#3B82F6',
    'theme-color': '#3B82F6',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${notoSansBengali.variable} font-sans antialiased`}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}

