import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Auth callback route — handles the code exchange after Supabase
 * redirects back from email verification, password reset, etc.
 *
 * The `code` query param is exchanged for a session, then the user
 * is redirected to `next` (defaults to `/dashboard`).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  // If code exchange failed or no code, redirect to login with error
  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', origin))
}
