"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save, Eye, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface PageSettings {
  heroTitle: string
  heroSubtitle: string
  heroPrimaryButtonText: string
  heroSecondaryButtonText: string
  principalName: string
  principalTitle: string
  principalWelcomeText: string
  principalMessage1: string
  principalMessage2: string
  schoolVision: string
  schoolMissions: string[]
  ctaTitle: string
  ctaSubtitle: string
  ctaButtonText: string
  siteTitle: string
  siteDescription: string
}

const DEFAULT_SETTINGS: PageSettings = {
  heroTitle: "Masa Depan Teknologi Dimulai di SMK TEKNOLOGI NASIONAL",
  heroSubtitle:
    "Kami berkomitmen untuk membentuk generasi teknologi unggul melalui pendidikan vokasi yang inovatif dan lingkungan belajar yang inspiratif.",
  heroPrimaryButtonText: "Daftar Sekarang",
  heroSecondaryButtonText: "Jelajahi Program",
  principalName: "Bapak Budi Santoso, S.Pd.",
  principalTitle: "Kepala SMK TEKNOLOGI NASIONAL",
  principalWelcomeText: "Assalamu'alaikum Warahmatullahi Wabarakatuh.",
  principalMessage1:
    "Dengan rasa syukur dan bangga, saya menyambut Anda di website resmi SMK TEKNOLOGI NASIONAL. Kami berkomitmen untuk menyediakan lingkungan belajar teknologi yang inspiratif dan kondusif, di mana setiap siswa dapat mengembangkan potensi teknis, inovasi, dan keterampilan industri 4.0.",
  principalMessage2:
    "Kami percaya bahwa pendidikan teknologi adalah kunci masa depan Indonesia. Oleh karena itu, kami terus berinovasi dalam kurikulum vokasi, fasilitas laboratorium, dan metode pembelajaran praktis untuk mempersiapkan generasi teknisi yang kompeten, berkarakter, dan siap menghadapi tantangan industri global.",
  schoolVision:
    "Menjadi sekolah menengah kejuruan teknologi terdepan yang menghasilkan lulusan kompeten, inovatif, berkarakter mulia, dan siap bersaing di era industri 4.0.",
  schoolMissions: [
    "Menyelenggarakan pendidikan vokasi teknologi berkualitas yang berorientasi pada industri.",
    "Membentuk karakter siswa yang religius, mandiri, dan berjiwa technopreneurship.",
    "Mengembangkan kompetensi teknis dan soft skills siswa secara optimal.",
    "Menciptakan lingkungan belajar yang aman, nyaman, dan berbasis teknologi terkini.",
    "Membangun kemitraan strategis dengan industri, orang tua, dan masyarakat.",
  ],
  ctaTitle: "Siap Bergabung dengan Keluarga SMK TEKNOLOGI NASIONAL?",
  ctaSubtitle:
    "Daftarkan putra-putri Anda sekarang dan berikan mereka pendidikan teknologi vokasi terbaik untuk masa depan yang cerah.",
  ctaButtonText: "Daftar Sekarang",
  siteTitle: "SMK TEKNOLOGI NASIONAL",
  siteDescription: "Sekolah menengah kejuruan teknologi terdepan yang menghasilkan generasi unggul untuk industri 4.0",
}

