import { getServiceSupabase } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"

const HASH_SALT = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 16) || "analytics-salt"

export async function POST(req: NextRequest) {
  try {
    const { page, referrer } = await req.json()
    if (!page) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded?.split(",")[0]?.trim() || "unknown"
    const userAgent = req.headers.get("user-agent") || ""

    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)
    const device = isMobile ? "mobile" : "desktop"

    const ipHash = createHash("sha256").update(ip + HASH_SALT).digest("hex").slice(0, 32)

    const { error } = await supabase.from("page_views").insert({
      page,
      referrer: referrer || null,
      ip_hash: ipHash,
      device,
      user_agent: null,
    } as any)

    if (error) {
      console.error("[Analytics POST]", error.message)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[Analytics POST] Exception:", err)
    return NextResponse.json({ success: true })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { page } = await req.json()
    if (!page) {
      return NextResponse.json({ success: false, error: "Page required" }, { status: 400 })
    }
    const supabase = getServiceSupabase()
    const { error } = await supabase
      .from("page_views")
      .delete()
      .eq("page", page)
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceSupabase()
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "7d"

    let daysAgo = 7
    if (period === "30d") daysAgo = 30
    if (period === "today") daysAgo = 0

    const startDate = new Date()
    if (daysAgo === 0) {
      startDate.setHours(0, 0, 0, 0)
    } else {
      startDate.setDate(startDate.getDate() - daysAgo)
      startDate.setHours(0, 0, 0, 0)
    }

    const { data: allViews, error } = await supabase
      .from("page_views")
      .select("page, ip_hash, device, visited_at")
      .gte("visited_at", startDate.toISOString())
      .order("visited_at", { ascending: true })

    if (error) {
      if (error.message?.includes("does not exist") || error.code === "42P01") {
        return NextResponse.json({
          success: true,
          data: {
            totalViews: 0,
            uniqueVisitors: 0,
            todayViews: 0,
            topPages: [],
            dailyViews: [],
            deviceStats: { mobile: 0, desktop: 0 },
          },
          tableExists: false,
        })
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const views = allViews || []
    const totalViews = views.length

    const uniqueIps = new Set(views.map((v: any) => v.ip_hash))
    const uniqueVisitors = uniqueIps.size

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayViews = views.filter((v: any) => new Date(v.visited_at) >= todayStart).length

    const pageCounts: Record<string, number> = {}
    views.forEach((v: any) => {
      pageCounts[v.page] = (pageCounts[v.page] || 0) + 1
    })
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }))

    const dailyCounts: Record<string, number> = {}
    const numDays = daysAgo === 0 ? 0 : daysAgo
    for (let i = numDays; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split("T")[0]
      dailyCounts[key] = 0
    }
    views.forEach((v: any) => {
      const key = new Date(v.visited_at).toISOString().split("T")[0]
      if (dailyCounts[key] !== undefined) {
        dailyCounts[key]++
      }
    })
    const dailyViews = Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      views: count,
    }))

    let mobileCount = 0
    let desktopCount = 0
    views.forEach((v: any) => {
      if (v.device === "mobile") mobileCount++
      else desktopCount++
    })

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors,
        todayViews,
        topPages,
        dailyViews,
        deviceStats: { mobile: mobileCount, desktop: desktopCount },
      },
      tableExists: true,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
