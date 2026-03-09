"use server"

import { createClient } from "@/utils/supabase/server"
import { FriendshipStatus, Tables } from "@/database.types"
import getUser from "@/app/actions"
import { revalidatePath } from "next/cache"

export type FriendProfile = Pick<Tables<"users">, "id" | "email" | "display_name">

export interface Friendship extends Tables<"friendships"> {
  friend: FriendProfile
}

export const getFriends = async (userId: string): Promise<Friendship[]> => {
  const supabase = await createClient()

  // Accepted friendships where user is either side — fetch both directions
  const [asRequester, asAddressee] = await Promise.all([
    supabase
      .from("friendships")
      .select(
        "id, created_at, requester_id, addressee_id, status, friend:users!friendships_addressee_id_fkey(id, email, display_name)",
      )
      .eq("requester_id", userId)
      .eq("status", "accepted")
      .returns<Friendship[]>(),
    supabase
      .from("friendships")
      .select(
        "id, created_at, requester_id, addressee_id, status, friend:users!friendships_requester_id_fkey(id, email, display_name)",
      )
      .eq("addressee_id", userId)
      .eq("status", "accepted")
      .returns<Friendship[]>(),
  ])

  return [...(asRequester.data ?? []), ...(asAddressee.data ?? [])]
}

export const getPendingRequests = async (userId: string): Promise<Friendship[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("friendships")
    .select(
      "id, created_at, requester_id, addressee_id, status, friend:users!friendships_requester_id_fkey(id, email, display_name)",
    )
    .eq("addressee_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .returns<Friendship[]>()

  if (error) throw error
  return data ?? []
}

export const getSentRequests = async (userId: string): Promise<Friendship[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("friendships")
    .select(
      "id, created_at, requester_id, addressee_id, status, friend:users!friendships_addressee_id_fkey(id, email, display_name)",
    )
    .eq("requester_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .returns<Friendship[]>()

  if (error) throw error
  return data ?? []
}

export const searchUsers = async (query: string): Promise<FriendProfile[]> => {
  const supabase = await createClient()
  const { user } = await getUser()

  const { data, error } = await supabase
    .from("users")
    .select("id, email, display_name")
    .or(`email.ilike.%${query}%,display_name.ilike.%${query}%`)
    .neq("id", user.id)
    .limit(10)
    .returns<FriendProfile[]>()

  if (error) throw error
  return data ?? []
}

export const sendFriendRequest = async (addresseeId: string) => {
  const supabase = await createClient()
  const { user } = await getUser()

  const { error } = await supabase.from("friendships").insert({
    requester_id: user.id,
    addressee_id: addresseeId,
    status: "pending",
  })

  if (error) throw error
  revalidatePath("/friends")
}

export const respondToRequest = async (friendshipId: string, status: FriendshipStatus) => {
  const supabase = await createClient()

  const { error } = await supabase.from("friendships").update({ status }).eq("id", friendshipId)

  if (error) throw error
  revalidatePath("/friends")
}

export const deleteFriendship = async (friendshipId: string) => {
  const supabase = await createClient()

  const { error } = await supabase.from("friendships").delete().eq("id", friendshipId)

  if (error) throw error
  revalidatePath("/friends")
}
