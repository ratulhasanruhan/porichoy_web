# Porichoy - Requirements Document

## Project Overview

**Project Name**: Porichoy (পরিচয়)  
**Description**: An automatic CV/resume generator and online portfolio builder specifically designed for Bangladeshi people  
**Target Audience**: Bangladeshi job seekers, professionals, students  
**Primary Languages**: Bangla (বাংলা) and English

## Core Requirements

### 1. User Authentication & Management

#### 1.1 Registration
- ✅ Email-based signup with password
- ✅ Google OAuth integration
- ✅ Magic link (passwordless) authentication
- ✅ Username selection (unique, URL-safe)
- ✅ Email verification

#### 1.2 User Profile
- ✅ Name (Bangla & English)
- ✅ Username (unique identifier)
- ✅ Avatar/profile picture
- ✅ Language preference (Bangla/English)
- ✅ Public/private profile toggle

### 2. Resume Builder

#### 2.1 Resume Sections
- ✅ Personal Information
  - Full name (Bangla & English)
  - Profession/title (Bangla & English)
  - Location
  - Date of birth
  - Nationality

- ✅ Work Experience
  - Company name (Bangla & English)
  - Position (Bangla & English)
  - Start/end dates
  - Currently working checkbox
  - Job description (Bangla & English)
  - Location
  - Achievements

- ✅ Education
  - Institution name (Bangla & English)
  - Degree (Bangla & English)
  - Field of study (Bangla & English)
  - Start/end dates
  - GPA/grade
  - Description

- ✅ Skills
  - Skill name (Bangla & English)
  - Proficiency level (beginner/intermediate/advanced/expert)
  - Category

- ✅ Projects
  - Project name (Bangla & English)
  - Description (Bangla & English)
  - Role
  - Technologies used
  - Project URL
  - GitHub URL
  - Start/end dates

- ✅ Certifications
  - Certificate name (Bangla & English)
  - Issuing organization (Bangla & English)
  - Issue date
  - Expiry date (optional)
  - Credential ID
  - Credential URL

- ✅ Languages
  - Language name (Bangla & English)
  - Proficiency (basic/conversational/fluent/native)

- ✅ Contact Information
  - Email
  - Phone
  - Website
  - LinkedIn
  - GitHub
  - Twitter
  - Facebook
  - Physical address (Bangla & English)

#### 2.2 Editor Features
- ✅ Section-based editor
- ✅ Live preview
- ✅ Drag-and-drop to reorder sections
- ✅ Add/remove sections dynamically
- ✅ Auto-save functionality
- ✅ Dual language input (Bangla & English)

### 3. Templates

#### 3.1 Template Features
- ✅ Multiple professional templates
- ✅ Template categories (Professional, Creative, Corporate, Modern, Minimal)
- ✅ Language-specific templates (Bangla, English, Dual)
- ✅ Template preview
- ✅ Template selection
- ✅ Real-time rendering

#### 3.2 Template Requirements
- ✅ Bangla typography support (Noto Sans Bengali)
- ✅ Responsive design
- ✅ Print-friendly layouts
- ✅ ATS-friendly formatting
- ✅ Customizable colors (future)

### 4. Public Profile & Portfolio

#### 4.1 Public Profile
- ✅ Unique URL: `porichoy.me/username`
- ✅ SEO-optimized (meta tags, Open Graph)
- ✅ Public/private toggle
- ✅ View counter
- ✅ Social media links
- ✅ Profile analytics

#### 4.2 Portfolio Section
- ✅ Add portfolio projects
- ✅ Project images
- ✅ Project descriptions
- ✅ Technology tags
- ✅ External links
- ✅ Sort/reorder items

### 5. PDF Export

#### 5.1 Export Features
- ✅ Generate PDF from resume
- ✅ Bangla font support in PDF
- ✅ High-quality rendering
- ✅ A4 format
- ✅ Download functionality
- ✅ Export history tracking

#### 5.2 PDF Service
- ✅ Microservice architecture (Puppeteer)
- ✅ Docker containerization
- ✅ Secure API authentication
- ✅ Bangla font rendering (Noto Sans Bengali)
- ✅ Template-based generation

### 6. Internationalization (i18n)

