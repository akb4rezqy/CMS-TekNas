-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create extracurriculars table
CREATE TABLE IF NOT EXISTS public.extracurriculars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  teacher_in_charge TEXT,
  schedule TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT,
  email TEXT,
  phone TEXT,
  image_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for website visitors)
CREATE POLICY "Allow public read access to published announcements" ON public.announcements
  FOR SELECT USING (published = true);

CREATE POLICY "Allow public read access to gallery" ON public.gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to extracurriculars" ON public.extracurriculars
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to staff" ON public.staff
  FOR SELECT USING (true);

-- Create policies for admin access (will be updated when auth is implemented)
CREATE POLICY "Allow admin full access to announcements" ON public.announcements
  FOR ALL USING (true);

CREATE POLICY "Allow admin full access to gallery" ON public.gallery
  FOR ALL USING (true);

CREATE POLICY "Allow admin full access to extracurriculars" ON public.extracurriculars
  FOR ALL USING (true);

CREATE POLICY "Allow admin full access to staff" ON public.staff
  FOR ALL USING (true);
