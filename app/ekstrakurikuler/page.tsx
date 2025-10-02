"use client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

function EkstrakurikulerPage() {
  const headerAnimation = useScrollAnimation(0.1)
  const contentAnimation = useScrollAnimation(0.2)

  const extracurriculars = [
    {
      id: 1,
      name: "Klub Sains",
      description: "Eksplorasi dunia sains melalui eksperimen dan proyek inovatif.",
      image: "/placeholder.svg?height=200&width=300&text=Klub+Sains",
    },
    {
      id: 2,
      name: "Seni Rupa & Kerajinan",
      description: "Mengembangkan kreativitas melalui melukis, memahat, dan kerajinan tangan.",
      image: "/placeholder.svg?height=200&width=300&text=Seni+Rupa",
    },
    {
      id: 3,
      name: "Sepak Bola",
      description: "Melatih fisik, strategi, dan kerja sama tim dalam olahraga sepak bola.",
      image: "/placeholder.svg?height=200&width=300&text=Sepak+Bola",
    },
    {
      id: 4,
      name: "Klub Komputer & Coding",
      description: "Mempelajari dasar-dasar pemrograman, desain web, dan pengembangan aplikasi.",
      image: "/placeholder.svg?height=200&width=300&text=Coding+Club",
    },
    {
      id: 5,
      name: "Pramuka",
      description: "Membangun karakter, kemandirian, dan kepemimpinan melalui kegiatan kepramukaan.",
      image: "/placeholder.svg?height=200&width=300&text=Pramuka",
    },
    {
      id: 6,
      name: "Paduan Suara",
      description: "Mengembangkan bakat vokal dan harmoni dalam kelompok paduan suara.",
      image: "/placeholder.svg?height=200&width=300&text=Paduan+Suara",
    },
  ]

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

      <div
        ref={contentAnimation.ref}
        className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto transition-all duration-1000 ${
          contentAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {extracurriculars.map((activity, index) => (
          <Card
            key={activity.id}
            className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="aspect-[3/2] relative overflow-hidden">
              <Image
                src={activity.image || "/placeholder.svg"}
                fill
                alt={activity.name}
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                {activity.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {extracurriculars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tidak ada program ekstrakurikuler yang tersedia.</p>
        </div>
      )}
    </div>
  )
}

export default withLayout(EkstrakurikulerPage)
