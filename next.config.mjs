/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  allowedDevOrigins: ["*.janeway.replit.dev", "*.replit.dev", "*.repl.co"],
  experimental: {},
}

export default nextConfig
