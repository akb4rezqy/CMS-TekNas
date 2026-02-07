/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Mengizinkan gambar dari semua domain (untuk sementara saat development)
      },
    ],
  },
  // Hapus blok 'eslint' dari sini jika ada
};

export default nextConfig;
