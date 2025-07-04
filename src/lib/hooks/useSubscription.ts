'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/utils'

type SubscriptionStatus = 'free' | 'premium'

interface SubscriptionContextType {
  status: SubscriptionStatus
  isLoading: boolean
  error: string | null
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  status: 'free',
  isLoading: true,
  error: null
})

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SubscriptionStatus>('free')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('subscription_status')
          .eq('user_id', user.id)
          .single()

        if (profile?.subscription_status) {
          setStatus(profile.subscription_status as SubscriptionStatus)
        }
      } catch (err) {
        setError('Failed to fetch subscription status')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptionStatus()
  }, [supabase])

  return (
    <SubscriptionContext.Provider value={{ status, isLoading, error }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  return useContext(SubscriptionContext)
}
