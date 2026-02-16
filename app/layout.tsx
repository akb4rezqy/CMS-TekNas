import type React from "react"
import type { Metadata } from "next"
import { Red_Hat_Display } from "next/font/google"
import "./globals.css"

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-red-hat-display",
})

export const metadata: Metadata = {
  title: "SMK Teknologi Nasional Kota Bekasi",
  description: "Website resmi SMK Teknologi Nasional Kota Bekasi - Pendidikan vokasi teknologi yang inovatif dan inspiratif",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={redHatDisplay.variable}>
      <body className={redHatDisplay.className}>
        {children}
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "8067b5659f634c2189c64705c4625f31"}'></script>
      </body>
    </html>
  )
}
