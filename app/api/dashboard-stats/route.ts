import { getServiceSupabase } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = getServiceSupabase()

    const [announcements, extracurriculars, gallery, staffTeachers] = await Promise.all([
      supabase.from("announcements").select("id", { count: "exact", head: true }),
      supabase.from("extracurriculars").select("id", { count: "exact", head: true }),
      supabase.from("gallery").select("id", { count: "exact", head: true }),
      supabase.from("staff_teachers").select("id", { count: "exact", head: true }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        announcements: announcements.count ?? 0,
        extracurriculars: extracurriculars.count ?? 0,
        gallery: gallery.count ?? 0,
        staffTeachers: staffTeachers.count ?? 0,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
