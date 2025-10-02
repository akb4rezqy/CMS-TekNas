insert into public.users (email, full_name, role)
values
  ('admin@school.local', 'Admin One', 'admin'),
  ('alice@school.local', 'Alice Teacher', 'teacher'),
  ('bob@school.local', 'Bob Student', 'student')
on conflict (email) do nothing;

insert into public.classes (name, grade_level)
values
  ('Class A', 7),
  ('Class B', 8)
on conflict do nothing;

-- Link subject to teacher Alice
with t as (
  select id as teacher_id from public.users where email='alice@school.local' limit 1
)
insert into public.subjects (name, teacher_id)
select 'Mathematics', teacher_id from t
on conflict do nothing;

-- Enroll Bob to Class A
with s as (select id as student_id from public.users where email='bob@school.local' limit 1),
     c as (select id as class_id from public.classes where name='Class A' limit 1)
insert into public.enrollments (student_id, class_id)
select s.student_id, c.class_id from s, c
on conflict do nothing;

-- Create one schedule for Class A Mathematics
with c as (select id as class_id from public.classes where name='Class A' limit 1),
     sub as (select id as subject_id, teacher_id from public.subjects where name='Mathematics' limit 1)
insert into public.schedules (class_id, subject_id, teacher_id, day_of_week, start_time, end_time)
select c.class_id, sub.subject_id, sub.teacher_id, 1, '08:00', '09:00' from c, sub
on conflict do nothing;

-- One grade for Bob in Mathematics
with s as (select id as student_id from public.users where email='bob@school.local' limit 1),
     sub as (select id as subject_id from public.subjects where name='Mathematics' limit 1)
insert into public.grades (student_id, subject_id, score, graded_at)
select s.student_id, sub.subject_id, 85.50, now()::date from s, sub
on conflict do nothing;
