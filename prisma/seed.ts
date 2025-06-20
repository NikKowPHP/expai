// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define the master list of all possible achievements in the application
const achievements = [
  {
    id: 'c2a8f8b0-5b3a-4f8e-9b9a-7e1d3c1a2b3c', // Using static UUIDs for consistency
    name: 'First Upload',
    description: 'You uploaded your first financial statement and started your journey!',
    iconName: 'upload', // A hint for the frontend icon
  },
  {
    id: 'd4b7e9f1-6c2a-4b8d-8e5c-9a1b3d5c6f7d',
    name: 'Budget Creator',
    description: 'You set up your first budget, taking control of your spending.',
    iconName: 'budget',
  },
  {
    id: 'e6c9a8d2-7b1a-4c9e-9f8a-2c4d6b8a1c3b',
    name: 'Category Customizer',
    description: 'You renamed or recategorized a transaction, personalizing your finances.',
    iconName: 'edit',
  },
  {
    id: 'f8d1b7c3-8a9d-4b6e-8a5b-4e7f9a2c3d5e',
    name: 'Savings Streak: 1 Month',
    description: 'You successfully met a savings goal for one month straight.',
    iconName: 'streak',
  },
  {
    id: 'a1b3c5d7-9e8f-4a3b-9b8c-6d7e8f9a1b2c',
    name: 'Debt Dragon-Slayer',
    description: 'You successfully paid off a tracked debt.',
    iconName: 'sword',
  }
]

async function main() {
  console.log(`Start seeding ...`)
  for (const achievement of achievements) {
    // Use `upsert` to create the achievement if it doesn't exist,
    // or update it if it does. This makes the seed script re-runnable.
    const result = await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {}, // We don't need to update anything if it exists
      create: achievement,
    })
    console.log(`Created/updated achievement: ${result.name}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
