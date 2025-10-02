"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2, GraduationCap } from "lucide-react"
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
  const { toast } = useToast()

  // Mock data for now - will be replaced with Supabase
  useEffect(() => {
    const mockData: StaffTeacher[] = [
      {
        id: "1",
        name: "Bapak Budi Santoso, S.Pd.",
        position: "Kepala Sekolah",
        description:
          "Memimpin sekolah dengan visi mencerdaskan bangsa dan membentuk karakter siswa yang berakhlak mulia.",
        created_at: "2024-12-01T10:00:00Z",
        updated_at: "2024-12-01T10:00:00Z",
      },
      {
        id: "2",
        name: "Ibu Sari Dewi, S.Pd.",
        position: "Guru Matematika",
        description: "Mengajar matematika dengan metode yang menyenangkan dan mudah dipahami siswa.",
        created_at: "2024-11-28T14:30:00Z",
        updated_at: "2024-11-28T14:30:00Z",
      },
      {
        id: "3",
        name: "Bapak Ahmad Rizki, S.Pd.",
        position: "Guru Bahasa Indonesia",
        description: "Mengembangkan kemampuan berbahasa Indonesia siswa melalui pembelajaran yang interaktif.",
        created_at: "2024-11-25T09:15:00Z",
        updated_at: "2024-11-25T09:15:00Z",
      },
      {
        id: "4",
        name: "Ibu Maya Sari, S.Pd.",
        position: "Guru Bahasa Inggris",
        description: "Membantu siswa menguasai bahasa Inggris untuk menghadapi tantangan global.",
        created_at: "2024-11-20T16:45:00Z",
        updated_at: "2024-11-20T16:45:00Z",
      },
      {
        id: "5",
        name: "Bapak Doni Pratama, S.Pd.",
        position: "Guru Olahraga",
        description: "Membina kesehatan jasmani siswa melalui berbagai kegiatan olahraga yang menyenangkan.",
        created_at: "2024-11-15T11:20:00Z",
        updated_at: "2024-11-15T11:20:00Z",
      },
      {
        id: "6",
        name: "Ibu Rina Wati, S.Pd.",
        position: "Guru IPA",
        description: "Mengajarkan ilmu pengetahuan alam dengan pendekatan eksperimen dan praktikum.",
        created_at: "2024-11-10T13:30:00Z",
        updated_at: "2024-11-10T13:30:00Z",
      },
    ]

    setStaffTeachers(mockData)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        // Update existing staff
        const updatedStaff = {
          ...staffTeachers.find((staff) => staff.id === editingId)!,
          name: formData.name,
          position: formData.position,
          description: formData.description,
          updated_at: new Date().toISOString(),
        }
        setStaffTeachers((prev) => prev.map((staff) => (staff.id === editingId ? updatedStaff : staff)))
        toast({ title: "Data staff berhasil diperbarui" })
      } else {
        // Create new staff
        const newStaff: StaffTeacher = {
          id: Date.now().toString(),
          name: formData.name,
          position: formData.position,
          description: formData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setStaffTeachers((prev) => [newStaff, ...prev])
        toast({ title: "Data staff berhasil ditambahkan" })
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
      setStaffTeachers((prev) => prev.filter((staff) => staff.id !== deleteId))
      toast({ title: "Data staff berhasil dihapus" })
      setDeleteId(null)
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menghapus data staff",
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
