# Quick Start Guide - Porichoy

Get Porichoy running locally in under 10 minutes!

## Prerequisites

Make sure you have installed:
- [Node.js 18+](https://nodejs.org/) 
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com) account (free)

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/porichoy-web.git
cd porichoy-web

# Install dependencies
npm install
```

## Step 2: Set Up Supabase (3 minutes)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `porichoy`
   - Database Password: (generate a strong password)
   - Region: (choose closest to you)
4. Click "Create Project" and wait ~2 minutes

### Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open `supabase/schema.sql` from your local project
4. Copy all contents and paste into Supabase SQL Editor
5. Click "Run" or press `Ctrl/Cmd + Enter`
6. You should see "Success. No rows returned"

### Get API Keys

1. Go to **Project Settings** (gear icon)
2. Click **API** in sidebar
3. Copy these values:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Configure Environment (1 minute)

Create `.env.local` file in project root:

```bash
# Create from example
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Porichoy

dbpass = cK7xghGenU59lrNV

# PDF Service (optional for now)
PDF_SERVICE_URL=http://localhost:3001
PDF_SERVICE_API_KEY=dev_key_12345
```

## Step 4: Run the App (1 minute)

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 5: Create Your First Account (2 minutes)

1. Click **"Get Started"** or **"Sign Up"**
2. Fill in:
   - Full Name: `আপনার নাম` (Your Name)
   - Username: `yourname` (lowercase, no spaces)
   - Email: your email
   - Password: at least 8 characters
3. Click **"Create Account"**
4. You're in! 🎉

## What's Next?

### Create Your Resume

1. You'll be redirected to the **Dashboard**
2. A default resume is already created
3. Click **"Edit"** to start customizing
4. Fill in your:
   - Personal Information
   - Work Experience
   - Education
   - Skills
5. Click **"Save Changes"**

### View Your Public Profile

1. Go to **Dashboard**
2. Note your profile URL: `http://localhost:3000/yourname`
3. Click **"View Public Profile"**
4. Share this link with anyone!

### Make Profile Public/Private

1. Go to **Settings** (top right)
2. Toggle **"Public Profile"**
3. Click **"Save Changes"**

## Optional: Set Up PDF Export

The PDF export requires a separate microservice:

```bash
# Open new terminal
cd pdf-service

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set API_KEY=dev_key_12345

# Start PDF service
npm run dev
```

Now PDFs will generate when you click "Download PDF"!

## Common Issues & Solutions

### Port 3000 Already in Use

```bash
# Use different port
PORT=3001 npm run dev
```

### Supabase Connection Error

- Double-check your `.env.local` file
- Make sure keys are correct (no extra spaces)
- Verify Supabase project is active

### Database Schema Errors

- Make sure you ran the entire `schema.sql` file
- Check for error messages in Supabase SQL Editor
- Try running the schema again (it's idempotent)

### Can't Create Account

- Check Supabase Auth is enabled:
  - Go to Authentication → Settings
  - Enable Email provider
  - Save
- Check email template (optional)
- Try with different email

### PDF Generation Not Working

- Make sure PDF service is running on port 3001
- Check API_KEY matches in both `.env` files
- See full PDF service setup in [README.md](README.md)

## Development Tips

### Hot Reload

Changes to code automatically reload the browser!

### Bangla Input

- Use your system's Bangla keyboard
- Or copy-paste Bangla text
- Fonts will display automatically

### Testing Both Languages

1. Go to Settings
2. Change "Preferred Language"
3. See UI switch to Bangla or English

### View Database

1. Go to Supabase dashboard
2. Click "Table Editor"
3. See your data in real-time

## Next Steps

Ready to customize further?

- Read [README.md](README.md) for full documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) to deploy online
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Review [requirements.md](requirements.md) for features

## Getting Help

Stuck? Here's how to get help:

1. Check error messages in browser console (F12)
2. Check terminal for server errors
3. Review [README.md](README.md) troubleshooting section
4. Open an issue on GitHub

## Success! 🎉

You now have:
- ✅ Porichoy running locally
- ✅ Supabase database configured
- ✅ Your first account created
- ✅ A working resume editor
- ✅ Public profile at `localhost:3000/yourname`

Happy resume building! 🚀

---

**Estimated Time**: 10 minutes  
**Difficulty**: Beginner-friendly  
**Prerequisites**: Node.js, Supabase account

