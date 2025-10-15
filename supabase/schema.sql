-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  locale TEXT DEFAULT 'bn' CHECK (locale IN ('bn', 'en')),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]+$')
);

-- Templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Professional' CHECK (category IN ('Professional', 'Creative', 'Corporate', 'Modern', 'Minimal')),
  html_template TEXT NOT NULL,
  css_styles TEXT NOT NULL,
  preview_image TEXT,
  locale TEXT NOT NULL DEFAULT 'dual' CHECK (locale IN ('bn', 'en', 'dual')),
  is_official BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (resume data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  summary TEXT,
  data JSONB NOT NULL DEFAULT '{
    "personalInfo": {},
    "experience": [],
    "education": [],
    "skills": [],
    "projects": [],
    "certifications": [],
    "languages": [],
    "contact": {}
  }'::jsonb,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio items table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exports table (PDF/HTML exports)
CREATE TABLE IF NOT EXISTS public.exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'html')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile views tracking
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  viewer_country TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON public.profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_profile_id ON public.portfolio_items(profile_id);
CREATE INDEX IF NOT EXISTS idx_exports_profile_id ON public.exports(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON public.profile_views(profile_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public users are viewable by username"
  ON public.users FOR SELECT
  USING (is_public = true);

-- Profiles policies
CREATE POLICY "Users can view own profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles"
  ON public.profiles FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (is_public = true);

-- Templates policies (all can read, only admins/creators can write)
CREATE POLICY "Anyone can view templates"
  ON public.templates FOR SELECT
  USING (true);

CREATE POLICY "Users can create templates"
  ON public.templates FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates"
  ON public.templates FOR UPDATE
  USING (auth.uid() = created_by);

-- Portfolio items policies
CREATE POLICY "Users can manage own portfolio items"
  ON public.portfolio_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Public portfolio items are viewable"
  ON public.portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.is_public = true
    )
  );

-- Exports policies
CREATE POLICY "Users can manage own exports"
  ON public.exports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = exports.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Profile views policies (insert only for tracking)
CREATE POLICY "Anyone can insert profile views"
  ON public.profile_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own profile analytics"
  ON public.profile_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = profile_views.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment profile views
CREATE OR REPLACE FUNCTION increment_profile_views(profile_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET views_count = views_count + 1
  WHERE id = profile_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed default templates
INSERT INTO public.templates (name, category, html_template, css_styles, locale, preview_image) VALUES
('Minimal Professional', 'Minimal', '<div class="resume-minimal">{{content}}</div>', '.resume-minimal { font-family: Arial, sans-serif; }', 'dual', '/templates/minimal-professional.png'),
('Creative Bangla', 'Creative', '<div class="resume-creative font-bengali">{{content}}</div>', '.resume-creative { font-family: "Noto Sans Bengali", sans-serif; color: #2c3e50; }', 'bn', '/templates/creative-bangla.png'),
('Corporate English', 'Corporate', '<div class="resume-corporate">{{content}}</div>', '.resume-corporate { font-family: "Times New Roman", serif; }', 'en', '/templates/corporate-english.png'),
('Modern Dual', 'Modern', '<div class="resume-modern">{{content}}</div>', '.resume-modern { font-family: "Inter", sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }', 'dual', '/templates/modern-dual.png')
ON CONFLICT DO NOTHING;

