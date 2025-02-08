import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "./components/navbar"
import Footer from "./components/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Gateway Gamers",
  description: "A site devoted to digital shelving.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      {/* <html lang='en' data-theme='gg-light'>  */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100 text-base-content`}>
        <Navbar>{children}</Navbar>
        <Footer />
      </body>
    </html>
  )
}
