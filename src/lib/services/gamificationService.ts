// src/lib/services/gamificationService.ts
import prisma from "@/lib/prisma";

// A map of achievement names to their static UUIDs from the seed file.
// This prevents typos and makes the code more readable.
const ACHIEVEMENT_IDS = {
  FIRST_UPLOAD: 'c2a8f8b0-5b3a-4f8e-9b9a-7e1d3c1a2b3c',
  BUDGET_CREATOR: 'd4b7e9f1-6c2a-4b8d-8e5c-9a1b3d5c6f7d',
  CATEGORY_CUSTOMIZER: 'e6c9a8d2-7b1a-4c9e-9f8a-2c4d6b8a1c3b',
};

/**
 * Checks if a user already has an achievement and, if not, grants it.
 * This function prevents duplicate awards.
 * @param userId The ID of the user to check.
 * @param achievementId The static UUID of the achievement to award.
 */
async function checkAndAwardAchievement(userId: string, achievementId: string) {
  // Check if the user already has this achievement
  const existingAchievement = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId,
      },
    },
  });

  // If they don't have it, create it.
  if (!existingAchievement) {
    await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
      },
    });
    console.log(`Awarded achievement ${achievementId} to user ${userId}`);
  }
}

/**
 * The main orchestrator function for the gamification engine.
 * It runs a series of checks to see if the user qualifies for any achievements.
 * This should be called after key user actions (e.g., uploading a file, creating a budget).
 * @param userId The ID of the user whose achievements to check.
 */
export async function runAchievementChecks(userId: string) {
  try {
    // --- Check for "First Upload" ---
    const transactionCount = await prisma.transaction.count({ where: { userId } });
    if (transactionCount > 0) {
      await checkAndAwardAchievement(userId, ACHIEVEMENT_IDS.FIRST_UPLOAD);
    }

    // --- Check for "Budget Creator" ---
    const budgetCount = await prisma.budget.count({ where: { userId } });
    if (budgetCount > 0) {
      await checkAndAwardAchievement(userId, ACHIEVEMENT_IDS.BUDGET_CREATOR);
    }

    // --- Check for "Category Customizer" ---
    const customCategoryCount = await prisma.category.count({
        where: { userId, isUserCreated: true }
    });
    if (customCategoryCount > 0) {
        await checkAndAwardAchievement(userId, ACHIEVEMENT_IDS.CATEGORY_CUSTOMIZER);
    }

    // Add more checks here in the future...

  } catch (error) {
    // We don't want gamification errors to break the main application flow.
    // Log the error but don't re-throw it.
    console.error(`Error running achievement checks for user ${userId}:`, error);
  }
}
