"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2, GraduationCap, AlertCircle, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface StaffTeacher {
  id: string
  name: string
  position: string
  description: string
  gender?: "male" | "female"
  photo_url?: string | null
  created_at: string
  updated_at: string
}

export default function StaffTeachersPage() {
  const [staffTeachers, setStaffTeachers] = useState<StaffTeacher[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
    gender: "male" as "male" | "female",
    photo_url: "" as string | null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const getDefaultPhoto = (gender: string) => {
    return gender === "female" ? "/default-female.png" : "/default-male.jpg"
  }

  const fetchStaffTeachers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/staff-teachers")
      const result = await res.json()
      if (result.success) {
        setStaffTeachers(result.data)
      } else {
        setError(result.error || "Failed to load staff teachers")
        toast({ title: "Terjadi kesalahan", description: result.error || "Gagal memuat data staff", variant: "destructive" })
      }
    } catch {
      setError("Network error occurred")
      toast({ title: "Terjadi kesalahan", description: "Gagal memuat data staff", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffTeachers()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("files", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const result = await res.json()
      if (result.success && result.urls?.[0]) {
        setFormData((prev) => ({ ...prev, photo_url: result.urls[0] }))
        toast({ title: "Foto berhasil diupload" })
      } else {
        toast({ title: "Gagal upload foto", description: result.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Gagal upload foto", variant: "destructive" })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const submitData = {
        name: formData.name,
        position: formData.position,
        description: formData.description,
        gender: formData.gender,
        photo_url: formData.photo_url || null,
      }

      if (editingId) {
        const res = await fetch(`/api/staff-teachers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        })
        const result = await res.json()
        if (result.success) {
          await fetchStaffTeachers()
          toast({ title: "Data staff berhasil diperbarui" })
        } else {
          throw new Error(result.error || "Update failed")
        }
      } else {
        const res = await fetch("/api/staff-teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        })
        const result = await res.json()
        if (result.success) {
          await fetchStaffTeachers()
          toast({ title: "Data staff berhasil ditambahkan" })
        } else {
          throw new Error(result.error || "Create failed")
        }
      }

      resetForm()
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan data staff",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (staff: StaffTeacher) => {
    setFormData({
      name: staff.name,
      position: staff.position,
      description: staff.description,
      gender: staff.gender || "male",
      photo_url: staff.photo_url || "",
    })
    setEditingId(staff.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/staff-teachers/${deleteId}`, { method: "DELETE" })
      const result = await res.json()
      if (result.success) {
        await fetchStaffTeachers()
        toast({ title: "Data staff berhasil dihapus" })
        setDeleteId(null)
      } else {
        throw new Error(result.error || "Delete failed")
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal menghapus data staff",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", position: "", description: "", gender: "male", photo_url: "" })
    setEditingId(null)
    setShowForm(false)
  }

  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Staff & Guru</h1>
            <p className="text-muted-foreground">Kelola data staff dan guru sekolah</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="font-semibold">Terjadi Kesalahan</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={fetchStaffTeachers}>Coba Lagi</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Staff & Guru</h1>
            <p className="text-muted-foreground">Kelola data staff dan guru sekolah</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Memuat data staff...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff & Guru</h1>
          <p className="text-muted-foreground">Kelola data staff dan guru sekolah</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Staff
        </Button>
      </div>

      {staffTeachers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Belum ada data staff</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {staffTeachers.map((staff) => (
            <Card key={staff.id} className="overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-muted">
                    <Image
                      src={staff.photo_url || getDefaultPhoto(staff.gender || "male")}
                      alt={staff.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <CardTitle className="text-lg">{staff.name}</CardTitle>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  {staff.position}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{staff.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(staff.created_at).toLocaleDateString("id-ID")}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(staff)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(staff.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Data Staff" : "Tambah Data Staff"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Foto Profil</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-muted shrink-0">
                  <Image
                    src={formData.photo_url || getDefaultPhoto(formData.gender)}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Upload className="h-4 w-4 mr-1" />
                      )}
                      Upload Foto
                    </Button>
                    {formData.photo_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, photo_url: "" }))}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Hapus
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Opsional. Jika tidak diupload, akan menggunakan foto default.</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Masukkan nama lengkap staff/guru"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value as "male" | "female" }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Jabatan</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                placeholder="Masukkan jabatan (contoh: Guru Matematika, Kepala Sekolah)"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Masukkan deskripsi singkat tentang staff/guru"
                rows={4}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Perbarui" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data Staff</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data staff ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
