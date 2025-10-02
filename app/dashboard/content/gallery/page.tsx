"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2, X, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface GalleryItem {
  id: string
  title: string
  description: string
  images: string[]
  created_at: string
  updated_at: string
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: "", description: "", images: [] as string[] })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Mock data for now - will be replaced with Supabase
  useEffect(() => {
    const mockData: GalleryItem[] = [
      {
        id: "1",
        title: "Upacara Bendera",
        description: "Kegiatan upacara bendera setiap hari Senin",
        images: [
          "/placeholder.svg?height=300&width=400&text=Upacara+1",
          "/placeholder.svg?height=300&width=400&text=Upacara+2",
        ],
        created_at: "2024-12-01T10:00:00Z",
        updated_at: "2024-12-01T10:00:00Z",
      },
      {
        id: "2",
        title: "Kegiatan Olahraga",
        description: "Berbagai kegiatan olahraga siswa",
        images: [
          "/placeholder.svg?height=300&width=400&text=Olahraga+1",
          "/placeholder.svg?height=300&width=400&text=Olahraga+2",
          "/placeholder.svg?height=300&width=400&text=Olahraga+3",
        ],
        created_at: "2024-11-28T14:30:00Z",
        updated_at: "2024-11-28T14:30:00Z",
      },
      {
        id: "3",
        title: "Kegiatan Pembelajaran",
        description: "Suasana pembelajaran di kelas",
        images: ["/placeholder.svg?height=300&width=400&text=Pembelajaran"],
        created_at: "2024-11-25T09:15:00Z",
        updated_at: "2024-11-25T09:15:00Z",
      },
      {
        id: "4",
        title: "Acara Sekolah",
        description: "Berbagai acara dan perayaan sekolah",
        images: [
          "/placeholder.svg?height=300&width=400&text=Acara+1",
          "/placeholder.svg?height=300&width=400&text=Acara+2",
        ],
        created_at: "2024-11-20T16:45:00Z",
        updated_at: "2024-11-20T16:45:00Z",
      },
    ]

    setTimeout(() => {
      setGalleryItems(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        // Update existing gallery item
        const updatedItem = {
          ...galleryItems.find((item) => item.id === editingId)!,
          title: formData.title,
          description: formData.description,
          images: formData.images,
          updated_at: new Date().toISOString(),
        }
        setGalleryItems((prev) => prev.map((item) => (item.id === editingId ? updatedItem : item)))
        toast({ title: "Item galeri berhasil diperbarui" })
      } else {
        // Create new gallery item
        const newItem: GalleryItem = {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description,
          images: formData.images,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setGalleryItems((prev) => [newItem, ...prev])
        toast({ title: "Item galeri berhasil ditambahkan" })
      }

      setFormData({ title: "", description: "", images: [] })
      setShowForm(false)
      setEditingId(null)
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan item galeri",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      description: item.description,
      images: item.images,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setSubmitting(true)
    try {
      setGalleryItems((prev) => prev.filter((item) => item.id !== deleteId))
      toast({ title: "Item galeri berhasil dihapus" })
      setDeleteId(null)
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menghapus item galeri",
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

  const handlePreview = (item: GalleryItem) => {
    setPreviewItem(item)
    setShowPreview(true)
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
          <h1 className="text-3xl font-bold">Galeri</h1>
          <p className="text-muted-foreground">Kelola foto dan dokumentasi kegiatan sekolah</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Foto
        </Button>
      </div>

      {/* Gallery Grid */}
      {galleryItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Belum ada foto di galeri</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {galleryItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group cursor-pointer" onClick={() => handlePreview(item)}>
              <div className="relative h-48">
                {item.images.length > 0 ? (
                  <>
                    <Image
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {item.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        +{item.images.length - 1}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Tidak ada gambar</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </span>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(item.id)}>
                      <Trash2 className="h-3 w-3" />
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
            <DialogTitle>{editingId ? "Edit Item Galeri" : "Tambah Item Galeri"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Masukkan judul foto/kegiatan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Masukkan deskripsi foto/kegiatan"
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Foto</Label>
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
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          width={150}
                          height={100}
                          className="object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
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

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={() => setShowPreview(false)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewItem?.title}</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{previewItem.description}</p>
              <div className="grid gap-4">
                {previewItem.images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${previewItem.title} ${index + 1}`}
                      width={800}
                      height={400}
                      className="object-cover rounded-lg w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Item Galeri</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Apakah Anda yakin ingin menghapus item galeri ini? Tindakan ini tidak dapat dibatalkan.
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
