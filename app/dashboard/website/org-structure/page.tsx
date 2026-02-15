"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2, AlertCircle, Network } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrgItem {
  id: string
  position_name: string
  person_name: string
  parent_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export default function OrgStructurePage() {
  const [items, setItems] = useState<OrgItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    position_name: "",
    person_name: "",
    parent_id: "" as string | null,
    sort_order: 0,
  })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/org-structure")
      const result = await res.json()
      if (result.success) {
        setItems(result.data)
      } else {
        setError(result.error || "Failed to load data")
      }
    } catch {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const submitData = {
        ...formData,
        parent_id: formData.parent_id || null,
      }

      if (editingId) {
        const res = await fetch(`/api/org-structure/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        })
        const result = await res.json()
        if (result.success) {
          await fetchItems()
          toast({ title: "Data berhasil diperbarui" })
        } else {
          throw new Error(result.error)
        }
      } else {
        const res = await fetch("/api/org-structure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        })
        const result = await res.json()
        if (result.success) {
          await fetchItems()
          toast({ title: "Data berhasil ditambahkan" })
        } else {
          throw new Error(result.error)
        }
      }
      resetForm()
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal menyimpan data",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: OrgItem) => {
    setFormData({
      position_name: item.position_name,
      person_name: item.person_name,
      parent_id: item.parent_id || "",
      sort_order: item.sort_order,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/org-structure/${deleteId}`, { method: "DELETE" })
      const result = await res.json()
      if (result.success) {
        await fetchItems()
        toast({ title: "Data berhasil dihapus" })
        setDeleteId(null)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal menghapus",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ position_name: "", person_name: "", parent_id: "", sort_order: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  const getParentName = (parentId: string | null) => {
    if (!parentId) return "-"
    const parent = items.find((i) => i.id === parentId)
    return parent ? `${parent.position_name} (${parent.person_name})` : "-"
  }

  const buildTree = (parentId: string | null = null, level: number = 0): (OrgItem & { level: number })[] => {
    const children = items
      .filter((i) => i.parent_id === parentId)
      .sort((a, b) => a.sort_order - b.sort_order)
    const result: (OrgItem & { level: number })[] = []
    for (const child of children) {
      result.push({ ...child, level })
      result.push(...buildTree(child.id, level + 1))
    }
    return result
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Struktur Organisasi</h1>
          <p className="text-muted-foreground">Kelola struktur organisasi sekolah</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Memuat data...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Struktur Organisasi</h1>
          <p className="text-muted-foreground">Kelola struktur organisasi sekolah</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="font-semibold">Terjadi Kesalahan</h3>
              <p className="text-muted-foreground">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Pastikan tabel org_structure sudah dibuat di database.
              </p>
            </div>
            <Button onClick={fetchItems}>Coba Lagi</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const treeItems = buildTree()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Struktur Organisasi</h1>
          <p className="text-muted-foreground">Kelola struktur organisasi sekolah</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Jabatan
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Network className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Belum ada data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Mulai tambahkan struktur organisasi sekolah.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Hierarki Organisasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {treeItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  style={{ marginLeft: `${item.level * 32}px` }}
                >
                  <div className="flex items-center gap-3">
                    {item.level > 0 && (
                      <div className="w-4 h-px bg-border" />
                    )}
                    <div>
                      <p className="font-semibold text-sm">{item.position_name}</p>
                      <p className="text-sm text-muted-foreground">{item.person_name}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showForm} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Jabatan" : "Tambah Jabatan"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="position_name">Nama Jabatan</Label>
              <Input
                id="position_name"
                value={formData.position_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, position_name: e.target.value }))}
                placeholder="Contoh: Kepala Sekolah, Wakil Kepala Sekolah"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="person_name">Nama Pejabat</Label>
              <Input
                id="person_name"
                value={formData.person_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, person_name: e.target.value }))}
                placeholder="Nama orang yang menjabat"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent_id">Atasan (Opsional)</Label>
              <select
                id="parent_id"
                value={formData.parent_id || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value || null }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="">Tidak ada (jabatan tertinggi)</option>
                {items
                  .filter((i) => i.id !== editingId)
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.position_name} - {i.person_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Urutan</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                placeholder="Urutan tampil (semakin kecil semakin atas)"
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
            <DialogTitle>Hapus Jabatan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus jabatan ini? Jabatan bawahan akan kehilangan atasan.
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
