"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ExternalLink, BookOpen } from "lucide-react"
import { withLayout } from "@/components/hoc/with-layout"

interface Assessment {
  id: string
  class_grade: string
  class_major: string
  subject_name: string
  gform_link: string
  day_name: string
  sort_order: number
}

const GRADES = ["10", "11", "12"]
const MAJORS = ["TKJ", "TKR"]

const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

function AsesmenPage() {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(false)
  const [animateKey, setAnimateKey] = useState(0)

  useEffect(() => {
    if (!selectedGrade || !selectedMajor) return
    setLoading(true)
    fetch(`/api/assessments?grade=${selectedGrade}&major=${selectedMajor}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setAssessments(res.data)
        else setAssessments([])
      })
      .catch(() => setAssessments([]))
      .finally(() => setLoading(false))
  }, [selectedGrade, selectedMajor])

  const groupedByDay = DAY_ORDER.map((day) => ({
    day,
    subjects: assessments
      .filter((a) => a.day_name === day)
      .sort((a, b) => a.sort_order - b.sort_order),
  })).filter((g) => g.subjects.length > 0)

  const isFullySelected = selectedGrade && selectedMajor

  const handleSelectGrade = (grade: string) => {
    setSelectedGrade(grade)
    setAnimateKey((k) => k + 1)
  }

  const handleSelectMajor = (major: string) => {
    setSelectedMajor(major)
    setAnimateKey((k) => k + 1)
  }

  const handleReset = () => {
    setSelectedGrade(null)
    setSelectedMajor(null)
    setAssessments([])
    setAnimateKey((k) => k + 1)
  }

  const handleBackToGrade = () => {
    setSelectedGrade(null)
    setAnimateKey((k) => k + 1)
  }

  return (
    <div>
      <div className="bg-[rgba(10,46,125,1)] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center animate-[fadeSlideDown_0.6s_ease-out]">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Asesmen Online</h1>
          <p className="text-white/70 text-sm md:text-base">
            Pilih kelas dan jurusan untuk melihat daftar mata pelajaran beserta link asesmen
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 pb-16">
        {!isFullySelected ? (
          <div
            key={`select-${animateKey}`}
            className="bg-white rounded-xl shadow-sm border p-6 md:p-8 animate-[fadeSlideUp_0.4s_ease-out]"
          >
            {!selectedGrade ? (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Pilih Kelas</h2>
                <div className="grid grid-cols-3 gap-3">
                  {GRADES.map((grade, i) => (
                    <button
                      key={grade}
                      onClick={() => handleSelectGrade(grade)}
                      className="flex items-center justify-between p-5 rounded-xl border-2 border-gray-100 hover:border-[rgba(10,46,125,1)] hover:bg-blue-50 transition-all duration-200 group hover:scale-[1.02] active:scale-95 animate-[fadeSlideUp_0.4s_ease-out]"
                      style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                    >
                      <div className="text-left">
                        <p className="text-xs text-gray-400 font-medium">Kelas</p>
                        <p className="text-2xl font-bold text-gray-900 group-hover:text-[rgba(10,46,125,1)]">{grade}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[rgba(10,46,125,1)] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-5 animate-[fadeIn_0.3s_ease-out]">
                  <button
                    onClick={handleBackToGrade}
                    className="text-sm text-gray-400 hover:text-[rgba(10,46,125,1)] transition-colors"
                  >
                    Pilih Kelas
                  </button>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                  <span className="text-sm font-semibold text-gray-900">Kelas {selectedGrade}</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Pilih Jurusan</h2>
                <div className="grid grid-cols-2 gap-3">
                  {MAJORS.map((major, i) => (
                    <button
                      key={major}
                      onClick={() => handleSelectMajor(major)}
                      className="flex items-center justify-between p-5 rounded-xl border-2 border-gray-100 hover:border-[rgba(10,46,125,1)] hover:bg-blue-50 transition-all duration-200 group hover:scale-[1.02] active:scale-95 animate-[fadeSlideUp_0.4s_ease-out]"
                      style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
                    >
                      <div className="text-left">
                        <p className="text-xs text-gray-400 font-medium">Jurusan</p>
                        <p className="text-2xl font-bold text-gray-900 group-hover:text-[rgba(10,46,125,1)]">{major}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[rgba(10,46,125,1)] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div key={`result-${animateKey}`} className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between animate-[fadeSlideUp_0.4s_ease-out]">
              <div>
                <p className="text-xs text-gray-400">Kelas & Jurusan</p>
                <p className="text-xl font-bold text-gray-900">{selectedGrade} {selectedMajor}</p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-[rgba(10,46,125,1)] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors active:scale-95"
              >
                Ganti Kelas
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center animate-[fadeIn_0.3s_ease-out]">
                <div className="animate-spin h-8 w-8 border-4 border-gray-200 border-t-[rgba(10,46,125,1)] rounded-full mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Memuat data...</p>
              </div>
            ) : groupedByDay.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center animate-[fadeSlideUp_0.4s_ease-out]">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Belum ada data asesmen</p>
                <p className="text-gray-400 text-sm mt-1">Data asesmen untuk kelas ini belum ditambahkan</p>
              </div>
            ) : (
              groupedByDay.map(({ day, subjects }, dayIndex) => (
                <div
                  key={day}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden animate-[fadeSlideUp_0.4s_ease-out]"
                  style={{ animationDelay: `${dayIndex * 100}ms`, animationFillMode: "both" }}
                >
                  <div className="px-5 py-3 bg-gray-50 border-b">
                    <h3 className="font-semibold text-gray-900">{day}</h3>
                  </div>
                  <div className="divide-y">
                    {subjects.map((subject, subIndex) => (
                      <a
                        key={subject.id}
                        href={subject.gform_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-all group hover:pl-6 animate-[fadeIn_0.3s_ease-out]"
                        style={{ animationDelay: `${dayIndex * 100 + subIndex * 50}ms`, animationFillMode: "both" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[rgba(10,46,125,1)] text-xs font-bold shrink-0">
                            {subject.sort_order}
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-[rgba(10,46,125,1)] transition-colors">
                            {subject.subject_name}
                          </span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-[rgba(10,46,125,1)] transition-all group-hover:scale-110 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default withLayout(AsesmenPage)
