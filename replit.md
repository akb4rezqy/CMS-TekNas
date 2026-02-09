# Website Teknas - SMK Teknologi Nasional

## Overview
School website for SMK Teknologi Nasional built with Next.js 16, React 18, Tailwind CSS, and Supabase as the backend database.

## Recent Changes
- 2026-02-09: Migrated from Vercel to Replit. Updated port binding to 5000 and host to 0.0.0.0. Removed deprecated eslint config from next.config.mjs.

## Project Architecture
- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI**: Tailwind CSS, Radix UI, shadcn/ui components
- **Backend**: Supabase (client + admin/service role)
- **Package Manager**: npm
- **Port**: 5000

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `app/api/school/` - REST API for school data (classes, grades, schedules, subjects, users)
- `app/dashboard/` - Admin dashboard
- `components/` - Reusable UI components (shadcn/ui based)
- `lib/supabase/` - Supabase client configuration (client, browser, admin)
- `hooks/` - Custom React hooks
- `public/` - Static assets
- `scripts/` - Utility scripts
- `styles/` - Global styles

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `SUPABASE_URL` - Supabase project URL (server-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side, secret)

## User Preferences
- Language: Indonesian (Bahasa Indonesia)
