import { getServiceSupabase } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = getServiceSupabase()
    const results: string[] = []

    const testAnn = await supabase.from("announcements").select("image_url").limit(1)
    if (testAnn.error && testAnn.error.message.includes("image_url")) {
      results.push("announcements.image_url column needs to be added")
    } else {
      results.push("announcements.image_url already exists")
    }

    const testGender = await supabase.from("staff_teachers").select("gender").limit(1)
    if (testGender.error && testGender.error.message.includes("gender")) {
      results.push("staff_teachers.gender column needs to be added")
    } else {
      results.push("staff_teachers.gender already exists")
    }

    const testPhoto = await supabase.from("staff_teachers").select("photo_url").limit(1)
    if (testPhoto.error && testPhoto.error.message.includes("photo_url")) {
      results.push("staff_teachers.photo_url column needs to be added")
    } else {
      results.push("staff_teachers.photo_url already exists")
    }

    const testOrg = await supabase.from("org_structure").select("id").limit(1)
    if (testOrg.error) {
      results.push("org_structure table needs to be created")
    } else {
      results.push("org_structure table already exists")
    }

    return NextResponse.json({
      success: true,
      results,
      sql_to_run: `
-- Run this in Supabase SQL Editor:
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
      `.trim()
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
