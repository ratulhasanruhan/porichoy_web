# Porichoy - Professional Resume Builder

A modern, multilingual resume builder application built with Next.js 14, designed specifically for Bangladeshi professionals. Supports both Bengali and English languages with beautiful typography and professional templates.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Internationalization**: Custom i18n system
- **Fonts**: Li Ador Noirrit (Bengali), Inter (English)
- **UI Components**: Custom components with shadcn/ui patterns

## 📁 Project Structure

```
porichoy_web/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # User dashboard
│   ├── templates/                # Resume templates
│   ├── globals.css              # Global styles
│   ├── fonts.css                # Bengali font definitions
│   └── layout.tsx               # Root layout with SEO
├── components/                   # React components
│   ├── navigation/              # Navbar component
│   ├── providers/               # Context providers
│   └── ui/                      # Reusable UI components
├── lib/                         # Utility libraries
│   ├── hooks/                   # Custom React hooks
│   ├── store/                   # Zustand state management
│   ├── supabase/                # Database client
│   └── i18n.ts                  # Internationalization
├── public/                      # Static assets
│   ├── images/                  # Logos, icons, backgrounds
│   ├── fonts/                   # Bengali fonts (Li Ador Noirrit)
│   ├── locales/                 # Translation files
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # SEO robots file
│   └── sitemap.xml              # SEO sitemap
├── types/                       # TypeScript definitions
└── supabase/                    # Database schema
```

## 🎨 Assets & Branding

### Logo Files (in `public/images/`)
- **Text Logo**: `logos/text_logo.png` - Used in navbar and footer
- **Full Logo**: `logos/porichoy_with_bg.png` - Used for social sharing
- **App Icon**: `icons/icon.png` - PWA and mobile app icon
- **Favicon**: `icons/favicon.ico` - Browser tab icon

### Bengali Fonts (in `public/fonts/`)
- **Li Ador Noirrit** font family with 5 weights:
  - ExtraLight (200), Light (300), Regular (400), SemiBold (600), Bold (700)
- CSS classes: `.font-bengali`, `.font-bengali-bold`, etc.

## 🌍 Internationalization

- **Default Language**: Bengali (`bn`)
- **Secondary Language**: English (`en`)
- **Translation Files**: Located in `public/locales/bn/` and `public/locales/en/`
- **Namespaces**: `common`, `dashboard`, `home`, `auth`, `editor`
- **Font Support**: Custom Bengali fonts for authentic typography

## 🔧 Key Features

### Authentication & User Management
- Supabase Auth integration
- User profiles with locale preferences
- Protected routes and middleware

### Resume Builder
- Multi-language resume creation
- Professional templates
- Real-time preview
- PDF export functionality

### SEO & Performance
- Comprehensive meta tags
- Open Graph and Twitter Cards
- Structured data (JSON-LD)
- PWA support with manifest
- Optimized images and fonts

### State Management
- Zustand stores for auth and resume data
- Persistent user preferences
- Real-time language switching

## 🗄️ Database Schema

### Tables
- **users**: User profiles and preferences
- **profiles**: Resume data and metadata
- **templates**: Resume templates
- **portfolio_items**: Portfolio projects
- **exports**: PDF generation tracking
- **profile_views**: Analytics data

## 🚀 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## 📱 PWA Features

- **Installable**: Can be installed on mobile devices
- **Offline Ready**: Service worker for offline functionality
- **App Shortcuts**: Quick access to create resume and templates
- **Responsive**: Mobile-first design

## 🔍 SEO Configuration

- **Primary Language**: Bengali (Bangladesh)
- **Meta Tags**: Comprehensive SEO metadata
- **Structured Data**: WebApplication schema
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Proper crawling instructions

## 🎯 Target Audience

- **Primary**: Bangladeshi professionals
- **Languages**: Bengali (default), English
- **Use Cases**: Job applications, career development, portfolio building

## 📊 Performance

- **Font Loading**: Optimized with font-display: swap
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Static asset caching

## 🔐 Security

- **Authentication**: Supabase Auth with RLS
- **Data Protection**: Row-level security policies
- **Input Validation**: TypeScript and runtime validation
- **HTTPS**: Secure connections

## 🌐 Deployment

- **Platform**: Vercel (recommended)
- **Database**: Supabase (hosted)
- **CDN**: Automatic with Vercel
- **Environment**: Production-ready configuration

## 📝 Notes for AI Agents

- **Default Language**: Bengali is the primary language
- **Font System**: Custom Bengali fonts are loaded via CSS
- **State Management**: Uses Zustand for client-side state
- **Database**: Supabase with TypeScript types
- **Styling**: Tailwind CSS with custom Bengali font classes
- **SEO**: Comprehensive meta tags and structured data
- **PWA**: Full progressive web app capabilities

This application is designed to serve the Bangladeshi professional community with a focus on Bengali language support and cultural relevance.