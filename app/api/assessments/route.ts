import { AssessmentsService } from "@/lib/services/assessments-service"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const grade = searchParams.get("grade")
  const major = searchParams.get("major")

  if (grade && major) {
    const result = await AssessmentsService.getByClass(grade, major)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  }

  const result = await AssessmentsService.getAll()
  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await AssessmentsService.create(body)
    return NextResponse.json(result, { status: result.success ? 201 : 500 })
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
