export type UserRole = "admin" | "teacher" | "student"

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at?: string
}

export interface ClassRow {
  id: string
  name: string
  grade_level: number
  created_at?: string
}

export interface Subject {
  id: string
  name: string
  teacher_id: string | null
  created_at?: string
}

export interface Grade {
  id: string
  student_id: string
  subject_id: string
  score: number
  graded_at: string
  created_at?: string
}

export interface Schedule {
  id: string
  class_id: string
  subject_id: string
  teacher_id: string | null
  day_of_week: number
  start_time: string
  end_time: string
  created_at?: string
}
