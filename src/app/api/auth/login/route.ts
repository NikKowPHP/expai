// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'

import { createServerSupabaseClient } from '@/lib/supabase/utils'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  return NextResponse.json({ message: 'Login successful' }, { status: 200 })
}