export default function PageSettingsPage() {
  const [settings, setSettings] = useState<PageSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tableExists, setTableExists] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/page-settings")
        const result = await res.json()
        if (result.success && result.data) {
          setSettings({ ...DEFAULT_SETTINGS, ...result.data })
        }
        if (result.tableExists === false) {
          setTableExists(false)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/page-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: "Pengaturan berhasil disimpan" })
      } else {
        toast({
          title: "Terjadi kesalahan",
          description: result.error || "Gagal menyimpan pengaturan",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleMissionChange = (index: number, value: string) => {
    const newMissions = [...settings.schoolMissions]
    newMissions[index] = value
    setSettings((prev) => ({ ...prev, schoolMissions: newMissions }))
  }

  const addMission = () => {
    setSettings((prev) => ({
      ...prev,
      schoolMissions: [...prev.schoolMissions, ""],
    }))
  }

  const removeMission = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      schoolMissions: prev.schoolMissions.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pengaturan Halaman</h1>
          <p className="text-muted-foreground">Kelola konten halaman utama website</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview Website
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Perubahan
          </Button>
        </div>
      </div>

      {!tableExists && (
        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="p-4">
            <p className="text-sm text-orange-800 font-medium">
              Tabel pengaturan halaman belum dibuat di database. Konten di bawah ini adalah default dan belum bisa disimpan.
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Jalankan SQL dari file <code className="bg-orange-100 px-1 rounded">scripts/create-tables.sql</code> di Supabase SQL Editor untuk mengaktifkan fitur simpan.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Umum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Judul Website</Label>
                <Input
                  id="siteTitle"
                  value={settings.siteTitle}
                  onChange={(e) => setSettings((prev) => ({ ...prev, siteTitle: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Deskripsi Website</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Judul Utama</Label>
              <Textarea
                id="heroTitle"
                value={settings.heroTitle}
                onChange={(e) => setSettings((prev) => ({ ...prev, heroTitle: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Subjudul</Label>
              <Textarea
                id="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={(e) => setSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="heroPrimaryButton">Tombol Utama</Label>
                <Input
                  id="heroPrimaryButton"
                  value={settings.heroPrimaryButtonText}
                  onChange={(e) => setSettings((prev) => ({ ...prev, heroPrimaryButtonText: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSecondaryButton">Tombol Kedua</Label>
                <Input
                  id="heroSecondaryButton"
                  value={settings.heroSecondaryButtonText}
                  onChange={(e) => setSettings((prev) => ({ ...prev, heroSecondaryButtonText: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sambutan Kepala Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="principalName">Nama Kepala Sekolah</Label>
                <Input
                  id="principalName"
                  value={settings.principalName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, principalName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="principalTitle">Jabatan</Label>
                <Input
                  id="principalTitle"
                  value={settings.principalTitle}
                  onChange={(e) => setSettings((prev) => ({ ...prev, principalTitle: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="principalWelcome">Salam Pembuka</Label>
              <Input
                id="principalWelcome"
                value={settings.principalWelcomeText}
                onChange={(e) => setSettings((prev) => ({ ...prev, principalWelcomeText: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="principalMessage1">Pesan Pertama</Label>
              <Textarea
                id="principalMessage1"
                value={settings.principalMessage1}
                onChange={(e) => setSettings((prev) => ({ ...prev, principalMessage1: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="principalMessage2">Pesan Kedua</Label>
              <Textarea
                id="principalMessage2"
                value={settings.principalMessage2}
                onChange={(e) => setSettings((prev) => ({ ...prev, principalMessage2: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profil Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schoolVision">Visi Sekolah</Label>
              <Textarea
                id="schoolVision"
                value={settings.schoolVision}
                onChange={(e) => setSettings((prev) => ({ ...prev, schoolVision: e.target.value }))}
                rows={3}
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Misi Sekolah</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMission}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Misi
                </Button>
              </div>
              {settings.schoolMissions.map((mission, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Textarea
                      value={mission}
                      onChange={(e) => handleMissionChange(index, e.target.value)}
                      placeholder={`Misi ${index + 1}`}
                      rows={2}
                    />
                  </div>
                  {settings.schoolMissions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMission(index)}
                      className="mt-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call to Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ctaTitle">Judul CTA</Label>
              <Textarea
                id="ctaTitle"
                value={settings.ctaTitle}
                onChange={(e) => setSettings((prev) => ({ ...prev, ctaTitle: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaSubtitle">Subjudul CTA</Label>
              <Textarea
                id="ctaSubtitle"
                value={settings.ctaSubtitle}
                onChange={(e) => setSettings((prev) => ({ ...prev, ctaSubtitle: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaButton">Teks Tombol CTA</Label>
              <Input
                id="ctaButton"
                value={settings.ctaButtonText}
                onChange={(e) => setSettings((prev) => ({ ...prev, ctaButtonText: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" className="shadow-lg">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Simpan Semua Perubahan
        </Button>
      </div>
    </div>
  )
}
