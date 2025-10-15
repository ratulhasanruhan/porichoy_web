import type { Metadata } from 'next'
import { Inter, Noto_Sans_Bengali } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansBengali = Noto_Sans_Bengali({ 
  subsets: ['bengali'],
  variable: '--font-noto-sans-bengali',
})

export const metadata: Metadata = {
  title: 'Porichoy - পরিচয় | Professional Resume Builder',
  description: 'Create your professional resume and portfolio in Bangla and English. Build, customize, and share your unique career story.',
  keywords: ['resume', 'cv', 'portfolio', 'bangla', 'bangladesh', 'career', 'job'],
  authors: [{ name: 'Porichoy' }],
  openGraph: {
    type: 'website',
    title: 'Porichoy - পরিচয়',
    description: 'Create your professional resume and portfolio in Bangla and English',
    siteName: 'Porichoy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Porichoy - পরিচয়',
    description: 'Create your professional resume and portfolio in Bangla and English',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansBengali.variable} font-sans antialiased`}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}

