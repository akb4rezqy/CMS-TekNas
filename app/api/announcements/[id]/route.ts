import { AnnouncementsService } from "@/lib/services/announcements-service"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const result = await AnnouncementsService.update(id, body)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await AnnouncementsService.delete(id)
  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}
