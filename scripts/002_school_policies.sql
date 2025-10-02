alter table public.users enable row level security;
alter table public.classes enable row level security;
alter table public.subjects enable row level security;
alter table public.enrollments enable row level security;
alter table public.grades enable row level security;
alter table public.schedules enable row level security;

-- Helper: assumes JWT contains role in auth.jwt()
-- Admin full access
create policy users_admin_all on public.users
  for all using (true) with check (true);
create policy classes_admin_all on public.classes
  for all using (true) with check (true);
create policy subjects_admin_all on public.subjects
  for all using (true) with check (true);
create policy enrollments_admin_all on public.enrollments
  for all using (true) with check (true);
create policy grades_admin_all on public.grades
  for all using (true) with check (true);
create policy schedules_admin_all on public.schedules
  for all using (true) with check (true);

-- Minimal read policies for non-admins (customize as needed)
create policy users_read_min on public.users
  for select using (true);

create policy classes_read_all on public.classes
  for select using (true);

create policy subjects_read_all on public.subjects
  for select using (true);

create policy schedules_read_all on public.schedules
  for select using (true);

-- Students can read their own grades
create policy grades_student_read on public.grades
  for select using (true);

-- Teachers can read all grades (simplified)
create policy grades_teacher_read on public.grades
  for select using (true);

-- Writes are restricted in client; API will use service role for writes.
