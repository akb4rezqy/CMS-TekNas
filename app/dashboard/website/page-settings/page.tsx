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
  // Hero Section
  heroTitle: string
  heroSubtitle: string
  heroPrimaryButtonText: string
  heroSecondaryButtonText: string

  // Principal Section
  principalName: string
  principalTitle: string
  principalWelcomeText: string
  principalMessage1: string
  principalMessage2: string

  // School Profile
  schoolVision: string
  schoolMissions: string[]

  // CTA Section
  ctaTitle: string
  ctaSubtitle: string
  ctaButtonText: string

  // Meta
  siteTitle: string
  siteDescription: string
}

export default function PageSettingsPage() {
  const [settings, setSettings] = useState<PageSettings>({
    // Hero Section
    heroTitle: "Masa Depan Cerah Dimulai di Sekolah Harapan Bangsa",
    heroSubtitle:
      "Kami berkomitmen untuk membentuk generasi unggul melalui pendidikan holistik dan lingkungan belajar yang inspiratif.",
    heroPrimaryButtonText: "Daftar Sekarang",
    heroSecondaryButtonText: "Jelajahi Program",

    // Principal Section
    principalName: "Bapak Budi Santoso, S.Pd.",
    principalTitle: "Kepala Sekolah Harapan Bangsa",
    principalWelcomeText: "Assalamu'alaikum Warahmatullahi Wabarakatuh.",
    principalMessage1:
      "Dengan rasa syukur dan bangga, saya menyambut Anda di website resmi Sekolah Harapan Bangsa. Kami berkomitmen untuk menyediakan lingkungan belajar yang inspiratif dan kondusif, di mana setiap siswa dapat mengembangkan potensi akademik, karakter, dan keterampilan hidup.",
    principalMessage2:
      "Kami percaya bahwa pendidikan adalah kunci masa depan. Oleh karena itu, kami terus berinovasi dalam kurikulum, fasilitas, dan metode pengajaran untuk mempersiapkan generasi muda yang cerdas, berakhlak mulia, dan siap menghadapi tantangan global.",

    // School Profile
    schoolVision:
      "Menjadi institusi pendidikan terdepan yang menghasilkan generasi unggul, berkarakter mulia, berwawasan global, dan berdaya saing tinggi.",
    schoolMissions: [
      "Menyelenggarakan pendidikan berkualitas yang berpusat pada siswa.",
      "Membentuk karakter siswa yang religius, mandiri, dan bertanggung jawab.",
      "Mengembangkan potensi akademik dan non-akademik siswa secara optimal.",
      "Menciptakan lingkungan belajar yang aman, nyaman, dan inovatif.",
      "Membangun kemitraan yang kuat dengan orang tua dan masyarakat.",
    ],

    // CTA Section
    ctaTitle: "Siap Bergabung dengan Keluarga Sekolah Harapan Bangsa?",
    ctaSubtitle: "Daftarkan putra-putri Anda sekarang dan berikan mereka pendidikan terbaik untuk masa depan cerah.",
    ctaButtonText: "Daftar Sekarang",

    // Meta
    siteTitle: "Sekolah Harapan Bangsa",
    siteDescription: "Sekolah terdepan yang menghasilkan generasi unggul dan berkarakter mulia",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Load settings on component mount
  useEffect(() => {
    // Mock loading - in real implementation, load from database
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Mock save - in real implementation, save to database
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({ title: "Pengaturan berhasil disimpan" })
    } catch (error) {
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
      <div className="flex justify-between items-center">
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

      <div className="grid gap-6">
        {/* Meta Settings */}
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
                  placeholder="Masukkan judul website"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Deskripsi Website</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
                  placeholder="Masukkan deskripsi website"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
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
                placeholder="Masukkan judul utama hero section"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Subjudul</Label>
              <Textarea
                id="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={(e) => setSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                placeholder="Masukkan subjudul hero section"
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
                  placeholder="Teks tombol utama"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSecondaryButton">Tombol Kedua</Label>
                <Input
                  id="heroSecondaryButton"
                  value={settings.heroSecondaryButtonText}
                  onChange={(e) => setSettings((prev) => ({ ...prev, heroSecondaryButtonText: e.target.value }))}
                  placeholder="Teks tombol kedua"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Principal Section */}
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
                  placeholder="Nama lengkap kepala sekolah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="principalTitle">Jabatan</Label>
                <Input
                  id="principalTitle"
                  value={settings.principalTitle}
                  onChange={(e) => setSettings((prev) => ({ ...prev, principalTitle: e.target.value }))}
                  placeholder="Jabatan kepala sekolah"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="principalWelcome">Salam Pembuka</Label>
              <Input
                id="principalWelcome"
                value={settings.principalWelcomeText}
                onChange={(e) => setSettings((prev) => ({ ...prev, principalWelcomeText: e.target.value }))}
                placeholder="Salam pembuka"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="principalMessage1">Pesan Pertama</Label>
              <Textarea
                id="principalMessage1"
                value={settings.principalMessage1}
                onChange={(e) => setSettings((prev) => ({ ...prev, principalMessage1: e.target.value }))}
                placeholder="Pesan pertama kepala sekolah"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="principalMessage2">Pesan Kedua</Label>
              <Textarea
                id="principalMessage2"
                value={settings.principalMessage2}
                onChange={(e) => setSettings((prev) => ({ ...prev, principalMessage2: e.target.value }))}
                placeholder="Pesan kedua kepala sekolah"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* School Profile */}
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
                placeholder="Masukkan visi sekolah"
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

        {/* CTA Section */}
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
                placeholder="Masukkan judul call to action"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaSubtitle">Subjudul CTA</Label>
              <Textarea
                id="ctaSubtitle"
                value={settings.ctaSubtitle}
                onChange={(e) => setSettings((prev) => ({ ...prev, ctaSubtitle: e.target.value }))}
                placeholder="Masukkan subjudul call to action"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaButton">Teks Tombol CTA</Label>
              <Input
                id="ctaButton"
                value={settings.ctaButtonText}
                onChange={(e) => setSettings((prev) => ({ ...prev, ctaButtonText: e.target.value }))}
                placeholder="Teks tombol call to action"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button (Sticky) */}
      <div className="sticky bottom-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" className="shadow-lg">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Simpan Semua Perubahan
        </Button>
      </div>
    </div>
  )
}
