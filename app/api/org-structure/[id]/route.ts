import { OrgStructureService } from "@/lib/services/org-structure-service"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const result = await OrgStructureService.update(id, body)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await OrgStructureService.delete(id)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
