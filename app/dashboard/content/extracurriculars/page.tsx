"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2, X, AlertCircle } from "lucide-react"
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

  const [error, setError] = useState<string | null>(null)

  const fetchExtracurriculars = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/extracurriculars")
      const result = await res.json()
      if (result.success) {
        setExtracurriculars(result.data)
      } else {
        setError(result.error || "Failed to load extracurriculars")
        toast({ title: "Terjadi kesalahan", description: result.error || "Gagal memuat ekstrakurikuler", variant: "destructive" })
      }
    } catch (err) {
      setError("Network error occurred")
      toast({ title: "Terjadi kesalahan", description: "Gagal memuat ekstrakurikuler", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExtracurriculars()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        const res = await fetch(`/api/extracurriculars/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const result = await res.json()
        if (result.success) {
          await fetchExtracurriculars()
          toast({ title: "Ekstrakurikuler berhasil diperbarui" })
        } else {
          throw new Error(result.error || "Update failed")
        }
      } else {
        const res = await fetch("/api/extracurriculars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const result = await res.json()
        if (result.success) {
          await fetchExtracurriculars()
          toast({ title: "Ekstrakurikuler berhasil ditambahkan" })
        } else {
          throw new Error(result.error || "Create failed")
        }
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
      const res = await fetch(`/api/extracurriculars/${deleteId}`, { method: "DELETE" })
      const result = await res.json()
      if (result.success) {
        await fetchExtracurriculars()
        toast({ title: "Ekstrakurikuler berhasil dihapus" })
        setDeleteId(null)
      } else {
        throw new Error(result.error || "Delete failed")
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal menghapus ekstrakurikuler",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadData = new FormData()
      Array.from(files).forEach((file) => uploadData.append("files", file))

      const res = await fetch("/api/upload", { method: "POST", body: uploadData })
      const result = await res.json()

      if (result.success) {
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...result.urls] }))
        toast({ title: "Foto berhasil diupload" })
      } else {
        toast({ title: "Gagal upload foto", description: result.error, variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Gagal upload foto", description: "Terjadi kesalahan jaringan", variant: "destructive" })
    } finally {
      setUploading(false)
      e.target.value = ""
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

  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Ekstrakurikuler</h1>
            <p className="text-muted-foreground">Kelola kegiatan ekstrakurikuler sekolah</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="font-semibold">Terjadi Kesalahan</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={fetchExtracurriculars}>Coba Lagi</Button>
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
            <h1 className="text-3xl font-bold">Ekstrakurikuler</h1>
            <p className="text-muted-foreground">Kelola kegiatan ekstrakurikuler sekolah</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Memuat ekstrakurikuler...</span>
          </CardContent>
        </Card>
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
                  <img
                    src={extracurricular.images[0] || "/placeholder.svg"}
                    alt={extracurricular.title}
                    className="absolute inset-0 w-full h-full object-cover"
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
                  disabled={uploading}
                />
                {uploading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Mengupload foto...
                  </div>
                )}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-[150px] object-cover rounded-lg"
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
