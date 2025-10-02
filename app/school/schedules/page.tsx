"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { Schedule } from "@/lib/types/school"

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data)

export default function SchedulesPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR<Schedule[]>("/api/school/schedules", fetcher)
  const [form, setForm] = useState({
    class_id: "",
    subject_id: "",
    teacher_id: "",
    day_of_week: 1,
    start_time: "08:00",
    end_time: "09:00",
  })
  const [editing, setEditing] = useState<Schedule | null>(null)

  async function createSchedule() {
    try {
      const res = await fetch("/api/school/schedules", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, teacher_id: form.teacher_id || null }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Create failed")
      toast({ title: "Schedule created" })
      setForm({ class_id: "", subject_id: "", teacher_id: "", day_of_week: 1, start_time: "08:00", end_time: "09:00" })
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  async function updateSchedule() {
    if (!editing) return
    try {
      const res = await fetch(`/api/school/schedules/${editing.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editing),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Update failed")
      toast({ title: "Schedule updated" })
      setEditing(null)
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  async function deleteSchedule(id: string) {
    try {
      const res = await fetch(`/api/school/schedules/${id}`, { method: "DELETE" })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Delete failed")
      toast({ title: "Schedule deleted" })
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  return (
    <main className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Schedules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="class_id">Class ID</Label>
              <Input
                id="class_id"
                value={form.class_id}
                onChange={(e) => setForm((f) => ({ ...f, class_id: e.target.value }))}
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
              <Label htmlFor="teacher_id">Teacher ID</Label>
              <Input
                id="teacher_id"
                value={form.teacher_id}
                onChange={(e) => setForm((f) => ({ ...f, teacher_id: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="day_of_week">Day (1-7)</Label>
              <Input
                id="day_of_week"
                type="number"
                value={form.day_of_week}
                onChange={(e) => setForm((f) => ({ ...f, day_of_week: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="start_time">Start</Label>
              <Input
                id="start_time"
                value={form.start_time}
                onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end_time">End</Label>
              <Input
                id="end_time"
                value={form.end_time}
                onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
              />
            </div>
            <div className="md:col-span-6 flex items-end">
              <Button onClick={createSchedule} disabled={!form.class_id || !form.subject_id}>
                Create
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {editing?.id === s.id ? (
                      <Input
                        value={editing.class_id}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, class_id: e.target.value } : ed))}
                      />
                    ) : (
                      s.class_id
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === s.id ? (
                      <Input
                        value={editing.subject_id}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, subject_id: e.target.value } : ed))}
                      />
                    ) : (
                      s.subject_id
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === s.id ? (
                      <Input
                        value={editing.teacher_id ?? ""}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, teacher_id: e.target.value || null } : ed))}
                      />
                    ) : (
                      (s.teacher_id ?? "")
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === s.id ? (
                      <Input
                        type="number"
                        value={editing.day_of_week}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, day_of_week: Number(e.target.value) } : ed))}
                      />
                    ) : (
                      s.day_of_week
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === s.id ? (
                      <Input
                        value={editing.start_time}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, start_time: e.target.value } : ed))}
                      />
                    ) : (
                      s.start_time
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === s.id ? (
                      <Input
                        value={editing.end_time}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, end_time: e.target.value } : ed))}
                      />
                    ) : (
                      s.end_time
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {editing?.id === s.id ? (
                      <>
                        <Button size="sm" onClick={updateSchedule}>
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
                        <Button size="sm" variant="destructive" onClick={() => deleteSchedule(s.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7}>Loading...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
