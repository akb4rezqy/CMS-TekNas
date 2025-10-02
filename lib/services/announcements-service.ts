import { type Announcement, dummyAnnouncements } from "@/lib/data/dummy-data"

const USE_DUMMY = process.env.USE_DUMMY === "true"

export class AnnouncementsService {
  private static dummyData: Announcement[] = [...dummyAnnouncements]

  static async getAll(): Promise<{ data: Announcement[]; success: boolean; error?: string }> {
    try {
      console.log("[v0] AnnouncementsService.getAll - USE_DUMMY:", USE_DUMMY)

      if (USE_DUMMY) {
        console.log("[v0] Using dummy data, count:", this.dummyData.length)
        return { data: this.dummyData, success: true }
      }

      console.log("[v0] Fetching from API")
      const response = await fetch("/api/announcements", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] API response success:", result.success)
      return result
    } catch (error) {
      console.log("[v0] AnnouncementsService.getAll error:", error)
      return { data: [], success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async create(
    announcement: Omit<Announcement, "id" | "created_at" | "updated_at">,
  ): Promise<{ data?: Announcement; success: boolean; error?: string }> {
    try {
      console.log("[v0] AnnouncementsService.create - USE_DUMMY:", USE_DUMMY)

      if (USE_DUMMY) {
        const newAnnouncement: Announcement = {
          ...announcement,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        this.dummyData.unshift(newAnnouncement)
        console.log("[v0] Created dummy announcement:", newAnnouncement.id)
        return { data: newAnnouncement, success: true }
      }

      console.log("[v0] Creating via API")
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] API create success:", result.success)
      return result
    } catch (error) {
      console.log("[v0] AnnouncementsService.create error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async update(
    id: string,
    announcement: Partial<Announcement>,
  ): Promise<{ data?: Announcement; success: boolean; error?: string }> {
    try {
      console.log("[v0] AnnouncementsService.update - USE_DUMMY:", USE_DUMMY, "ID:", id)

      if (USE_DUMMY) {
        const index = this.dummyData.findIndex((item) => item.id === id)
        if (index === -1) {
          return { success: false, error: "Announcement not found" }
        }

        this.dummyData[index] = {
          ...this.dummyData[index],
          ...announcement,
          updated_at: new Date().toISOString(),
        }
        console.log("[v0] Updated dummy announcement:", id)
        return { data: this.dummyData[index], success: true }
      }

      console.log("[v0] Updating via API")
      const response = await fetch(`/api/announcements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] API update success:", result.success)
      return result
    } catch (error) {
      console.log("[v0] AnnouncementsService.update error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("[v0] AnnouncementsService.delete - USE_DUMMY:", USE_DUMMY, "ID:", id)

      if (USE_DUMMY) {
        const index = this.dummyData.findIndex((item) => item.id === id)
        if (index === -1) {
          return { success: false, error: "Announcement not found" }
        }

        this.dummyData.splice(index, 1)
        console.log("[v0] Deleted dummy announcement:", id)
        return { success: true }
      }

      console.log("[v0] Deleting via API")
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] API delete success:", result.success)
      return result
    } catch (error) {
      console.log("[v0] AnnouncementsService.delete error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}
