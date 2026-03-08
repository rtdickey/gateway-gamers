"use server"

import { createClient } from "@/utils/supabase/server"
import { AppRole } from "@/database.types"
import { Tables } from "@/database.types"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export type UserWithRole = Pick<Tables<"users">, "id" | "email" | "display_name" | "role">

export const getUsers = async (): Promise<UserWithRole[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("users")
    .select("id, email, display_name, role")
    .order("email", { ascending: true })
    .returns<UserWithRole[]>()

  if (error) redirect("/error")
  return data
}

export const updateUserRole = async (userId: string, role: AppRole) => {
  const supabase = await createClient()

  const { error } = await supabase.from("users").update({ role }).eq("id", userId)

  if (error) throw error
  revalidatePath("/admin/users")
}
