import type { Metadata } from "next"
import { geistSans, geistMono } from "@/app/ui/fonts"
import "./ui/globals.css"
import Navbar from "./components/common/navbar"
import Footer from "./components/common/footer"
import { createClient } from "@/utils/supabase/server"

export const metadata: Metadata = {
  title: "Gateway Gamers",
  description: "A site devoted to digital shelving.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
    isAdmin = profile?.role === "admin"
  }

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100 text-base-content`}>
        <Navbar isAdmin={isAdmin} isLoggedIn={!!user}>
          {children}
        </Navbar>
        <Footer />
      </body>
    </html>
  )
}
