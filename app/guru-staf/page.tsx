"use client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

function GuruStafPage() {
  const headerAnimation = useScrollAnimation(0.1)
  const contentAnimation = useScrollAnimation(0.2)

  const staffData = [
    {
      id: 1,
      name: "Bapak Budi Santoso, S.Pd.",
      role: "Kepala Sekolah",
      image: "/placeholder.svg?height=150&width=150&text=Budi+Santoso",
      bio: "Berpengalaman lebih dari 20 tahun di dunia pendidikan, memimpin sekolah dengan visi inovatif.",
    },
    {
      id: 2,
      name: "Ibu Ani Wijaya, M.Pd.",
      role: "Wakil Kepala Sekolah Bidang Kurikulum",
      image: "/placeholder.svg?height=150&width=150&text=Ani+Wijaya",
      bio: "Ahli dalam pengembangan kurikulum dan metode pengajaran modern.",
    },
    {
      id: 3,
      name: "Bapak Cahyo Nugroho, S.Kom.",
      role: "Guru TIK",
      image: "/placeholder.svg?height=150&width=150&text=Cahyo+Nugroho",
      bio: "Mengajar teknologi informasi dan komunikasi dengan pendekatan praktis.",
    },
    {
      id: 4,
      name: "Ibu Dewi Lestari, S.Hum.",
      role: "Guru Bahasa Indonesia",
      image: "/placeholder.svg?height=150&width=150&text=Dewi+Lestari",
      bio: "Membimbing siswa dalam memahami sastra dan meningkatkan kemampuan berbahasa.",
    },
    {
      id: 5,
      name: "Bapak Eko Prasetyo, S.Pd.",
      role: "Guru Olahraga",
      image: "/placeholder.svg?height=150&width=150&text=Eko+Prasetyo",
      bio: "Mendorong gaya hidup sehat dan pengembangan bakat olahraga siswa.",
    },
    {
      id: 6,
      name: "Ibu Fitriani, S.Psi.",
      role: "Konselor Sekolah",
      image: "/placeholder.svg?height=150&width=150&text=Fitriani",
      bio: "Memberikan bimbingan dan dukungan psikologis untuk siswa.",
    },
    {
      id: 7,
      name: "Bapak Guntur Ramadhan",
      role: "Staf Administrasi",
      image: "/placeholder.svg?height=150&width=150&text=Guntur+Ramadhan",
      bio: "Bertanggung jawab atas kelancaran administrasi sekolah.",
    },
    {
      id: 8,
      name: "Ibu Hesti Susanti",
      role: "Pustakawan",
      image: "/placeholder.svg?height=150&width=150&text=Hesti+Susanti",
      bio: "Mengelola perpustakaan dan membantu siswa menemukan sumber belajar.",
    },
  ]

  return (
    <div className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div
          ref={headerAnimation.ref}
          className={`flex flex-col items-center justify-center space-y-4 text-center mb-12 transition-all duration-1000 ${
            headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Data Guru & Staf</h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
              Kenali para pendidik dan staf profesional yang berdedikasi di Sekolah Harapan Bangsa.
            </p>
          </div>
        </div>

        <div
          ref={contentAnimation.ref}
          className={`grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-all duration-1000 ${
            contentAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {staffData.map((person, index) => (
            <Card
              key={person.id}
              className="flex flex-col items-center text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Image
                src={person.image || "/placeholder.svg"}
                width={150}
                height={150}
                alt={person.name}
                className="rounded-full object-cover mb-4 aspect-square group-hover:scale-105 transition-transform duration-300"
              />
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                  {person.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                  {person.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 text-sm text-muted-foreground">
                <p>{person.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {staffData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada data guru & staf yang tersedia.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default withLayout(GuruStafPage)
