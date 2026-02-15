import { AnnouncementsService } from "@/lib/services/announcements-service"
import { NextResponse } from "next/server"

export async function GET() {
  const result = await AnnouncementsService.getLatest(3)
  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}
