"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      shouldCreateUser: false,
    },
  }

  const { error } = await supabase.auth.signInWithOtp(data)

  if (error) {
    // User does not exist — site is invite-only
    if (
      error.status === 422 ||
      error.message.toLowerCase().includes("signups not allowed") ||
      error.message.toLowerCase().includes("user not found")
    ) {
      redirect("/login?notInvited=true")
    }
    console.error("signInWithOtp error:", error.message, error.status)
    redirect(`/error?message=${encodeURIComponent(error.message)}&status=${error.status ?? ""}`)
  }

  redirect("/login?sent=true")
}