#### 6.1 Language Support
- ✅ Bangla (বাংলা) - Default
- ✅ English - Secondary
- ✅ Language switcher in UI
- ✅ User preference persistence
- ✅ All UI elements translated

#### 6.2 Translation Coverage
- ✅ Common UI elements
- ✅ Dashboard
- ✅ Editor
- ✅ Authentication pages
- ✅ Public profile
- ✅ Settings
- ✅ Error messages
- ✅ Success notifications

### 7. Dashboard

#### 7.1 Dashboard Features
- ✅ Resume list
- ✅ Create new resume
- ✅ Edit existing resume
- ✅ Delete resume
- ✅ View statistics
  - Total views
  - Total downloads
  - Profile visits
- ✅ Quick actions
  - View public profile
  - Download PDF
  - Share link

### 8. Privacy & Security

#### 8.1 Privacy Controls
- ✅ Public/private profile toggle
- ✅ Section-level privacy (future)
- ✅ Visibility settings
- ✅ Data export (future)
- ✅ Account deletion (future)

#### 8.2 Security Measures
- ✅ Row-Level Security (RLS) in database
- ✅ Secure authentication (Supabase Auth)
- ✅ API key protection
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ HTTPS enforcement

### 9. Database Schema

#### 9.1 Tables
- ✅ `users` - User profiles
- ✅ `profiles` - Resume data (JSONB)
- ✅ `templates` - Resume templates
- ✅ `portfolio_items` - Portfolio projects
- ✅ `exports` - PDF export history
- ✅ `profile_views` - Analytics tracking

#### 9.2 Relationships
- ✅ One user → Many profiles
- ✅ One profile → Many portfolio items
- ✅ One profile → Many exports
- ✅ Profile → Template (optional reference)

### 10. Technical Requirements

#### 10.1 Frontend
- ✅ Next.js 14 (App Router)
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Accessibility (WCAG 2.1 AA - partial)

#### 10.2 Backend
- ✅ Supabase (PostgreSQL)
- ✅ Real-time capabilities
- ✅ File storage (Supabase Storage)
- ✅ Edge Functions (future)

#### 10.3 Performance
- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG) for public profiles
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading

#### 10.4 Deployment
- ✅ Frontend: Vercel
- ✅ Backend: Supabase Cloud
- ✅ PDF Service: Docker (Railway/Render/Fly.io)
- ✅ CI/CD pipeline (future)

## Future Enhancements (MVP+)

### Phase 2
- [ ] AI-powered resume suggestions (Gemini API)
- [ ] Resume scoring/optimization
- [ ] ATS compatibility checker
- [ ] Cover letter generator
- [ ] Multiple resume versions

### Phase 3
- [ ] Custom templates (user-created)
- [ ] Theme customization
- [ ] Resume sharing on social media
- [ ] QR code for profile
- [ ] Video introduction

### Phase 4
- [ ] Admin panel
- [ ] User management
- [ ] Template management
- [ ] Content moderation
- [ ] Usage analytics dashboard

### Phase 5
- [ ] Team/organization accounts
- [ ] Collaboration features
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] WhatsApp integration

## Success Metrics

### User Engagement
- Number of registered users
- Number of resumes created
- Public profile views
- PDF downloads
- Average session duration

### Technical Metrics
- Page load time < 2s
- PDF generation time < 5s
- 99% uptime
- Zero critical security issues

### User Satisfaction
- NPS score > 50
- Positive feedback
- Feature adoption rate
- Return user rate

## Constraints & Assumptions

### Constraints
- Budget: Free/minimal cost for MVP
- Timeline: Rapid development preferred
- Browser support: Modern browsers (last 2 versions)
- Mobile support: iOS Safari, Chrome Android

### Assumptions
- Users have internet access
- Users can read Bangla or English
- Users have basic computer literacy
- Email delivery works reliably

## Compliance & Standards

- ✅ GDPR considerations for data handling
- ✅ Data encryption at rest and in transit
- ✅ Regular security updates
- ✅ Accessibility standards (WCAG 2.1)

## Documentation Requirements

- ✅ User documentation (README)
- ✅ API documentation
- ✅ Deployment guide
- ✅ Contributing guidelines
- ✅ Code comments
- ✅ Database schema documentation

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Status**: ✅ MVP Complete - All Core Features Implemented

