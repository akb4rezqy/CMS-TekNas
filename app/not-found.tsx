import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4 text-center bg-background text-foreground">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-foreground mb-4">Halaman Tidak Ditemukan</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Maaf, halaman yang Anda cari tidak ada. Mungkin Anda salah mengetik alamat atau halaman telah dipindahkan.
      </p>
      <Link href="/" passHref>
        <Button className="px-8 py-3 text-lg">Kembali ke Beranda</Button>
      </Link>
    </div>
  )
}
