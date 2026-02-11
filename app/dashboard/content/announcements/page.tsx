"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Announcement {
  id: string
  title: string
  content: string
  date: string
  author: string
  status: "draft" | "published"
  created_at: string
  updated_at: string
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    author: "Admin",
    status: "published" as "draft" | "published",
  })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchAnnouncements = async () => {
    console.log("[v0] Fetching announcements...")
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/announcements")
      const result = await res.json()

      if (result.success) {
        setAnnouncements(result.data)
        console.log("[v0] Successfully loaded announcements:", result.data.length)
      } else {
        setError(result.error || "Failed to load announcements")
        toast({
          title: "Terjadi kesalahan",
          description: result.error || "Gagal memuat pengumuman",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.log("[v0] Fetch error:", error)
      setError("Network error occurred")
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal memuat pengumuman",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Submitting form:", { editingId, formData })
    setSubmitting(true)

    try {
      let result

      if (editingId) {
        const res = await fetch(`/api/announcements/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        result = await res.json()

        if (result.success) {
          await fetchAnnouncements()
          toast({ title: "Pengumuman berhasil diperbarui" })
        } else {
          throw new Error(result.error || "Update failed")
        }
      } else {
        const res = await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        result = await res.json()

        if (result.success) {
          await fetchAnnouncements()
          toast({ title: "Pengumuman berhasil ditambahkan" })
        } else {
          throw new Error(result.error || "Create failed")
        }
      }

      setFormData({
        title: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
        author: "Admin",
        status: "published",
      })
      setShowForm(false)
      setEditingId(null)
    } catch (error) {
      console.log("[v0] Submit error:", error)
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal menyimpan pengumuman",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    console.log("[v0] Editing announcement:", announcement.id)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      date: announcement.date,
      author: announcement.author,
      status: announcement.status,
    })
    setEditingId(announcement.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    console.log("[v0] Deleting announcement:", deleteId)
    setSubmitting(true)

    try {
      const res = await fetch(`/api/announcements/${deleteId}`, { method: "DELETE" })
      const result = await res.json()

      if (result.success) {
        await fetchAnnouncements()
        toast({ title: "Pengumuman berhasil dihapus" })
        setDeleteId(null)
      } else {
        throw new Error(result.error || "Delete failed")
      }
    } catch (error) {
      console.log("[v0] Delete error:", error)
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal menghapus pengumuman",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      author: "Admin",
      status: "published",
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pengumuman</h1>
            <p className="text-muted-foreground">Kelola pengumuman sekolah</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="font-semibold">Terjadi Kesalahan</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={fetchAnnouncements}>Coba Lagi</Button>
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
            <h1 className="text-3xl font-bold">Pengumuman</h1>
            <p className="text-muted-foreground">Kelola pengumuman sekolah</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Memuat pengumuman...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pengumuman</h1>
          <p className="text-muted-foreground">Kelola pengumuman sekolah</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pengumuman
        </Button>
      </div>

      {/* Announcements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengumuman</CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada pengumuman</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">{announcement.title}</TableCell>
                    <TableCell>{announcement.author}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          announcement.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {announcement.status === "published" ? "Dipublikasi" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(announcement.created_at).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteId(announcement.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Pengumuman" : "Tambah Pengumuman"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Masukkan judul pengumuman"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Konten</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Masukkan konten pengumuman"
                rows={6}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                  placeholder="Nama penulis"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as "draft" | "published" }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Dipublikasi</option>
              </select>
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
            <DialogTitle>Hapus Pengumuman</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan.
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
