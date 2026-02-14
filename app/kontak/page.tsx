"use client"
import { useState, useRef, useEffect } from "react"
import Script from "next/script"
import { Mail, Phone, MapPin, Loader2, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""

function KontakPage() {
  const headerAnimation = useScrollAnimation(0.1)
  const contentAnimation = useScrollAnimation(0.2)
  const mapAnimation = useScrollAnimation(0.3)

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const renderTurnstile = () => {
    if (turnstileRef.current && (window as any).turnstile && !widgetIdRef.current) {
      widgetIdRef.current = (window as any).turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
        theme: "light",
      })
    }
  }

  const resetTurnstile = () => {
    if ((window as any).turnstile && widgetIdRef.current) {
      (window as any).turnstile.reset(widgetIdRef.current)
      setTurnstileToken("")
    }
  }

  useEffect(() => {
    if ((window as any).turnstile) {
      renderTurnstile()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!turnstileToken) {
      setError("Silakan selesaikan verifikasi CAPTCHA terlebih dahulu.")
      return
    }
    setSending(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      })
      const result = await res.json()
      if (result.success) {
        setSent(true)
        setForm({ name: "", email: "", subject: "", message: "" })
        setTurnstileToken("")
      } else {
        setError(result.error || "Gagal mengirim pesan")
        resetTurnstile()
      }
    } catch {
      setError("Gagal mengirim pesan. Coba lagi nanti.")
      resetTurnstile()
    } finally {
      setSending(false)
    }
  }

  const handleSendAgain = () => {
    setSent(false)
    widgetIdRef.current = null
    setTimeout(() => renderTurnstile(), 100)
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => renderTurnstile()}
      />
      <div className="py-12 md:py-24 lg:py-32">
        <main className="flex-1">
          <div className="container px-4 md:px-6">
            <div
              ref={headerAnimation.ref}
              className={`flex flex-col items-center justify-center space-y-4 text-center mb-12 transition-all duration-1000 ${
                headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Hubungi Kami</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan atau membutuhkan informasi lebih
                  lanjut.
                </p>
              </div>
            </div>

            <div
              ref={contentAnimation.ref}
              className={`grid gap-8 md:grid-cols-2 lg:grid-cols-3 transition-all duration-1000 ${
                contentAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="col-span-1 md:col-span-1 lg:col-span-1 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Informasi Kontak</CardTitle>
                  <CardDescription>Kami siap membantu Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 group">
                    <MapPin className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-sm">Jl. Irigasi Baru II Jl. Irigasi Persada Baru No.52, RT.004/RW.014, Bekasi Jaya, Kec. Bekasi Tim., Kota Bks, Jawa Barat 17112</p>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <Phone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                    <p className="text-muted-foreground">(021) 8816961</p>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                    <p className="text-muted-foreground">info@smkteknasional.sch.id</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 md:col-span-1 lg:col-span-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Kirim Pesan kepada Kami</CardTitle>
                  <CardDescription>Isi formulir di bawah ini dan kami akan segera menghubungi Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                  {sent ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                      <h3 className="text-xl font-semibold">Pesan Terkirim!</h3>
                      <p className="text-muted-foreground text-center">Terima kasih telah menghubungi kami. Kami akan segera membalas pesan Anda.</p>
                      <Button variant="outline" onClick={handleSendAgain}>Kirim Pesan Lagi</Button>
                    </div>
                  ) : (
                    <form className="grid gap-4" onSubmit={handleSubmit}>
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Nama Lengkap</label>
                        <input
                          id="name"
                          type="text"
                          required
                          placeholder="Nama Anda"
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 hover:border-primary/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <input
                          id="email"
                          type="email"
                          required
                          placeholder="email@example.com"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 hover:border-primary/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="subject" className="text-sm font-medium">Subjek</label>
                        <input
                          id="subject"
                          type="text"
                          required
                          placeholder="Subjek Pesan"
                          value={form.subject}
                          onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 hover:border-primary/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="message" className="text-sm font-medium">Pesan</label>
                        <textarea
                          id="message"
                          required
                          placeholder="Tulis pesan Anda di sini..."
                          rows={5}
                          value={form.message}
                          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 hover:border-primary/50"
                        />
                      </div>
                      {TURNSTILE_SITE_KEY && (
                        <div className="flex justify-center">
                          <div ref={turnstileRef} />
                        </div>
                      )}
                      {error && <p className="text-sm text-destructive text-center">{error}</p>}
                      <Button type="submit" className="w-full" disabled={sending || (!turnstileToken && !!TURNSTILE_SITE_KEY)}>
                        {sending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</> : "Kirim Pesan"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              <Card
                ref={mapAnimation.ref}
                className={`col-span-1 md:col-span-2 lg:col-span-3 hover:shadow-xl transition-all duration-1000 hover:-translate-y-1 ${
                  mapAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <CardHeader>
                  <CardTitle>Lokasi Kami</CardTitle>
                  <CardDescription>Temukan kami di peta.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.237326842188!2d107.0124054749905!3d-6.23241339375579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698e9891438899%3A0xab302ad1312fdcaa!2sSMK%20Teknologi%20Nasional!5e0!3m2!1sid!2sid!4v1754567247422!5m2!1sid!2sid"
                    aria-label="Lokasi SMK Teknologi Nasional Bekasi di Google Maps"
                    className="rounded-b-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default withLayout(KontakPage)
