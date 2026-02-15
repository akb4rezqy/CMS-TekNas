"use client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useStaffTeachers } from "@/hooks/useApi"

function getDefaultAvatar(gender?: string) {
  return gender === "female" ? "/default-female.png" : "/default-male.jpg"
}

function GuruStafPage() {
  const headerAnimation = useScrollAnimation(0.1)
  const contentAnimation = useScrollAnimation(0.2)
  const { staffTeachers, loading, error } = useStaffTeachers()

  if (error) {
    return (
      <div className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">Data Guru & Staf</h1>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Terjadi Kesalahan</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
              Kenali para pendidik dan staf profesional yang berdedikasi di SMK Teknologi Nasional.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Memuat data...</span>
          </div>
        ) : staffTeachers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Belum ada data guru & staf yang tersedia.</p>
          </div>
        ) : (
          <div
            ref={contentAnimation.ref}
            className={`grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-all duration-1000 ${
              contentAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {staffTeachers.map((person: any, index: number) => (
              <Card
                key={person.id}
                className="flex flex-col items-center text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Image
                  src={person.photo_url || getDefaultAvatar(person.gender)}
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
                    {person.position}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 text-sm text-muted-foreground">
                  <p>{person.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default withLayout(GuruStafPage)
