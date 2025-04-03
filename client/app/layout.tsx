import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { AlertProvider } from "@/lib/alert-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Recipe App",
  description: "Search and save your favorite recipes",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlertProvider>
          <Navbar />
          <main>{children}</main>
        </AlertProvider>
      </body>
    </html>
  )
}



import './globals.css'