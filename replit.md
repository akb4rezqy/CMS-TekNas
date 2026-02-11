# Website Teknas - SMK Teknologi Nasional

## Overview
School website for SMK Teknologi Nasional built with Next.js 16, React 18, Tailwind CSS, and Supabase as the backend database.

## Recent Changes
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
- `app/api/announcements/` - REST API for announcements CRUD
- `app/api/gallery/` - REST API for gallery CRUD
- `app/api/extracurriculars/` - REST API for extracurriculars CRUD
- `app/api/staff-teachers/` - REST API for staff & teachers CRUD
- `app/api/upload/` - Image upload API (Supabase Storage)
- `app/api/school/` - REST API for school data (classes, grades, schedules, subjects, users)
- `app/dashboard/` - Admin dashboard
- `components/` - Reusable UI components (shadcn/ui based)
- `lib/supabase/` - Supabase client configuration (client, browser, admin)
- `lib/services/` - Supabase service classes for each entity
- `hooks/` - Custom React hooks (useApi for public pages)
- `public/` - Static assets
- `scripts/` - Utility scripts (includes create-tables.sql for Supabase setup)
- `styles/` - Global styles

### Supabase Tables
- `announcements` - School announcements (title, content, date, author, status)
- `gallery` - Photo gallery (title, description, images[])
- `extracurriculars` - Extracurricular activities (title, description, images[])
- `staff_teachers` - Staff & teacher data (name, position, description)

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `SUPABASE_URL` - Supabase project URL (server-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side, secret)

## User Preferences
- Language: Indonesian (Bahasa Indonesia)
