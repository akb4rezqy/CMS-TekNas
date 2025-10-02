"use client"
import { Mail, Phone, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

function KontakPage() {
  const headerAnimation = useScrollAnimation(0.1)
  const contentAnimation = useScrollAnimation(0.2)
  const mapAnimation = useScrollAnimation(0.3)

  return (
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
            {/* Contact Information Card */}
            <Card className="col-span-1 md:col-span-1 lg:col-span-1 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
                <CardDescription>Kami siap membantu Anda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <MapPin className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                  <p className="text-muted-foreground">Jl. Pendidikan No. 123, Kota Harapan, Indonesia</p>
                </div>
                <div className="flex items-center gap-3 group">
                  <Phone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                  <p className="text-muted-foreground">(021) 1234-5678</p>
                </div>
                <div className="flex items-center gap-3 group">
                  <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                  <p className="text-muted-foreground">info@sekolahharapanbangsa.sch.id</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form Card */}
            <Card className="col-span-1 md:col-span-1 lg:col-span-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>Kirim Pesan kepada Kami</CardTitle>
                <CardDescription>Isi formulir di bawah ini dan kami akan segera menghubungi Anda.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Nama Anda"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Subjek
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Subjek Pesan"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pesan
                    </label>
                    <textarea
                      id="message"
                      placeholder="Tulis pesan Anda di sini..."
                      rows={5}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full">
                    Kirim Pesan
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Placeholder Map */}
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
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default withLayout(KontakPage)
