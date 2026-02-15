"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, X, Save, ExternalLink } from "lucide-react"

interface Assessment {
  id: string
  class_grade: string
  class_major: string
  subject_name: string
  gform_link: string
  day_name: string
  sort_order: number
}

const CLASS_OPTIONS = [
  { grade: "10", major: "TKJ", label: "10 TKJ" },
  { grade: "10", major: "TKR", label: "10 TKR" },
  { grade: "11", major: "TKJ", label: "11 TKJ" },
  { grade: "11", major: "TKR", label: "11 TKR" },
  { grade: "12", major: "TKJ", label: "12 TKJ" },
  { grade: "12", major: "TKR", label: "12 TKR" },
]

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

const EMPTY_FORM = {
  subject_name: "",
  gform_link: "",
  day_name: "Senin",
  sort_order: 1,
}

export default function AsesmenAdminPage() {
  const [activeClass, setActiveClass] = useState(CLASS_OPTIONS[0])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchData = useCallback(() => {
    setLoading(true)
    fetch(`/api/assessments?grade=${activeClass.grade}&major=${activeClass.major}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setAssessments(res.data)
        else setAssessments([])
      })
      .catch(() => setAssessments([]))
      .finally(() => setLoading(false))
  }, [activeClass])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (item: Assessment) => {
    setEditingId(item.id)
    setForm({
      subject_name: item.subject_name,
      gform_link: item.gform_link,
      day_name: item.day_name,
      sort_order: item.sort_order,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const handleSave = async () => {
    if (!form.subject_name.trim() || !form.gform_link.trim()) return
    setSaving(true)

    try {
      if (editingId) {
        await fetch(`/api/assessments/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        await fetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            class_grade: activeClass.grade,
            class_major: activeClass.major,
          }),
        })
      }
      closeForm()
      fetchData()
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/assessments/${id}`, { method: "DELETE" })
      fetchData()
    } catch {
    }
    setDeleteConfirm(null)
  }

  const groupedByDay = DAYS.map((day) => ({
    day,
    subjects: assessments
      .filter((a) => a.day_name === day)
      .sort((a, b) => a.sort_order - b.sort_order),
  })).filter((g) => g.subjects.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Asesmen Online</h1>
          <p className="text-sm text-muted-foreground">Kelola mata pelajaran dan link Google Form asesmen</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Mapel
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CLASS_OPTIONS.map((cls) => (
          <button
            key={cls.label}
            onClick={() => { setActiveClass(cls); closeForm() }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeClass.label === cls.label
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cls.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}</h3>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Mata Pelajaran</Label>
              <Input
                placeholder="Contoh: Matematika"
                value={form.subject_name}
                onChange={(e) => setForm({ ...form, subject_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Link Google Form</Label>
              <Input
                placeholder="https://forms.google.com/..."
                value={form.gform_link}
                onChange={(e) => setForm({ ...form, gform_link: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hari</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={form.day_name}
                onChange={(e) => setForm({ ...form, day_name: e.target.value })}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Urutan (Jam ke-)</Label>
              <Input
                type="number"
                min={1}
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={closeForm}>Batal</Button>
            <Button onClick={handleSave} disabled={saving || !form.subject_name.trim() || !form.gform_link.trim()} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-muted border-t-primary rounded-full" />
        </div>
      ) : groupedByDay.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-xl">
          <p className="text-muted-foreground">Belum ada data asesmen untuk kelas {activeClass.label}</p>
          <Button onClick={openAdd} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Tambah Mapel
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByDay.map(({ day, subjects }) => (
            <div key={day} className="bg-card border rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-muted/50 border-b">
                <h3 className="font-semibold text-sm">{day}</h3>
              </div>
              <div className="divide-y">
                {subjects.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {item.sort_order}
                      </span>
                      <span className="font-medium text-sm truncate">{item.subject_name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={item.gform_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        title="Buka link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {deleteConfirm === item.id ? (
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} className="h-7 text-xs">Hapus</Button>
                          <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)} className="h-7 text-xs">Batal</Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
