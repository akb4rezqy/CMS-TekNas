import { getServiceSupabase } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = getServiceSupabase()

    const { error } = await supabase.rpc("exec_sql", {
      query: `CREATE TABLE IF NOT EXISTS assessments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        class_grade VARCHAR(5) NOT NULL,
        class_major VARCHAR(5) NOT NULL,
        subject_name TEXT NOT NULL,
        gform_link TEXT NOT NULL,
        day_name VARCHAR(10) NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );`,
    })

    if (error) {
      const { error: directError } = await supabase.from("assessments").select("id").limit(1)
      if (directError && directError.message.includes("does not exist")) {
        return NextResponse.json({
          success: false,
          error: "Tabel belum ada. Silakan jalankan SQL berikut di Supabase SQL Editor:",
          sql: `CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_grade VARCHAR(5) NOT NULL,
  class_major VARCHAR(5) NOT NULL,
  subject_name TEXT NOT NULL,
  gform_link TEXT NOT NULL,
  day_name VARCHAR(10) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`,
        })
      }
      return NextResponse.json({ success: true, message: "Tabel sudah ada" })
    }

    return NextResponse.json({ success: true, message: "Tabel berhasil dibuat" })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
