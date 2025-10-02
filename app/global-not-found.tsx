import Link from 'next/link'

export const metadata = {
  title: 'Halaman Tidak Ditemukan - Sekolah Harapan Bangsa',
  description: 'Maaf, halaman yang Anda cari tidak ada.',
}

export default function GlobalNotFound() {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center bg-background text-foreground">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-foreground mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Maaf, halaman yang Anda cari tidak ada. Mungkin Anda salah mengetik alamat atau halaman telah dipindahkan.
          </p>
          <Link href="/" passHref>
            <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Kembali ke Beranda
            </button>
          </Link>
        </div>
      </body>
    </html>
  )
}
