import { getServiceSupabase } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

function isTableMissing(error: any): boolean {
  const msg = error?.message || ""
  return msg.includes("does not exist") || msg.includes("schema cache") || error?.code === "42P01"
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "Semua field wajib diisi" }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
    })

    if (error) {
      if (isTableMissing(error)) {
        return NextResponse.json(
          { success: false, error: "Tabel contact_messages belum dibuat. Jalankan SQL setup di Supabase." },
          { status: 500 }
        )
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ success: false, error: "ID diperlukan" }, { status: 400 })
    }
    const supabase = getServiceSupabase()
    const { error } = await supabase.from("contact_messages").delete().eq("id", Number(id))
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      if (isTableMissing(error)) {
        return NextResponse.json({ success: true, data: [] })
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
