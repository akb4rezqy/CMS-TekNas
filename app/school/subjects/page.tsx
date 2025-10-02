"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { Subject, User } from "@/lib/types/school"

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data)

export default function SubjectsPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR<Subject[]>("/api/school/subjects", fetcher)
  const { data: users } = useSWR<User[]>("/api/school/users", fetcher)
  const [form, setForm] = useState({ name: "", teacher_id: "" })
  const [editing, setEditing] = useState<Subject | null>(null)

  async function createSubject() {
    try {
      const res = await fetch("/api/school/subjects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, teacher_id: form.teacher_id || null }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Create failed")
      toast({ title: "Subject created" })
      setForm({ name: "", teacher_id: "" })
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  async function updateSubject() {
    if (!editing) return
    try {
      const res = await fetch(`/api/school/subjects/${editing.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editing),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Update failed")
      toast({ title: "Subject updated" })
      setEditing(null)
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  async function deleteSubject(id: string) {
    try {
      const res = await fetch(`/api/school/subjects/${id}`, { method: "DELETE" })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Delete failed")
      toast({ title: "Subject deleted" })
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  const teacherName = (id: string | null) => (users ?? []).find((u) => u.id === id)?.full_name || ""

  return (
    <main className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Subjects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="teacher_id">Teacher ID (optional)</Label>
              <Input
                id="teacher_id"
                value={form.teacher_id}
                onChange={(e) => setForm((f) => ({ ...f, teacher_id: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={createSubject} disabled={!form.name}>
                Create
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {editing?.id === s.id ? (
                      <Input
                        value={editing.name}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, name: e.target.value } : ed))}
                      />
                    ) : (
                      s.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === s.id ? (
                      <Input
                        value={editing.teacher_id ?? ""}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, teacher_id: e.target.value || null } : ed))}
                      />
                    ) : (
                      teacherName(s.teacher_id)
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {editing?.id === s.id ? (
                      <>
                        <Button size="sm" onClick={updateSubject}>
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => setEditing(s)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteSubject(s.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3}>Loading...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
