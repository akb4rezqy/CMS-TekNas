import { getServiceSupabase } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

const TABLE_NAME = "page_settings"
const TABLE_MISSING_MSG = "Tabel page_settings belum dibuat. Silakan jalankan SQL berikut di Supabase SQL Editor: CREATE TABLE IF NOT EXISTS page_settings (id TEXT PRIMARY KEY DEFAULT 'main', settings JSONB NOT NULL DEFAULT '{}', updated_at TIMESTAMPTZ DEFAULT now()); ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY; CREATE POLICY \"anon_read_page_settings\" ON page_settings FOR SELECT TO anon USING (true);"

function isTableMissing(error: any): boolean {
  const msg = error?.message || ""
  return msg.includes("does not exist") || msg.includes("schema cache") || error?.code === "42P01"
}

export async function GET() {
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", "main")
      .single()

    if (error) {
      if (isTableMissing(error)) {
        return NextResponse.json({ success: true, data: null, tableExists: false })
      }
      if (error.code === "PGRST116") {
        return NextResponse.json({ success: true, data: null, tableExists: true })
      }
      return NextResponse.json({ success: true, data: null, tableExists: true })
    }

    return NextResponse.json({ success: true, data: data?.settings || null, tableExists: true })
  } catch {
    return NextResponse.json({ success: true, data: null, tableExists: false })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = getServiceSupabase()

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert({ id: "main", settings: body, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .select()
      .single()

    if (error) {
      if (isTableMissing(error)) {
        return NextResponse.json({ success: false, error: TABLE_MISSING_MSG }, { status: 500 })
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data?.settings })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
