"use client"

import { useState, useEffect } from "react"

const BASE_URL = "https://a.akbarezqy.my.id/api"

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${BASE_URL}/announcements`)
        const data = await response.json()
        if (data.success) {
          setAnnouncements(data.data)
        } else {
          setError(data.message || "Failed to fetch announcements")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch announcements")
      }
    }

    fetchAnnouncements()
  }, [])

  return { announcements, error }
}

export const useGallery = () => {
  const [gallery, setGallery] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${BASE_URL}/gallery`)
        const data = await response.json()
        if (data.success) {
          setGallery(data.data)
        } else {
          setError(data.message || "Failed to fetch gallery")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch gallery")
      }
    }

    fetchGallery()
  }, [])

  return { gallery, error }
}

export const useExtracurriculars = () => {
  const [extracurriculars, setExtracurriculars] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExtracurriculars = async () => {
      try {
        const response = await fetch(`${BASE_URL}/extracurriculars`)
        const data = await response.json()
        if (data.success) {
          setExtracurriculars(data.data)
        } else {
          setError(data.message || "Failed to fetch extracurriculars")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch extracurriculars")
      }
    }

    fetchExtracurriculars()
  }, [])

  return { extracurriculars, error }
}

export const useStaffTeachers = () => {
  const [staffTeachers, setStaffTeachers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStaffTeachers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/staff-teachers`)
        const data = await response.json()
        if (data.success) {
          setStaffTeachers(data.data)
        } else {
          setError(data.message || "Failed to fetch staff & teachers")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch staff & teachers")
      }
    }

    fetchStaffTeachers()
  }, [])

  return { staffTeachers, error }
}
