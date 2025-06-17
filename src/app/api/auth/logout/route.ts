// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'

import { createServerSupabaseClient } from '@/lib/supabase/utils'

export async function POST() {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Logout successful' }, { status: 200 })
}
