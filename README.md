# Porichoy (পরিচয়) - Professional Resume Builder

A full-stack multilingual web application for creating, customizing, and sharing professional resumes and portfolios. Built specifically for Bangladeshi users with full Bangla and English language support.

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure signup/login with email, Google OAuth, and magic links
- **Resume Builder** - Intuitive editor with drag-and-drop sections
- **Multiple Templates** - Professional templates in Bangla and English
- **Public Profiles** - Unique portfolio links (porichoy.me/username)
- **PDF Export** - High-quality PDF generation with Bangla font support
- **Portfolio Showcase** - Display projects and work samples
- **Privacy Controls** - Public/private profile visibility
- **Analytics** - Track profile views and downloads
- **Multilingual UI** - Complete Bangla (বাংলা) and English interfaces

### Resume Sections
- Personal Information (dual language)
- Work Experience
- Education
- Skills with proficiency levels
- Projects with tech stacks
- Certifications
- Languages
- Contact Information

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - App Router for SSR/SSG
- **React 18** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Radix UI** - Accessible components
- **next-i18next** - Internationalization

### Backend
- **Supabase** - PostgreSQL database, authentication, storage
- **Row-Level Security** - Data protection
- **Real-time subscriptions** - Live updates

### PDF Service
- **Node.js + Express** - Microservice
- **Puppeteer** - PDF generation
- **Docker** - Containerization
- **Noto Sans Bengali** - Bangla font support

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- (Optional) Docker for PDF service

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/porichoy-web.git
cd porichoy-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Porichoy

PDF_SERVICE_URL=http://localhost:3001
PDF_SERVICE_API_KEY=your_pdf_service_api_key
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Enable Google OAuth (optional) in Supabase Authentication settings

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. PDF Service Setup (Optional)

```bash
cd pdf-service
npm install
cp .env.example .env
# Edit .env with API_KEY
npm run dev
```

Or using Docker:

```bash
cd pdf-service
docker build -t porichoy-pdf-service .
docker run -p 3001:3001 -e API_KEY=your_api_key porichoy-pdf-service
```

## 📁 Project Structure

```
porichoy-web/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes
│   │   └── [username]/    # Public profile pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   │   ├── edit/          # Resume editor
│   │   ├── portfolio/     # Portfolio management
│   │   └── settings/      # User settings
│   ├── templates/         # Template gallery
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── navigation/       # Navigation components
│   └── providers/        # Context providers
├── lib/                  # Utilities and helpers
│   ├── supabase/        # Supabase clients
│   ├── store/           # Zustand stores
│   └── utils.ts         # Helper functions
├── types/               # TypeScript types
├── public/              # Static assets
│   └── locales/        # i18n translation files
├── supabase/           # Database schema
└── pdf-service/        # PDF generation microservice
```

## 🔒 Database Schema

### Tables
- `users` - User profiles and authentication
- `profiles` - Resume/CV data (JSONB)
- `templates` - Resume templates
- `portfolio_items` - Portfolio projects
- `exports` - PDF export history
- `profile_views` - Analytics tracking

See `supabase/schema.sql` for complete schema with RLS policies.

## 🌐 i18n Support

The application supports Bangla (বাংলা) and English throughout:

- **Default Language**: Bangla (bn)
- **Available Languages**: bn, en
- **Translation Files**: `public/locales/{lang}/*.json`

### Adding Translations

1. Add new keys to `public/locales/bn/common.json`
2. Add corresponding translations to `public/locales/en/common.json`
3. Use in components: `t('key')`

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### PDF Service (Docker)

Deploy to Railway, Render, or Fly.io:

```bash
cd pdf-service
flyctl launch
flyctl deploy
```

Set environment variables in your deployment platform.

## 📝 Usage

### Creating a Resume

1. **Sign up** - Create an account with email or Google
2. **Choose Username** - Pick a unique username for your profile URL
3. **Edit Resume** - Fill in your information in the editor
4. **Select Template** - Choose a template that fits your style
5. **Make Public** - Toggle visibility in settings
6. **Share** - Share your link: `porichoy.me/username`

### Exporting PDF

1. Go to your profile page
2. Click "Download PDF"
3. PDF is generated with Bangla font support
4. Save or share the PDF

## 🔐 Security

- **Row-Level Security (RLS)** on all tables
- **Authentication required** for sensitive operations
- **Input validation** on forms
- **SQL injection protection** via Supabase
- **XSS prevention** via React
- **HTTPS only** in production

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Noto Sans Bengali** - Google Fonts
- **Supabase** - Backend infrastructure
- **Vercel** - Frontend hosting
- **shadcn/ui** - UI components

## 📞 Support

For support, email support@porichoy.me or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] AI-powered resume suggestions
- [ ] ATS optimization scoring
- [ ] Resume analytics dashboard
- [ ] Custom domain support
- [ ] Team collaboration features
- [ ] Mobile app (React Native)

---

Made with ❤️ for Bangladesh 🇧🇩

