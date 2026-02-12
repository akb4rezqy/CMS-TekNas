-- Tabel Pengumuman
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  author TEXT NOT NULL DEFAULT 'Admin',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel Galeri
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel Ekstrakurikuler
CREATE TABLE IF NOT EXISTS extracurriculars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel Staff & Guru
CREATE TABLE IF NOT EXISTS staff_teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_teachers ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon users can read published content)
CREATE POLICY "anon_read_published_announcements" ON announcements
  FOR SELECT TO anon USING (status = 'published');

CREATE POLICY "anon_read_gallery" ON gallery
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_extracurriculars" ON extracurriculars
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_staff_teachers" ON staff_teachers
  FOR SELECT TO anon USING (true);

-- Tabel Pengaturan Halaman
CREATE TABLE IF NOT EXISTS page_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_page_settings" ON page_settings
  FOR SELECT TO anon USING (true);

-- Tabel Pesan Kontak
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
