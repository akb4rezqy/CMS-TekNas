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
      </body>
    </html>
  )
}
