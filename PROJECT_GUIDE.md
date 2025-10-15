# Porichoy (পরিচয়) - Resume Builder Project Guide

## 🎯 Project Overview

**Porichoy** is a full-stack bilingual (Bangla & English) resume builder and portfolio platform designed specifically for Bangladeshi users.

### Key Features
- 📝 Resume builder with drag-and-drop sections
- 🌐 Full Bangla & English language support
- 🎨 Multiple professional templates
- 📄 PDF export with Bangla fonts
- 🔗 Public portfolio URLs (porichoy.me/username)
- 🔒 Privacy controls (public/private profiles)
- 📊 Profile view analytics
- 🎯 Template system with preview

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email, OAuth)
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime subscriptions

### PDF Service
- **Runtime**: Node.js + Express
- **PDF Generation**: Puppeteer
- **Fonts**: Noto Sans Bengali

---

## 📁 Project Structure

```
porichoy_web/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── [username]/               # Public profile pages
│   ├── api/                      # API routes
│   │   └── export/pdf/           # PDF export endpoint
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/                # User dashboard
│   │   ├── page.tsx             # Dashboard home
│   │   ├── edit/[id]/           # Resume editor
│   │   ├── portfolio/           # Portfolio manager
│   │   └── settings/            # User settings
│   └── templates/                # Template gallery
├── components/                   # React components
│   ├── navigation/              # Navbar components
│   ├── providers/               # Context providers
│   └── ui/                      # Reusable UI components
├── lib/                         # Utilities and helpers
│   ├── store/                   # Zustand stores
│   ├── supabase/                # Supabase clients
│   └── utils.ts                 # Helper functions
├── types/                       # TypeScript type definitions
│   └── database.ts              # Supabase generated types
├── public/                      # Static assets
│   └── locales/                 # i18n translation files
├── supabase/                    # Database schema
│   └── schema.sql
└── pdf-service/                 # PDF generation microservice
    ├── index.js
    └── package.json
```

---

## 🗄️ Database Schema

### Tables

#### `users`
- User profile information
- Links to auth.users
- Contains: username, name, email, locale, avatar

#### `profiles`
- Resume/CV data
- JSON structure with sections:
  - personalInfo
  - experience
  - education
  - skills
  - projects
  - certifications
  - languages
  - contact

#### `templates`
- Resume templates
- HTML/CSS for rendering
- Support for Bangla/English

#### `portfolio_items`
- User portfolio projects
- Links to profiles

#### `profile_views`
- Analytics tracking
- View counts per profile

---

## 🔑 Key Features Implementation

### 1. **Bilingual Support**
- User selects locale (bn/en)
- All UI text translated via JSON files
- Resume data stored in both languages
- Font switching: Noto Sans Bengali for Bangla

### 2. **Resume Editor**
- Section-based editing
- Real-time preview
- Drag-and-drop reordering
- Auto-save functionality

### 3. **Public Profiles**
- Unique username system
- SEO-optimized pages
- Social sharing metadata
- View analytics

### 4. **PDF Export**
- Microservice architecture
- Puppeteer for rendering
- Bangla font support
- A4 format output

### 5. **Authentication**
- Supabase Auth integration
- Email + OAuth providers
- Row-level security (RLS)
- Session management

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
npm or yarn
Supabase account
```

### Installation

1. **Clone and install dependencies**
```bash
cd porichoy_web
npm install
```

2. **Environment Variables**
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
PDF_SERVICE_URL=http://localhost:3001
PDF_SERVICE_API_KEY=your_api_key
```

3. **Run development server**
```bash
npm run dev
```

4. **Setup PDF Service** (Optional)
```bash
cd pdf-service
npm install
npm run dev
```

---

## 🔧 Common Development Tasks

### Add a new language
1. Create JSON files in `public/locales/[lang]/`
2. Update `next-i18next.config.js`
3. Add locale to database schema

### Create a new template
1. Design HTML/CSS template
2. Insert into `templates` table
3. Test with Bangla content

### Add a new resume section
1. Update `types/database.ts` ProfileData interface
2. Add to resume editor UI
3. Update public profile rendering
4. Handle in PDF generation

---

## 📝 API Endpoints

### `/api/export/pdf`
- **Method**: POST
- **Auth**: Required
- **Body**: `{ profileId: string }`
- **Returns**: PDF file

---

## 🐛 Common Issues & Solutions

### Issue: Bangla text not rendering
- **Solution**: Ensure Noto Sans Bengali font is loaded
- Check CSS font-family declarations

### Issue: PDF generation fails
- **Solution**: Verify PDF service is running
- Check API key configuration
- Ensure Puppeteer dependencies installed

### Issue: Images not loading in production
- **Solution**: Use Supabase Storage for images
- Configure CORS properly

---

## 🚢 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy

### PDF Service (Railway/Render)
1. Deploy from `pdf-service` directory
2. Set environment variables
3. Update `PDF_SERVICE_URL` in main app

---

## 📊 Performance Optimization

- Use Next.js Image optimization
- Implement lazy loading
- Cache Supabase queries
- Optimize PDF generation
- Enable CDN for static assets

---

## 🔒 Security Considerations

- Row-level security (RLS) enabled
- API key protection for PDF service
- Input sanitization
- CSRF protection
- Secure session handling

---

## 🤝 Contributing

1. Create feature branch
2. Follow TypeScript strict mode
3. Add proper type definitions
4. Test Bangla content
5. Submit PR with description

---

## 📄 License

This project is proprietary software.

---

## 🆘 Support

For issues or questions:
- Check existing issues on GitHub
- Review this guide
- Contact development team

---

## 🎯 Roadmap

- [ ] More templates
- [ ] Advanced analytics
- [ ] AI-powered suggestions
- [ ] Multiple resume versions
- [ ] Collaborative editing
- [ ] Custom domain support

---

**Last Updated**: October 2025
**Version**: 1.0.0

