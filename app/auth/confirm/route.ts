import { type EmailOtpType } from "@supabase/supabase-js"
import { type NextRequest } from "next/server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/gamekeep"

  const supabase = await createClient()

  // PKCE flow: Supabase verify endpoint exchanges token and redirects here with ?code=
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) redirect(next)
  }

  // Token hash flow: custom email template pointing directly to this route
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) redirect(next)
  }

  redirect("/error")
}
