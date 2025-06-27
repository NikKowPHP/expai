// src/lib/supabase/utils.ts
import { type CookieOptions,createBrowserClient,createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import logger from '../logger'

// This function is for use in Server Components, Server Actions, and Route Handlers.
// It is NOT for use in 'use client' components.
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {

          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            logger.error(`error in supabase auth : ${error}`)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            logger.error(`error in supabase auth : ${error}`)
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  )
}

// This function is for use in 'use client' components.
// It is NOT for use in Server Components, Server Actions, or Route Handlers.
export const createBrowserSupabaseClient = () => {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
