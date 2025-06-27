// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server'

import { createServerSupabaseClient } from '@/lib/supabase/utils'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    // Optional: Add email redirect for confirmation
    options: {
      emailRedirectTo: `${request.headers.get('origin')}/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(
    { message: 'Signup successful, please check your email to verify.' },
    { status: 200 }
  )
}
