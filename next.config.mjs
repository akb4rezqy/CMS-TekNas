/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["*.janeway.replit.dev"],
  experimental: {
    globalNotFound: true,
  },
}

export default nextConfig
