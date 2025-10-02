"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { ClassRow } from "@/lib/types/school"

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data)

export default function ClassesPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR<ClassRow[]>("/api/school/classes", fetcher)
  const [form, setForm] = useState({ name: "", grade_level: 7 })
  const [editing, setEditing] = useState<ClassRow | null>(null)

  async function createClass() {
    try {
      const res = await fetch("/api/school/classes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Create failed")
      toast({ title: "Class created" })
      setForm({ name: "", grade_level: 7 })
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  async function updateClass() {
    if (!editing) return
    try {
      const res = await fetch(`/api/school/classes/${editing.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editing),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Update failed")
      toast({ title: "Class updated" })
      setEditing(null)
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  async function deleteClass(id: string) {
    try {
      const res = await fetch(`/api/school/classes/${id}`, { method: "DELETE" })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Delete failed")
      toast({ title: "Class deleted" })
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  return (
    <main className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Classes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="grade_level">Grade Level</Label>
              <Input
                id="grade_level"
                type="number"
                value={form.grade_level}
                onChange={(e) => setForm((f) => ({ ...f, grade_level: Number(e.target.value) }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={createClass} disabled={!form.name}>
                Create
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    {editing?.id === c.id ? (
                      <Input
                        value={editing.name}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, name: e.target.value } : ed))}
                      />
                    ) : (
                      c.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === c.id ? (
                      <Input
                        type="number"
                        value={editing.grade_level}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, grade_level: Number(e.target.value) } : ed))}
                      />
                    ) : (
                      c.grade_level
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {editing?.id === c.id ? (
                      <>
                        <Button size="sm" onClick={updateClass}>
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => setEditing(c)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteClass(c.id)}>
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
