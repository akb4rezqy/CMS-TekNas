"use client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useExtracurriculars } from "@/hooks/useApi"

function EkstrakurikulerPage() {
  const headerAnimation = useScrollAnimation(0.1)
  const contentAnimation = useScrollAnimation(0.2)
  const { extracurriculars, loading, error } = useExtracurriculars()

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">Program Ekstrakurikuler</h1>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div
        ref={headerAnimation.ref}
        className={`text-center mb-8 md:mb-12 transition-all duration-1000 ${
          headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Program Ekstrakurikuler</h1>
        <p className="max-w-3xl mx-auto text-muted-foreground text-base md:text-lg lg:text-xl">
          Jelajahi berbagai kegiatan ekstrakurikuler yang tersedia untuk mengembangkan minat dan bakat siswa.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Memuat data...</span>
        </div>
      ) : extracurriculars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Belum ada program ekstrakurikuler yang tersedia.</p>
        </div>
      ) : (
        <div
          ref={contentAnimation.ref}
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto transition-all duration-1000 ${
            contentAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {extracurriculars.map((activity: any, index: number) => (
            <Card
              key={activity.id}
              className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[3/2] relative overflow-hidden">
                <img
                  src={(activity.images && activity.images[0]) || "/placeholder.svg?height=200&width=300"}
                  alt={activity.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                  {activity.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default withLayout(EkstrakurikulerPage)
