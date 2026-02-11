"use client"

import { useState, useEffect } from "react"

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/announcements")
        const result = await response.json()
        if (result.success) {
          const published = result.data.filter((a: any) => a.status === "published")
          setAnnouncements(published)
        } else {
          setError(result.error || "Failed to fetch announcements")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch")
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  return { announcements, loading, error }
}

export const useGallery = () => {
  const [gallery, setGallery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery")
        const result = await response.json()
        if (result.success) {
          setGallery(result.data)
        } else {
          setError(result.error || "Failed to fetch gallery")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch")
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  return { gallery, loading, error }
}

export const useExtracurriculars = () => {
  const [extracurriculars, setExtracurriculars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExtracurriculars = async () => {
      try {
        const response = await fetch("/api/extracurriculars")
        const result = await response.json()
        if (result.success) {
          setExtracurriculars(result.data)
        } else {
          setError(result.error || "Failed to fetch extracurriculars")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch")
      } finally {
        setLoading(false)
      }
    }

    fetchExtracurriculars()
  }, [])

  return { extracurriculars, loading, error }
}

export const useStaffTeachers = () => {
  const [staffTeachers, setStaffTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStaffTeachers = async () => {
      try {
        const response = await fetch("/api/staff-teachers")
        const result = await response.json()
        if (result.success) {
          setStaffTeachers(result.data)
        } else {
          setError(result.error || "Failed to fetch staff & teachers")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch")
      } finally {
        setLoading(false)
      }
    }

    fetchStaffTeachers()
  }, [])

  return { staffTeachers, loading, error }
}
