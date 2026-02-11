"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"

function GlitchText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?0123456789"

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    let loop: ReturnType<typeof setInterval>

    const run = () => {
      let i = 0
      interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((c, idx) =>
              idx < i ? text[idx] : chars[Math.floor(Math.random() * chars.length)]
            )
            .join("")
        )
        i += 0.5
        if (i >= text.length) {
          clearInterval(interval)
          setDisplay(text)
        }
      }, 40)
    }

    run()
    loop = setInterval(run, 6000)
    return () => {
      clearInterval(interval)
      clearInterval(loop)
    }
  }, [text])

  return <>{display}</>
}

export default function NotFound() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    const handler = (e: MouseEvent) => {
      if (!ref.current) return
      const r = ref.current.getBoundingClientRect()
      setMouse({
        x: ((e.clientX - r.left) / r.width - 0.5) * 20,
        y: ((e.clientY - r.top) / r.height - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handler)
    return () => window.removeEventListener("mousemove", handler)
  }, [])

  const particles = Array.from({ length: 18 }, (_, i) => ({
    d: (Math.random() * 5).toFixed(1),
    s: 4 + Math.random() * 10,
    x: Math.random() * 100,
    dur: (6 + Math.random() * 4).toFixed(1),
  }))

  return (
    <div
      ref={ref}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center overflow-hidden relative select-none"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {ready &&
          particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/20 animate-float-up"
              style={{
                width: p.s,
                height: p.s,
                left: `${p.x}%`,
                bottom: "-20px",
                animationDelay: `${p.d}s`,
                animationDuration: `${p.dur}s`,
              }}
            />
          ))}
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.03) 2px,rgba(255,255,255,0.03) 4px)",
        }}
      />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />

      <div
        className="relative z-10 text-center px-6 max-w-2xl mx-auto"
        style={{
          transform: ready
            ? `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px)`
            : "none",
          transition: "transform 0.15s ease-out",
        }}
      >
        <div className="relative mb-6">
          <h1
            className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter"
            style={{
              background:
                "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #60a5fa 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradient-shift 4s ease infinite",
              filter: "drop-shadow(0 0 40px rgba(96,165,250,0.3))",
            }}
          >
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10rem] sm:text-[14rem] font-black text-blue-400 blur-md opacity-10 animate-pulse">
              404
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white/90">
            <GlitchText text="Halaman Tidak Ditemukan" />
          </h2>
          <p className="text-blue-200/60 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Sepertinya kamu tersesat di dunia digital. Halaman yang kamu cari
            mungkin sudah dipindahkan atau tidak tersedia.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group relative px-8 py-3.5 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(96,165,250,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-opacity group-hover:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Kembali ke Beranda
            </span>
          </Link>

          <Link
            href="/pengumuman"
            className="group px-8 py-3.5 rounded-xl font-semibold text-blue-300 border border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-500/10 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Lihat Pengumuman
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>
        </div>

        <div className="mt-16 flex justify-center gap-8 text-blue-400/30 text-sm">
          <Link href="/galeri" className="hover:text-blue-300 transition-colors">
            Galeri
          </Link>
          <Link
            href="/ekstrakurikuler"
            className="hover:text-blue-300 transition-colors"
          >
            Ekstrakurikuler
          </Link>
          <Link
            href="/guru-staff"
            className="hover:text-blue-300 transition-colors"
          >
            Guru & Staff
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-blue-400/20 text-xs font-mono">
        SMK Teknologi Nasional
      </div>
    </div>
  )
}
