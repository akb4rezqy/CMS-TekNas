import { GalleryService } from "@/lib/services/gallery-service"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const result = await GalleryService.getAll()
  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await GalleryService.create(body)
    return NextResponse.json(result, { status: result.success ? 201 : 500 })
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
