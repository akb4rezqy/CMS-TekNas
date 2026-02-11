"use client"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useGallery } from "@/hooks/useApi"

function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onPrevious,
  onNext,
}: {
  isOpen: boolean
  onClose: () => void
  images: Array<{ id: string; src: string; title: string; description: string }>
  currentIndex: number
  onPrevious: () => void
  onNext: () => void
}) {
  if (!isOpen) return null

  const currentImage = images[currentIndex]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          aria-label="Close modal"
        >
          <X className="h-8 w-8" />
        </button>

        <div className="relative">
          <Image
            src={currentImage.src || "/placeholder.svg"}
            width={800}
            height={600}
            alt={currentImage.title}
            className="max-w-full max-h-[80vh] object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={onPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
        </div>

        <div className="text-white text-center mt-4">
          <h3 className="text-xl font-semibold">{currentImage.title}</h3>
          <p className="text-sm text-gray-300 mt-2">{currentImage.description}</p>
          {images.length > 1 && (
            <p className="text-sm text-gray-400 mt-2">
              {currentIndex + 1} dari {images.length}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function GaleriPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { gallery, loading, error } = useGallery()

  const headerAnimation = useScrollAnimation(0.1)
  const galleryAnimation = useScrollAnimation(0.2)

  const galleryImages = gallery.flatMap((item: any) =>
    (item.images || []).map((img: string, idx: number) => ({
      id: `${item.id}-${idx}`,
      src: img || "/placeholder.svg?height=300&width=400",
      title: item.title,
      description: item.description || "",
    }))
  )

  if (error) {
    return (
      <div className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">Galeri Sekolah</h1>
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

  const openModal = (index: number) => {
    setCurrentImageIndex(index)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Galeri Sekolah</h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
              Dokumentasi kegiatan, pembelajaran, dan kehidupan sehari-hari di SMK Teknologi Nasional.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Memuat galeri...</span>
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Belum ada foto dalam galeri.</p>
          </div>
        ) : (
          <div
            ref={galleryAnimation.ref}
            className={`grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-all duration-1000 ${
              galleryAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {galleryImages.map((image: any, index: number) => (
              <Card
                key={image.id}
                className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
                onClick={() => openModal(index)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      width={400}
                      height={300}
                      alt={image.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center">
                      <div className="text-white text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                        <p className="text-xs opacity-90">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {modalOpen && (
        <ImageModal
          isOpen={modalOpen}
          onClose={closeModal}
          images={galleryImages}
          currentIndex={currentImageIndex}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </div>
  )
}

export default withLayout(GaleriPage)
