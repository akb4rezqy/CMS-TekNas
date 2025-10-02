"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types/school"

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data)

export default function UsersPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR<User[]>("/api/school/users", fetcher)
  const [form, setForm] = useState({ email: "", full_name: "", role: "student" as User["role"] })
  const [editing, setEditing] = useState<User | null>(null)

  async function handleCreate() {
    try {
      const res = await fetch("/api/school/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Failed to create")
      toast({ title: "User created" })
      setForm({ email: "", full_name: "", role: "student" })
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  async function handleUpdate() {
    if (!editing) return
    try {
      const res = await fetch(`/api/school/users/${editing.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editing),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Failed to update")
      toast({ title: "User updated" })
      setEditing(null)
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/school/users/${id}`, { method: "DELETE" })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Failed to delete")
      toast({ title: "User deleted" })
      mutate()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  return (
    <main className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as User["role"] }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreate} disabled={!form.email || !form.full_name}>
                Create
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    {editing?.id === u.id ? (
                      <Input
                        value={editing.email}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, email: e.target.value } : ed))}
                      />
                    ) : (
                      u.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === u.id ? (
                      <Input
                        value={editing.full_name}
                        onChange={(e) => setEditing((ed) => (ed ? { ...ed, full_name: e.target.value } : ed))}
                      />
                    ) : (
                      u.full_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === u.id ? (
                      <Input
                        value={editing.role}
                        onChange={(e) =>
                          setEditing((ed) => (ed ? { ...ed, role: e.target.value as User["role"] } : ed))
                        }
                      />
                    ) : (
                      u.role
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {editing?.id === u.id ? (
                      <>
                        <Button size="sm" onClick={handleUpdate}>
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => setEditing(u)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
