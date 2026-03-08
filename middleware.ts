import { type NextRequest } from "next/server"
import { updateSession } from "./utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ["/gamekeep/:path*", "/games/:path*", "/admin/:path*", "/friends/:path*"],
}
