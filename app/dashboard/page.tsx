"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Users, Eye, Monitor, Smartphone, Plus, Loader2, TrendingUp, Globe, Trash2 } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  todayViews: number
  topPages: { page: string; count: number }[]
  dailyViews: { date: string; views: number }[]
  deviceStats: { mobile: number; desktop: number }
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Beranda",
  "/pengumuman": "Pengumuman",
  "/galeri": "Galeri",
  "/ekstrakurikuler": "Ekstrakurikuler",
  "/profil": "Profil",
  "/kontak": "Kontak",
  "/asesmen": "Asesmen",
  "/struktur-organisasi": "Struktur Organisasi",
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("7d")
  const [recentItems, setRecentItems] = useState<any[]>([])
  const [tableExists, setTableExists] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/analytics?period=${period}`)
        const result = await res.json()
        if (result.success) {
          setAnalytics(result.data)
          if (result.tableExists === false) setTableExists(false)
        }
      } catch {}
      setLoading(false)
    }

    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/announcements")
        const result = await res.json()
        if (result.success && result.data) {
          setRecentItems(result.data.slice(0, 5))
        }
      } catch {}
    }

    fetchAnalytics()
    fetchRecent()
  }, [period])

  const deletePageViews = async (page: string) => {
    try {
      const res = await fetch("/api/analytics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page }),
      })
      const result = await res.json()
      if (result.success && analytics) {
        setAnalytics({
          ...analytics,
          topPages: analytics.topPages.filter((p) => p.page !== page),
          totalViews: analytics.totalViews - (analytics.topPages.find((p) => p.page === page)?.count || 0),
        })
      }
    } catch {}
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00")
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
  }

  const mobilePercent = analytics
    ? analytics.totalViews > 0
      ? Math.round((analytics.deviceStats.mobile / analytics.totalViews) * 100)
      : 0
    : 0
  const desktopPercent = analytics
    ? analytics.totalViews > 0
      ? Math.round((analytics.deviceStats.desktop / analytics.totalViews) * 100)
      : 0
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang di Admin Dashboard SMK TEKNOLOGI NASIONAL</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { label: "Hari ini", value: "today" },
            { label: "7 Hari", value: "7d" },
            { label: "30 Hari", value: "30d" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                period === p.value ? "bg-white shadow-sm font-medium text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {!tableExists && (
        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="p-4">
            <p className="text-sm text-orange-800 font-medium">
              Tabel analytics belum dibuat di database. Jalankan SQL di Supabase SQL Editor untuk mengaktifkan tracking pengunjung.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kunjungan</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.totalViews ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengunjung Unik</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.uniqueVisitors ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kunjungan Hari Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.todayViews ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perangkat</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Smartphone className="h-3.5 w-3.5 text-blue-500" />
                  <span>Mobile {mobilePercent}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Monitor className="h-3.5 w-3.5 text-green-500" />
                  <span>Desktop {desktopPercent}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Grafik Kunjungan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : analytics?.dailyViews && analytics.dailyViews.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={analytics.dailyViews}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(10,46,125,1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgba(10,46,125,1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  allowDecimals={false}
                />
                <Tooltip
                  labelFormatter={(label) => {
                    const d = new Date(label + "T00:00:00")
                    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                  }}
                  formatter={(value: number) => [value, "Kunjungan"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="rgba(10,46,125,1)"
                  strokeWidth={2}
                  fill="url(#viewsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Belum ada data kunjungan</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Halaman Populer</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : analytics?.topPages && analytics.topPages.length > 0 ? (
              <div className="space-y-3">
                {analytics.topPages.map((item, i) => (
                  <div key={item.page} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-muted-foreground w-5">{i + 1}.</span>
                      <span className="text-sm font-medium truncate max-w-[180px]">{PAGE_LABELS[item.page] || item.page}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-[rgba(10,46,125,0.15)]" style={{ width: `${Math.max(40, (item.count / (analytics.topPages[0]?.count || 1)) * 100)}px` }}>
                        <div
                          className="h-full rounded-full bg-[rgba(10,46,125,1)]"
                          style={{ width: `${(item.count / (analytics.topPages[0]?.count || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-10 text-right">{item.count}</span>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus data kunjungan untuk halaman "${PAGE_LABELS[item.page] || item.page}"?`)) {
                            deletePageViews(item.page)
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                        title="Hapus data kunjungan"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada aktivitas</p>
            ) : (
              recentItems.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/content/announcements">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pengumuman
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/dashboard/content/gallery">
                <Plus className="mr-2 h-4 w-4" />
                Upload Foto Galeri
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/" target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Lihat Website
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
