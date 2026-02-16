# Website Teknas - SMK Teknologi Nasional

## Overview
School website for SMK Teknologi Nasional built with Next.js 16, React 18, Tailwind CSS, and Supabase as the backend database.

## Recent Changes
- 2026-02-16: Added custom web analytics system using Supabase page_views table. PageTracker component tracks all public page visits (excludes /dashboard and /login). Dashboard redesigned with analytics: total views, unique visitors, today's views, device stats, daily traffic chart (recharts), popular pages, and recent activity. Added period filter (today/7d/30d). Added Cloudflare Turnstile CAPTCHA on login. Principal photo upload in page settings. Admin session reduced to 5 hours.
- 2026-02-15: Added image support for announcements (upload in admin, display in public pages). 3 latest announcements shown on homepage and in announcement detail pages. Added profile photo & gender selection for staff/teachers with default male/female avatars. Added organizational structure management (admin CRUD + sidebar menu). Added delete confirmation dialog for messages. Database migration needed for new columns.
- 2026-02-12: Added hero background image and logo upload in page settings admin. Header/Footer dynamically show uploaded logo. Homepage hero uses uploaded background or gradient fallback. Added contact messages inbox at /dashboard/messages with view/delete. Added DELETE endpoint to /api/contact. Dashboard sidebar now includes "Komunikasi > Pesan Masuk" menu.
- 2026-02-11: Fixed page settings - admin panel now matches public page content (SMK TEKNOLOGI NASIONAL), with Supabase persistence via page_settings table. Dashboard stats now show real data from Supabase. Added /api/page-settings and /api/dashboard-stats API routes. Public homepage reads settings dynamically.
- 2026-02-11: Added image upload API (/api/upload) using Supabase Storage. Dashboard gallery/extracurriculars forms now upload images permanently. Fixed scroll animation hook for dynamic content. Added loading states to all public pages.
- 2026-02-11: Connected all dashboard & public pages to Supabase. Created API routes for announcements, gallery, extracurriculars, staff-teachers. Removed old external API references and localStorage-based services.
- 2026-02-09: Migrated from Vercel to Replit. Updated port binding to 5000 and host to 0.0.0.0. Removed deprecated eslint config from next.config.mjs. Fixed hydration errors.

## Project Architecture
- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI**: Tailwind CSS, Radix UI, shadcn/ui components
- **Backend**: Supabase (client + admin/service role)
- **Package Manager**: npm
- **Port**: 5000

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `app/api/announcements/` - REST API for announcements CRUD + /latest endpoint
- `app/api/gallery/` - REST API for gallery CRUD
- `app/api/extracurriculars/` - REST API for extracurriculars CRUD
- `app/api/staff-teachers/` - REST API for staff & teachers CRUD
- `app/api/org-structure/` - REST API for organizational structure CRUD
- `app/api/upload/` - Image upload API (Supabase Storage)
- `app/api/school/` - REST API for school data (classes, grades, schedules, subjects, users)
- `app/dashboard/` - Admin dashboard
- `app/dashboard/website/org-structure/` - Org structure management page
- `app/dashboard/akademik/asesmen/` - Assessment management page
- `app/asesmen/` - Public assessment page (select class, view subjects, gform links)
- `app/api/assessments/` - REST API for assessments CRUD
- `app/api/analytics/` - Web analytics API (POST track, GET stats)
- `components/analytics/page-tracker.tsx` - Client-side page view tracker
- `components/` - Reusable UI components (shadcn/ui based)
- `lib/supabase/` - Supabase client configuration (client, browser, admin)
- `lib/services/` - Supabase service classes for each entity
- `hooks/` - Custom React hooks (useApi for public pages)
- `public/` - Static assets (includes default-male.jpg, default-female.png)
- `scripts/` - Utility scripts (includes create-tables.sql for Supabase setup)
- `styles/` - Global styles

### Supabase Tables
- `announcements` - School announcements (title, content, date, author, status, image_url)
- `gallery` - Photo gallery (title, description, images[])
- `extracurriculars` - Extracurricular activities (title, description, images[])
- `staff_teachers` - Staff & teacher data (name, position, description, gender, photo_url)
- `page_settings` - Page settings (id='main', settings JSONB)
- `org_structure` - Organizational structure (position_name, person_name, parent_id, sort_order)
- `contact_messages` - Contact form messages (name, email, subject, message)
- `assessments` - Online assessments (class_grade, class_major, subject_name, gform_link, day_name, sort_order)
- `page_views` - Web analytics tracking (page, referrer, ip_hash, device, user_agent, visited_at)

### Database Migration (run in Supabase SQL Editor)
```sql
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE staff_teachers ADD COLUMN IF NOT EXISTS gender VARCHAR(10) DEFAULT 'male';
ALTER TABLE staff_teachers ADD COLUMN IF NOT EXISTS photo_url TEXT;
CREATE TABLE IF NOT EXISTS org_structure (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position_name TEXT NOT NULL,
  person_name TEXT NOT NULL,
  parent_id UUID REFERENCES org_structure(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_grade VARCHAR(5) NOT NULL,
  class_major VARCHAR(5) NOT NULL,
  subject_name TEXT NOT NULL,
  gform_link TEXT NOT NULL,
  day_name VARCHAR(10) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  referrer TEXT,
  ip_hash TEXT,
  device VARCHAR(10) DEFAULT 'desktop',
  user_agent TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
```

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `SUPABASE_URL` - Supabase project URL (server-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side, secret)
- `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile secret (optional, for CAPTCHA)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` - Cloudflare Turnstile site key (optional)

## User Preferences
- Language: Indonesian (Bahasa Indonesia)
