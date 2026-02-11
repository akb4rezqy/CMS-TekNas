"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?0123456789"

function GlitchText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)

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
              idx < i ? text[idx] : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
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

export default function GlobalNotFound() {
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
    d: +(Math.random() * 5).toFixed(1),
    s: 4 + Math.random() * 10,
    x: Math.random() * 100,
    dur: +(6 + Math.random() * 4).toFixed(1),
  }))

  return (
    <html lang="id">
      <head>
        <title>404 - Halaman Tidak Ditemukan | SMK Teknologi Nasional</title>
        <meta name="description" content="Halaman yang Anda cari tidak ditemukan." />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 0.3; }
            50% { opacity: 0.6; }
            100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
          }

          @keyframes pulseSlow {
            0%, 100% { opacity: 0.08; transform: scale(1); }
            50% { opacity: 0.15; transform: scale(1.1); }
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.2; }
          }

          .nf-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #020617 0%, #0c1836 50%, #0f172a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            user-select: none;
          }

          .nf-particle {
            position: absolute;
            border-radius: 50%;
            background: rgba(96, 165, 250, 0.2);
            animation: floatUp 8s ease-in infinite;
          }

          .nf-scanlines {
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: 0.03;
            background-image: repeating-linear-gradient(
              0deg, transparent, transparent 2px,
              rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px
            );
          }

          .nf-glow1 {
            position: absolute;
            top: 25%;
            left: 25%;
            width: 384px;
            height: 384px;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 50%;
            filter: blur(120px);
            animation: pulseSlow 6s ease-in-out infinite;
          }

          .nf-glow2 {
            position: absolute;
            bottom: 25%;
            right: 25%;
            width: 320px;
            height: 320px;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 50%;
            filter: blur(100px);
            animation: pulseSlow 6s ease-in-out infinite;
            animation-delay: 2s;
          }

          .nf-content {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 0 24px;
            max-width: 640px;
            margin: 0 auto;
            transition: transform 0.15s ease-out;
          }

          .nf-404-wrap {
            position: relative;
            margin-bottom: 24px;
          }

          .nf-404 {
            font-size: clamp(8rem, 20vw, 14rem);
            font-weight: 900;
            line-height: 1;
            letter-spacing: -0.05em;
            background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #60a5fa 100%);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 4s ease infinite;
            filter: drop-shadow(0 0 40px rgba(96,165,250,0.3));
          }

          .nf-404-ghost {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
          }

          .nf-404-ghost span {
            font-size: clamp(8rem, 20vw, 14rem);
            font-weight: 900;
            color: rgba(96, 165, 250, 0.1);
            filter: blur(12px);
            animation: pulse 3s ease-in-out infinite;
          }

          .nf-title {
            font-size: clamp(1.5rem, 3vw, 1.875rem);
            font-weight: 700;
            color: rgba(255,255,255,0.9);
            margin-bottom: 16px;
          }

          .nf-desc {
            color: rgba(147, 197, 253, 0.5);
            font-size: clamp(0.95rem, 2vw, 1.125rem);
            max-width: 28rem;
            margin: 0 auto 40px;
            line-height: 1.6;
          }

          .nf-buttons {
            display: flex;
            flex-direction: column;
            gap: 16px;
            justify-content: center;
            align-items: center;
          }

          @media (min-width: 640px) {
            .nf-buttons { flex-direction: row; }
          }

          .nf-btn-primary {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            color: white;
            text-decoration: none;
            overflow: hidden;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            background: linear-gradient(to right, #2563eb, #7c3aed);
          }

          .nf-btn-primary:hover {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(96,165,250,0.4);
          }

          .nf-btn-primary svg {
            transition: transform 0.3s ease;
          }

          .nf-btn-primary:hover svg {
            transform: translateX(-4px);
          }

          .nf-btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            color: #93c5fd;
            text-decoration: none;
            border: 1px solid rgba(59, 130, 246, 0.3);
            background: transparent;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .nf-btn-secondary:hover {
            border-color: rgba(96, 165, 250, 0.6);
            background: rgba(59, 130, 246, 0.1);
            transform: scale(1.05);
          }

          .nf-btn-secondary svg {
            transition: transform 0.3s ease;
          }

          .nf-btn-secondary:hover svg {
            transform: translateX(4px);
          }

          .nf-links {
            margin-top: 64px;
            display: flex;
            justify-content: center;
            gap: 32px;
            font-size: 0.875rem;
          }

          .nf-links a {
            color: rgba(96, 165, 250, 0.3);
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .nf-links a:hover {
            color: #93c5fd;
          }

          .nf-footer {
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(96, 165, 250, 0.2);
            font-size: 0.75rem;
            font-family: monospace;
          }
        `}</style>
      </head>
      <body>
        <div ref={ref} className="nf-container">
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {ready &&
              particles.map((p, i) => (
                <div
                  key={i}
                  className="nf-particle"
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

          <div className="nf-scanlines" />
          <div className="nf-glow1" />
          <div className="nf-glow2" />

          <div
            className="nf-content"
            style={{
              transform: ready
                ? `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px)`
                : "none",
            }}
          >
            <div className="nf-404-wrap">
              <h1 className="nf-404">404</h1>
              <div className="nf-404-ghost">
                <span>404</span>
              </div>
            </div>

            <h2 className="nf-title">
              <GlitchText text="Halaman Tidak Ditemukan" />
            </h2>

            <p className="nf-desc">
              Sepertinya kamu tersesat di dunia digital. Halaman yang kamu cari
              mungkin sudah dipindahkan atau tidak tersedia.
            </p>

            <div className="nf-buttons">
              <Link href="/" className="nf-btn-primary">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Kembali ke Beranda
              </Link>

              <Link href="/pengumuman" className="nf-btn-secondary">
                Lihat Pengumuman
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <div className="nf-links">
              <Link href="/galeri">Galeri</Link>
              <Link href="/ekstrakurikuler">Ekstrakurikuler</Link>
              <Link href="/guru-staff">Guru & Staff</Link>
            </div>
          </div>

          <div className="nf-footer">SMK Teknologi Nasional</div>
        </div>
      </body>
    </html>
  )
}
