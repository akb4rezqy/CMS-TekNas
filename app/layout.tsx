import type React from "react"
import type { Metadata } from "next"
import { Red_Hat_Display } from "next/font/google"
import "./globals.css"

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-red-hat-display",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
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
