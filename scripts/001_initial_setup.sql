-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('medved', 'vlk', 'rys', 'other')),
  description TEXT NOT NULL,
  alt_text TEXT,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Ochrana', 'Výskum', 'Koexistencia', 'Novinky')),
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Photos policies (public read, admin write)
DROP POLICY IF EXISTS "Photos are publicly readable" ON photos;
CREATE POLICY "Photos are publicly readable" ON photos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert photos" ON photos;
CREATE POLICY "Admins can insert photos" ON photos
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update photos" ON photos;
CREATE POLICY "Admins can update photos" ON photos
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete photos" ON photos;
CREATE POLICY "Admins can delete photos" ON photos
  FOR DELETE USING (true);

-- Blog posts policies (public read published, admin full access)
DROP POLICY IF EXISTS "Published blog posts are publicly readable" ON blog_posts;
CREATE POLICY "Published blog posts are publicly readable" ON blog_posts
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Admins can view all blog posts" ON blog_posts;
CREATE POLICY "Admins can view all blog posts" ON blog_posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert blog posts" ON blog_posts;
CREATE POLICY "Admins can insert blog posts" ON blog_posts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update blog posts" ON blog_posts;
CREATE POLICY "Admins can update blog posts" ON blog_posts
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete blog posts" ON blog_posts;
CREATE POLICY "Admins can delete blog posts" ON blog_posts
  FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
