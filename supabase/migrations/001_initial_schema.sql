-- ProvenSkills Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  is_creator BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT false,
  total_sales INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  skill_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
  ('Frontend', 'frontend', 'UI components, styling, and client-side development', '🎨'),
  ('Backend', 'backend', 'Server-side development, APIs, and databases', '⚙️'),
  ('DevOps', 'devops', 'CI/CD, deployment, and infrastructure', '🚀'),
  ('Testing', 'testing', 'Unit tests, integration tests, and QA', '🧪'),
  ('AI/ML', 'ai-ml', 'Machine learning, AI integrations, and automation', '🤖'),
  ('Data', 'data', 'Data processing, analytics, and visualization', '📊'),
  ('Security', 'security', 'Security scanning, auditing, and compliance', '🔒'),
  ('Documentation', 'documentation', 'API docs, READMEs, and technical writing', '📝');

-- ============================================
-- SKILLS
-- ============================================
CREATE TABLE public.skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  install_command TEXT NOT NULL,
  github_url TEXT,
  version TEXT DEFAULT '1.0.0',
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  security_score INTEGER DEFAULT 0,
  security_grade TEXT DEFAULT 'F',
  badges TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  scanned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for search
CREATE INDEX skills_name_idx ON public.skills USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX skills_category_idx ON public.skills(category_id);
CREATE INDEX skills_creator_idx ON public.skills(creator_id);
CREATE INDEX skills_published_idx ON public.skills(is_published) WHERE is_published = true;

-- ============================================
-- SECURITY SCANS
-- ============================================
CREATE TABLE public.security_scans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  checks JSONB NOT NULL DEFAULT '[]',
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX security_scans_skill_idx ON public.security_scans(skill_id);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(skill_id, user_id)
);

CREATE INDEX reviews_skill_idx ON public.reviews(skill_id);

-- Update skill rating on review change
CREATE OR REPLACE FUNCTION public.update_skill_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.skills
  SET
    rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE skill_id = COALESCE(NEW.skill_id, OLD.skill_id)),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE skill_id = COALESCE(NEW.skill_id, OLD.skill_id))
  WHERE id = COALESCE(NEW.skill_id, OLD.skill_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_skill_rating();

-- ============================================
-- PURCHASES
-- ============================================
CREATE TABLE public.purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  price_paid DECIMAL(10,2) NOT NULL,
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX purchases_user_idx ON public.purchases(user_id);
CREATE INDEX purchases_skill_idx ON public.purchases(skill_id);

-- ============================================
-- MCP SERVERS
-- ============================================
CREATE TABLE public.mcp_servers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  tools TEXT[] DEFAULT '{}',
  resources TEXT[] DEFAULT '{}',
  install_command TEXT NOT NULL,
  github_url TEXT,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  downloads INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX mcp_servers_creator_idx ON public.mcp_servers(creator_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_servers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Skills policies
CREATE POLICY "Published skills are viewable by everyone" ON public.skills
  FOR SELECT USING (is_published = true);

CREATE POLICY "Creators can view own unpublished skills" ON public.skills
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert own skills" ON public.skills
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own skills" ON public.skills
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own skills" ON public.skills
  FOR DELETE USING (auth.uid() = creator_id);

-- Security scans policies
CREATE POLICY "Security scans are viewable by everyone" ON public.security_scans
  FOR SELECT USING (true);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Purchases policies
CREATE POLICY "Users can view own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Creators can view purchases of their skills" ON public.purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.skills
      WHERE skills.id = purchases.skill_id
      AND skills.creator_id = auth.uid()
    )
  );

-- MCP Servers policies
CREATE POLICY "Published MCP servers are viewable by everyone" ON public.mcp_servers
  FOR SELECT USING (is_published = true);

CREATE POLICY "Creators can view own unpublished MCP servers" ON public.mcp_servers
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert own MCP servers" ON public.mcp_servers
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own MCP servers" ON public.mcp_servers
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own MCP servers" ON public.mcp_servers
  FOR DELETE USING (auth.uid() = creator_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_skills
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_reviews
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_mcp_servers
  BEFORE UPDATE ON public.mcp_servers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
