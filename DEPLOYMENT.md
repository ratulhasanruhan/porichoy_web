# Deployment Guide

Complete guide to deploying Porichoy to production.

## Prerequisites

- Vercel account (for frontend)
- Supabase account (for database)
- Railway/Render/Fly.io account (for PDF service)
- Domain name (optional)

## 1. Supabase Setup

### Create Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for database provisioning

### Run Database Migrations

1. Navigate to SQL Editor in Supabase dashboard
2. Copy contents of `supabase/schema.sql`
3. Run the SQL script
4. Verify tables are created

### Configure Authentication

1. Go to Authentication → Settings
2. Enable Email provider
3. (Optional) Configure Google OAuth:
   - Add Google OAuth credentials
   - Set redirect URLs
4. Configure email templates (optional)

### Get API Keys

1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

## 2. Frontend Deployment (Vercel)

### Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/porichoy-web.git
git push -u origin main
```

### Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

### Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_APP_URL=https://porichoy.vercel.app
NEXT_PUBLIC_SITE_NAME=Porichoy

PDF_SERVICE_URL=https://your-pdf-service.railway.app
PDF_SERVICE_API_KEY=your_secure_api_key
```

### Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your site at `https://your-project.vercel.app`

## 3. PDF Service Deployment

### Option A: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `pdf-service`
5. Add environment variables:
   ```
   PORT=3001
   API_KEY=generate_secure_random_key
   ```
6. Deploy
7. Copy the public URL

### Option B: Render

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your repository
4. Configure:
   - **Name**: porichoy-pdf-service
   - **Environment**: Docker
   - **Root Directory**: pdf-service
   - **Region**: Choose closest to your users
5. Add environment variables
6. Create web service
7. Copy the public URL

### Option C: Fly.io

```bash
cd pdf-service

# Install flyctl if not installed
curl -L https://fly.io/install.sh | sh

# Launch app
flyctl launch

# Set secrets
flyctl secrets set API_KEY=your_secure_api_key

# Deploy
flyctl deploy
```

### Test PDF Service

```bash
curl https://your-pdf-service-url/health
```

Should return: `{"status":"ok","service":"Porichoy PDF Service"}`

## 4. Custom Domain (Optional)

### For Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (up to 48 hours)

### Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` in Vercel to your custom domain.

## 5. Supabase Configuration

### Update Site URL

1. Go to Authentication → URL Configuration
2. Set Site URL to your domain: `https://yourdomain.com`
3. Add Redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.vercel.app/auth/callback`

### Configure CORS (if needed)

If calling Supabase from custom domains, add them to allowed origins.

## 6. Post-Deployment Checklist

### Verify Functionality

- [ ] Homepage loads correctly
- [ ] Sign up works (check email delivery)
- [ ] Login works
- [ ] Dashboard accessible after login
- [ ] Resume editor saves changes
- [ ] Public profile pages work
- [ ] PDF export generates correctly
- [ ] Bangla fonts display properly
- [ ] Settings page saves changes
- [ ] Portfolio items can be added
- [ ] Templates page loads

### Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Configure caching headers
- [ ] Optimize images (use Next.js Image component)
- [ ] Enable Supabase connection pooling
- [ ] Monitor PDF service response times

### Security

- [ ] Force HTTPS (automatic on Vercel)
- [ ] Review RLS policies
- [ ] Rotate API keys if leaked
- [ ] Enable rate limiting (Vercel Pro)
- [ ] Configure CSP headers

### Monitoring

- [ ] Set up Vercel monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Enable database backups (Supabase)

## 7. Scaling Considerations

### Frontend

- Vercel automatically scales
- Consider Vercel Pro for better performance
- Use Edge Functions for geolocation

### Database

- Monitor Supabase usage
- Upgrade plan if hitting limits
- Add database indexes for slow queries
- Consider read replicas for high traffic

### PDF Service

- Scale horizontally (multiple instances)
- Add Redis caching for generated PDFs
- Use CDN for static assets
- Implement queue system for large batches

## 8. Backup Strategy

### Database

Supabase provides automatic backups on paid plans.

For manual backups:
```bash
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Application Code

- Keep Git repository as source of truth
- Tag releases: `git tag v1.0.0`
- Maintain changelog

## 9. Environment-Specific Configuration

### Development
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
PDF_SERVICE_URL=http://localhost:3001
```

### Staging
```
NEXT_PUBLIC_APP_URL=https://staging.porichoy.vercel.app
PDF_SERVICE_URL=https://staging-pdf.railway.app
```

### Production
```
NEXT_PUBLIC_APP_URL=https://porichoy.me
PDF_SERVICE_URL=https://pdf.porichoy.me
```

## 10. Troubleshooting

### PDF Generation Fails

- Check PDF service is running: `curl PDF_SERVICE_URL/health`
- Verify API_KEY is correct
- Check Chromium is installed in Docker
- Review PDF service logs

### Authentication Issues

- Verify Supabase URL and keys
- Check redirect URLs are configured
- Confirm email settings in Supabase

### Build Failures

- Check Node.js version (18+)
- Verify all dependencies installed
- Review build logs in Vercel

### Database Connection Issues

- Check Supabase project is active
- Verify connection pooling settings
- Review RLS policies

## Support

For deployment issues:
- Check Vercel docs: https://vercel.com/docs
- Check Supabase docs: https://supabase.com/docs
- Open an issue on GitHub

---

Last updated: October 2025

