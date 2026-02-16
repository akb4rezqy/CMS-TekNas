"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Plus, Trash2, Key, UserCog, Loader2, Shield, Edit2, Eye, EyeOff } from "lucide-react"

interface User {
  id: string
  username: string
  display_name: string
  role: string
  created_at: string
}

interface CurrentUser {
  id: string
  username: string
  display_name: string
  role: string
}

export default function AccountsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showUsernameForm, setShowUsernameForm] = useState(false)

  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newDisplayName, setNewDisplayName] = useState("")
  const [newRole, setNewRole] = useState("editor")
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState("")
  const [createSuccess, setCreateSuccess] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [changeNewPassword, setChangeNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  const [changeUsername, setChangeUsername] = useState("")
  const [usernameLoading, setUsernameLoading] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const [usernameSuccess, setUsernameSuccess] = useState("")

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [meRes, usersRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/users"),
      ])
      const meData = await meRes.json()
      if (meData.success) setCurrentUser(meData.user)

      const usersData = await usersRes.json()
      if (usersData.success) setUsers(usersData.data || [])
    } catch {}
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreateError("")
    setCreateSuccess("")
    setCreateLoading(true)

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          display_name: newDisplayName,
          role: newRole,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCreateSuccess("Akun berhasil dibuat!")
        setNewUsername("")
        setNewPassword("")
        setNewDisplayName("")
        setNewRole("editor")
        setShowCreateForm(false)
        fetchData()
      } else {
        setCreateError(data.error || "Gagal membuat akun")
      }
    } catch {
      setCreateError("Terjadi kesalahan")
    }
    setCreateLoading(false)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    if (changeNewPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok")
      return
    }

    setPasswordLoading(true)
    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword: changeNewPassword,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPasswordSuccess("Password berhasil diubah!")
        setCurrentPassword("")
        setChangeNewPassword("")
        setConfirmPassword("")
        setShowPasswordForm(false)
      } else {
        setPasswordError(data.error || "Gagal mengubah password")
      }
    } catch {
      setPasswordError("Terjadi kesalahan")
    }
    setPasswordLoading(false)
  }

  async function handleChangeUsername(e: React.FormEvent) {
    e.preventDefault()
    setUsernameError("")
    setUsernameSuccess("")
    setUsernameLoading(true)

    try {
      const res = await fetch("/api/users/change-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUsername: changeUsername }),
      })
      const data = await res.json()
      if (data.success) {
        setUsernameSuccess("Username berhasil diubah!")
        setChangeUsername("")
        setShowUsernameForm(false)
        fetchData()
      } else {
        setUsernameError(data.error || "Gagal mengubah username")
      }
    } catch {
      setUsernameError("Terjadi kesalahan")
    }
    setUsernameLoading(false)
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) {
        setDeleteConfirm(null)
        fetchData()
      }
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const isAdmin = currentUser?.role === "admin"
  const isEnvAdmin = currentUser?.id === "env-admin"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Akun</h1>
        <p className="text-muted-foreground">Kelola akun admin dan pengaturan keamanan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Akun Saya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">{currentUser?.username}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nama</p>
              <p className="font-medium">{currentUser?.display_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                {currentUser?.role === "admin" ? "Administrator" : "Editor"}
              </p>
            </div>
          </div>

          {!isEnvAdmin && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowPasswordForm(!showPasswordForm); setShowUsernameForm(false) }}
              >
                <Key className="h-4 w-4 mr-1" />
                Ganti Password
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowUsernameForm(!showUsernameForm); setShowPasswordForm(false) }}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Ganti Username
              </Button>
            </div>
          )}

          {isEnvAdmin && (
            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              Anda login menggunakan akun environment. Untuk mengganti password/username, ubah di pengaturan environment variable. Atau buat akun baru di bawah.
            </p>
          )}

          {showPasswordForm && !isEnvAdmin && (
            <form onSubmit={handleChangePassword} className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium text-sm">Ganti Password</h3>
              <div className="space-y-2">
                <Label>Password Lama</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowCurrentPw(!showCurrentPw)}>
                    {showCurrentPw ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password Baru</Label>
                <div className="relative">
                  <Input
                    type={showNewPw ? "text" : "password"}
                    value={changeNewPassword}
                    onChange={(e) => setChangeNewPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowNewPw(!showNewPw)}>
                    {showNewPw ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Konfirmasi Password Baru</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
              {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={passwordLoading}>
                  {passwordLoading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                  Simpan
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPasswordForm(false)}>
                  Batal
                </Button>
              </div>
            </form>
          )}

          {showUsernameForm && !isEnvAdmin && (
            <form onSubmit={handleChangeUsername} className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium text-sm">Ganti Username</h3>
              <div className="space-y-2">
                <Label>Username Baru</Label>
                <Input
                  value={changeUsername}
                  onChange={(e) => setChangeUsername(e.target.value)}
                  minLength={3}
                  required
                  placeholder="Masukkan username baru"
                />
              </div>
              {usernameError && <p className="text-sm text-red-600">{usernameError}</p>}
              {usernameSuccess && <p className="text-sm text-green-600">{usernameSuccess}</p>}
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={usernameLoading}>
                  {usernameLoading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                  Simpan
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowUsernameForm(false)}>
                  Batal
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Daftar Akun
            </CardTitle>
            <Button size="sm" onClick={() => { setShowCreateForm(!showCreateForm); setCreateError(""); setCreateSuccess("") }}>
              <Plus className="h-4 w-4 mr-1" />
              Buat Akun Baru
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {createSuccess && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{createSuccess}</p>}

            {showCreateForm && (
              <form onSubmit={handleCreate} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium">Buat Akun Baru</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      minLength={3}
                      required
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nama Tampilan</Label>
                    <Input
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      required
                      placeholder="Minimal 6 karakter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="editor">Editor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
                {createError && <p className="text-sm text-red-600">{createError}</p>}
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={createLoading}>
                    {createLoading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                    Buat Akun
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            )}

            <div className="divide-y">
              {isEnvAdmin && (
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Administrator (ENV)</p>
                      <p className="text-xs text-muted-foreground">Login dari environment variable</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Admin</span>
                </div>
              )}

              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${user.role === "admin" ? "bg-blue-100" : "bg-gray-100"}`}>
                      <span className="text-sm font-bold uppercase">{user.username[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.display_name || user.username}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                      {user.role === "admin" ? "Admin" : "Editor"}
                    </span>
                    {deleteConfirm === user.id ? (
                      <div className="flex items-center gap-1">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)} className="h-7 text-xs">
                          Ya, Hapus
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)} className="h-7 text-xs">
                          Batal
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteConfirm(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {users.length === 0 && !isEnvAdmin && (
                <p className="text-sm text-muted-foreground py-4 text-center">Belum ada akun. Buat akun baru untuk memulai.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
