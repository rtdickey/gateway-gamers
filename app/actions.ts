"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

const getUser = async () => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  return { user: data.user }
}

export const signOut = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export default getUser
