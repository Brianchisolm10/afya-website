import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding community stats...');

  // Check if stats already exist
  const existingStats = await prisma.communityStats.findFirst();

  if (existingStats) {
    console.log('Community stats already exist. Updating...');
    await prisma.communityStats.update({
      where: { id: existingStats.id },
      data: {
        totalMinutesMoved: 125000,
        totalClientsServed: 250,
        totalDonationsRaised: 15000,
        totalGearDonated: 450,
      },
    });
  } else {
    console.log('Creating initial community stats...');
    await prisma.communityStats.create({
      data: {
        totalMinutesMoved: 125000,
        totalClientsServed: 250,
        totalDonationsRaised: 15000,
        totalGearDonated: 450,
      },
    });
  }

  console.log('✅ Community stats seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding community stats:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
