"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, Trash2, Eye, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const { toast } = useToast()

  const loadMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/contact")
      const result = await res.json()
      if (result.success) {
        setMessages(result.data || [])
      }
    } catch {
      toast({ title: "Gagal memuat pesan", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const deleteMessage = async (id: number) => {
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" })
      const result = await res.json()
      if (result.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        toast({ title: "Pesan berhasil dihapus" })
        if (selectedMessage?.id === id) setSelectedMessage(null)
      } else {
        toast({ title: "Gagal menghapus", variant: "destructive" })
      }
    } catch {
      toast({ title: "Gagal menghapus pesan", variant: "destructive" })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pesan Masuk</h1>
          <p className="text-muted-foreground">
            Pesan dari formulir kontak website ({messages.length} pesan)
          </p>
        </div>
        <Button variant="outline" onClick={loadMessages}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Belum ada pesan</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pesan dari formulir kontak akan muncul di sini.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{msg.name}</h3>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {msg.email}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm mb-1">{msg.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {msg.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(msg.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Dari</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Tanggal</p>
                  <p className="font-medium">{formatDate(selectedMessage.created_at)}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Pesan</p>
                <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMessage(selectedMessage.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Pesan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
