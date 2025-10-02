import { type Announcement, dummyAnnouncements } from "@/lib/data/dummy-data"

// Kunci penyimpanan di localStorage
const STORAGE_KEY = "announcements_v1"

// Helper: cek environment browser
function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

// Helper: load dari localStorage dengan fallback ke dummy data (seed sekali)
function loadFromStorage(): Announcement[] {
  if (!isBrowser()) return [...dummyAnnouncements]

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      // seed pertama kali
      console.log("[v0] AnnouncementsService seed dummy to localStorage")
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyAnnouncements))
      return [...dummyAnnouncements]
    }
    const parsed: Announcement[] = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.log("[v0] AnnouncementsService.load error:", e)
    return [...dummyAnnouncements]
  }
}

// Helper: simpan ke localStorage
function saveToStorage(list: Announcement[]) {
  if (!isBrowser()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.log("[v0] AnnouncementsService.save error:", e)
  }
}

// Helper: id unik
function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return Date.now().toString()
}

export class AnnouncementsService {
  // Cache in-memory ringan (opsional)
  private static cache: Announcement[] | null = null

  private static getAllInternal(): Announcement[] {
    if (!this.cache) this.cache = loadFromStorage()
    // urut terbaru
    return [...this.cache].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  private static setAllInternal(next: Announcement[]) {
    this.cache = [...next]
    saveToStorage(this.cache)
  }

  static async getAll(): Promise<{ data: Announcement[]; success: boolean; error?: string }> {
    try {
      console.log("[v0] AnnouncementsService.getAll (frontend-only)")
      const data = this.getAllInternal()
      return { data, success: true }
    } catch (error) {
      console.log("[v0] AnnouncementsService.getAll error:", error)
      return { data: [], success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async create(
    input: Omit<Announcement, "id" | "created_at" | "updated_at">,
  ): Promise<{ data?: Announcement; success: boolean; error?: string }> {
    try {
      console.log("[v0] AnnouncementsService.create (frontend-only)", input)
      const now = new Date().toISOString()
      const newItem: Announcement = {
        ...input,
        id: uid(),
        created_at: now,
        updated_at: now,
      }
      const list = this.getAllInternal()
      const next = [newItem, ...list]
      this.setAllInternal(next)
      return { data: newItem, success: true }
    } catch (error) {
      console.log("[v0] AnnouncementsService.create error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async update(
    id: string,
    patch: Partial<Announcement>,
  ): Promise<{ data?: Announcement; success: boolean; error?: string }> {
    try {
      console.log("[v0] AnnouncementsService.update (frontend-only) ID:", id)
      const list = this.getAllInternal()
      const index = list.findIndex((a) => a.id === id)
      if (index === -1) {
        return { success: false, error: "Announcement not found" }
      }
      const updated: Announcement = {
        ...list[index],
        ...patch,
        updated_at: new Date().toISOString(),
      }
      const next = [...list]
      next[index] = updated
      this.setAllInternal(next)
      return { data: updated, success: true }
    } catch (error) {
      console.log("[v0] AnnouncementsService.update error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("[v0] AnnouncementsService.delete (frontend-only) ID:", id)
      const list = this.getAllInternal()
      const index = list.findIndex((a) => a.id === id)
      if (index === -1) {
        return { success: false, error: "Announcement not found" }
      }
      const next = list.filter((a) => a.id !== id)
      this.setAllInternal(next)
      return { success: true }
    } catch (error) {
      console.log("[v0] AnnouncementsService.delete error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}
