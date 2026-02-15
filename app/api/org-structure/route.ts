import { OrgStructureService } from "@/lib/services/org-structure-service"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const result = await OrgStructureService.getAll()
  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await OrgStructureService.create(body)
    return NextResponse.json(result, { status: result.success ? 201 : 500 })
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
