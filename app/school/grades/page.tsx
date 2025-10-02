"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { Grade } from "@/lib/types/school"

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data)

export default function GradesPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR<Grade[]>("/api/school/grades", fetcher)
  const [form, setForm] = useState({ student_id: "", subject_id: "", score: 0 })
  const [editing, setEditing] = useState<Grade | null>(null)

  async function createGrade() {
    try {
      const res = await fetch("/api/school/grades", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Create failed")
      toast({ title: "Grade created" })
      setForm({ student_id: "", subject_id: "", score: 0 })
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  async function updateGrade() {
    if (!editing) return
    try {
      const res = await fetch(`/api/school/grades/${editing.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editing),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Update failed")
      toast({ title: "Grade updated" })
      setEditing(null)
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  async function deleteGrade(id: string) {
    try {
      const res = await fetch(`/api/school/grades/${id}`, { method: "DELETE" })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Delete failed")
      toast({ title: "Grade deleted" })
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  return (
    <main className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Grades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="student_id">Student ID</Label>
              <Input
                id="student_id"
                value={form.student_id}
                onChange={(e) => setForm((f) => ({ ...f, student_id: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="subject_id">Subject ID</Label>
              <Input
                id="subject_id"
                value={form.subject_id}
                onChange={(e) => setForm((f) => ({ ...f, subject_id: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                value={form.score}
                onChange={(e) => setForm((f) => ({ ...f, score: Number(e.target.value) }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={createGrade} disabled={!form.student_id || !form.subject_id}>
                Create
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Graded At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((g) => (
                <TableRow key={g.id}>
                  <TableCell>
                    {editing?.id === g.id ? (
                      <Input
                        value={editing.student_id}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, student_id: e.target.value } : ed))}
                      />
                    ) : (
                      g.student_id
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === g.id ? (
                      <Input
                        value={editing.subject_id}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, subject_id: e.target.value } : ed))}
                      />
                    ) : (
                      g.subject_id
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === g.id ? (
                      <Input
                        type="number"
                        value={editing.score}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, score: Number(e.target.value) } : ed))}
                      />
                    ) : (
                      g.score
                    )}
                  </TableCell>
                  <TableCell>{g.graded_at}</TableCell>
                  <TableCell className="flex gap-2">
                    {editing?.id === g.id ? (
                      <>
                        <Button size="sm" onClick={updateGrade}>
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => setEditing(g)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteGrade(g.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
