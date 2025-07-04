'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import Badge from '@/components/gamification/Badge';
import {
  getAllAchievements,
  getUserAchievements,
} from '@/lib/services/gamificationService';

interface Achievement {
  id: string;
  name: string;
  description: string;
}

interface UserAchievement {
  achievement_id: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(
    []
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null
  );
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);
      setAllAchievements(await getAllAchievements());
      setUserAchievements(await getUserAchievements(user.id));

      // Fetch subscription status
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      setSubscriptionStatus(profile?.subscription_status);
    };

    fetchData();
  }, []);

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error managing subscription:', error);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const earnedAchievementIds = new Set(
    userAchievements.map((ua) => ua.achievement_id)
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Achievements</h1>
        {subscriptionStatus === 'premium' && (
          <button
            onClick={handleManageSubscription}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Manage Subscription
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAchievements.map((achievement) => (
          <Badge
            key={achievement.id}
            name={achievement.name}
            description={achievement.description}
            isUnlocked={earnedAchievementIds.has(achievement.id)}
          />
        ))}
      </div>
    </div>
  );
}
