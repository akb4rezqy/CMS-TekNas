"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2, GraduationCap, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StaffTeacher {
  id: string
  name: string
  position: string
  description: string
  created_at: string
  updated_at: string
}

export default function StaffTeachersPage() {
  const [staffTeachers, setStaffTeachers] = useState<StaffTeacher[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", position: "", description: "" })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

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
    } catch (err) {
      setError("Network error occurred")
      toast({ title: "Terjadi kesalahan", description: "Gagal memuat data staff", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffTeachers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        const res = await fetch(`/api/staff-teachers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
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
          body: JSON.stringify(formData),
        })
        const result = await res.json()
        if (result.success) {
          await fetchStaffTeachers()
          toast({ title: "Data staff berhasil ditambahkan" })
        } else {
          throw new Error(result.error || "Create failed")
        }
      }

      setFormData({ name: "", position: "", description: "" })
      setShowForm(false)
      setEditingId(null)
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
    setFormData({ name: "", position: "", description: "" })
    setEditingId(null)
    setShowForm(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
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

      {/* Staff Grid */}
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
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={`/placeholder-80x80.png?height=80&width=80&text=${getInitials(staff.name)}`} />
                    <AvatarFallback className="text-lg font-semibold">{getInitials(staff.name)}</AvatarFallback>
                  </Avatar>
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

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Data Staff" : "Tambah Data Staff"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data Staff</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Apakah Anda yakin ingin menghapus data staff ini? Tindakan ini tidak dapat dibatalkan.
          </p>
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
