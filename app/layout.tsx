import type { Metadata } from "next"
import { inter, geistSans, geistMono } from "@/app/ui/fonts"
import "./ui/globals.css"
import Navbar from "./components/common/navbar"
import Footer from "./components/common/footer"

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100 text-base-content`}>
        <Navbar>{children}</Navbar>
        <Footer />
      </body>
    </html>
  )
}
