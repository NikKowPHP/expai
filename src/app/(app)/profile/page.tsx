import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getAllAchievements, getUserAchievements } from "@/lib/services/gamificationService";
import Badge from "@/components/gamification/Badge";

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const allAchievements = await getAllAchievements();
  const userAchievements = await getUserAchievements(user.id);

  const earnedAchievementIds = new Set(
    userAchievements.map((ua) => ua.achievement_id)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Achievements</h1>
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
