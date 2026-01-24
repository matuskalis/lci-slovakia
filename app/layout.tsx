import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { LanguageProvider } from "@/contexts/LanguageContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "LCI-SK.eu - Ochrana veľkých šeliem na Slovensku",
  description: "Združenie pre ochranu a výskum veľkých šeliem na Slovensku - medveďa, vlka a rysa.",
  keywords: "medveď, vlk, rys, ochrana, Slovensko, wildlife, conservation",
  openGraph: {
    title: "LCI-SK.eu - Ochrana veľkých šeliem",
    description: "Združenie pre ochranu a výskum veľkých šeliem na Slovensku",
    type: "website",
    locale: "sk_SK",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-foreground font-sans">
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
