-- Enable extensions (if not enabled)
create extension if not exists "uuid-ossp";

-- Roles
create type user_role as enum ('admin', 'teacher', 'student');

-- Users (profiles)
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text not null,
  role user_role not null default 'student',
  created_at timestamp with time zone default now()
);

-- Classes
create table if not exists public.classes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  grade_level int not null check (grade_level between 1 and 12),
  created_at timestamp with time zone default now()
);

-- Subjects
create table if not exists public.subjects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  teacher_id uuid references public.users(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- Enrollments (student -> class)
create table if not exists public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.users(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  unique (student_id, class_id),
  created_at timestamp with time zone default now()
);

-- Grades (student <-> subject)
create table if not exists public.grades (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  score numeric(5,2) not null check (score >= 0 and score <= 100),
  graded_at date not null default now(),
  created_at timestamp with time zone default now()
);

-- Schedules (class schedule per subject)
create table if not exists public.schedules (
  id uuid primary key default uuid_generate_v4(),
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  teacher_id uuid references public.users(id) on delete set null,
  day_of_week int not null check (day_of_week between 1 and 7), -- 1=Mon
  start_time time not null,
  end_time time not null,
  created_at timestamp with time zone default now(),
  check (end_time > start_time)
);
