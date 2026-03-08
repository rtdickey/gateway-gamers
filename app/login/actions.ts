"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  }

  const { error } = await supabase.auth.signInWithOtp(data)

  if (error) {
    console.error("signInWithOtp error:", error.message, error.status)
    redirect(`/error?message=${encodeURIComponent(error.message)}&status=${error.status ?? ""}`)
  }

  redirect("/login?sent=true")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect("/")
}
