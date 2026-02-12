"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

function StrukturOrganisasiPage() {
  const headerAnimation = useScrollAnimation(0.1)
  const contentAnimation = useScrollAnimation(0.2)

  const orgStructure = [
    {
      level: 1,
      title: "Kepala Sekolah",
      name: "Bapak Budi Santoso, S.Pd.",
      description: "Memimpin dan mengelola seluruh kegiatan sekolah.",
    },
    {
      level: 2,
      title: "Wakil Kepala Sekolah Bidang Kurikulum",
      name: "Ibu Ani Wijaya, M.Pd.",
      description: "Bertanggung jawab atas pengembangan dan implementasi kurikulum.",
    },
    {
      level: 2,
      title: "Wakil Kepala Sekolah Bidang Kesiswaan",
      name: "Bapak Joko Susilo, S.Pd.",
      description: "Mengelola kegiatan kesiswaan dan pembinaan karakter siswa.",
    },
    {
      level: 2,
      title: "Wakil Kepala Sekolah Bidang Sarana & Prasarana",
      name: "Ibu Rina Amelia, S.T.",
      description: "Mengawasi dan mengembangkan fasilitas serta sarana sekolah.",
    },
    {
      level: 3,
      title: "Koordinator Guru",
      name: "Berbagai Koordinator Mata Pelajaran",
      description: "Mengkoordinasikan kegiatan belajar mengajar di setiap mata pelajaran.",
    },
    {
      level: 3,
      title: "Staf Administrasi",
      name: "Tim Administrasi",
      description: "Mendukung kelancaran operasional administrasi sekolah.",
    },
    {
      level: 3,
      title: "Pustakawan",
      name: "Ibu Hesti Susanti",
      description: "Mengelola perpustakaan dan sumber belajar.",
    },
    {
      level: 3,
      title: "Petugas Kebersihan & Keamanan",
      name: "Tim Pendukung",
      description: "Menjaga kebersihan dan keamanan lingkungan sekolah.",
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
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          Struktur Organisasi Sekolah
        </h1>
        <p className="max-w-3xl mx-auto text-muted-foreground text-base md:text-lg lg:text-xl">
          Mengenal jajaran pimpinan, guru, dan staf yang membentuk struktur organisasi SMK Teknologi Nasional.
        </p>
      </div>

      <div
        ref={contentAnimation.ref}
        className={`max-w-4xl mx-auto space-y-6 transition-all duration-1000 ${
          contentAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {orgStructure.map((item, index) => (
          <Card
            key={index}
            className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-xl md:text-2xl font-bold text-balance group-hover:text-primary transition-colors duration-300">
                {item.title}
              </CardTitle>
              <CardDescription className="text-base md:text-lg font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                {item.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default withLayout(StrukturOrganisasiPage)
