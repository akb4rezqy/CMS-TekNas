"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Extracurricular {
  id: string
  title: string
  description: string
  images: string[]
  created_at: string
  updated_at: string
}

export default function ExtracurricularsPage() {
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: "", description: "", images: [] as string[] })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Mock data for now - will be replaced with Supabase
  useEffect(() => {
    const mockData: Extracurricular[] = [
      {
        id: "1",
        title: "Pramuka",
        description: "Kegiatan kepramukaan untuk membentuk karakter dan kepemimpinan siswa",
        images: ["/placeholder.svg?height=200&width=300&text=Pramuka"],
        created_at: "2024-12-01T10:00:00Z",
        updated_at: "2024-12-01T10:00:00Z",
      },
      {
        id: "2",
        title: "Basket",
        description: "Ekstrakurikuler olahraga basket untuk mengembangkan kemampuan fisik dan kerjasama tim",
        images: ["/placeholder.svg?height=200&width=300&text=Basket"],
        created_at: "2024-11-28T14:30:00Z",
        updated_at: "2024-11-28T14:30:00Z",
      },
      {
        id: "3",
        title: "English Club",
        description: "Klub bahasa Inggris untuk meningkatkan kemampuan berbahasa Inggris siswa",
        images: ["/placeholder.svg?height=200&width=300&text=English+Club"],
        created_at: "2024-11-25T09:15:00Z",
        updated_at: "2024-11-25T09:15:00Z",
      },
    ]

    setTimeout(() => {
      setExtracurriculars(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        // Update existing extracurricular
        const updatedExtracurricular = {
          ...extracurriculars.find((e) => e.id === editingId)!,
          title: formData.title,
          description: formData.description,
          images: formData.images,
          updated_at: new Date().toISOString(),
        }
        setExtracurriculars((prev) => prev.map((e) => (e.id === editingId ? updatedExtracurricular : e)))
        toast({ title: "Ekstrakurikuler berhasil diperbarui" })
      } else {
        // Create new extracurricular
        const newExtracurricular: Extracurricular = {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description,
          images: formData.images,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setExtracurriculars((prev) => [newExtracurricular, ...prev])
        toast({ title: "Ekstrakurikuler berhasil ditambahkan" })
      }

      setFormData({ title: "", description: "", images: [] })
      setShowForm(false)
      setEditingId(null)
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan ekstrakurikuler",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (extracurricular: Extracurricular) => {
    setFormData({
      title: extracurricular.title,
      description: extracurricular.description,
      images: extracurricular.images,
    })
    setEditingId(extracurricular.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setSubmitting(true)
    try {
      setExtracurriculars((prev) => prev.filter((e) => e.id !== deleteId))
      toast({ title: "Ekstrakurikuler berhasil dihapus" })
      setDeleteId(null)
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menghapus ekstrakurikuler",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // Mock image upload - in real implementation, upload to storage
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const resetForm = () => {
    setFormData({ title: "", description: "", images: [] })
    setEditingId(null)
    setShowForm(false)
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
          <h1 className="text-3xl font-bold">Ekstrakurikuler</h1>
          <p className="text-muted-foreground">Kelola kegiatan ekstrakurikuler sekolah</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Ekstrakurikuler
        </Button>
      </div>

      {/* Extracurriculars Grid */}
      {extracurriculars.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Belum ada ekstrakurikuler</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {extracurriculars.map((extracurricular) => (
            <Card key={extracurricular.id} className="overflow-hidden">
              <div className="relative h-48">
                {extracurricular.images.length > 0 ? (
                  <Image
                    src={extracurricular.images[0] || "/placeholder.svg"}
                    alt={extracurricular.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Tidak ada gambar</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{extracurricular.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{extracurricular.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(extracurricular.created_at).toLocaleDateString("id-ID")}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(extracurricular)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(extracurricular.id)}>
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
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Masukkan judul ekstrakurikuler"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Masukkan deskripsi ekstrakurikuler"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Gambar</Label>
              <div className="space-y-4">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={150}
                          className="object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
            <DialogTitle>Hapus Ekstrakurikuler</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Apakah Anda yakin ingin menghapus ekstrakurikuler ini? Tindakan ini tidak dapat dibatalkan.
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
