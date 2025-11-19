import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'testclient@afya.org';

  console.log('Creating client record for:', email);

  // First find the user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error('User not found! Make sure you created the test user first.');
    return;
  }

  const client = await prisma.client.create({
    data: {
      userId: user.id,
      fullName: 'Test Client',
      email: email,
      goal: 'Get healthier and feel great!',
      activityLevel: 'Moderate',
      mainFitnessGoals: 'General wellness and fitness',
    },
  });

  console.log('✅ Client record created!');
  console.log('Client ID:', client.id);
  console.log('\nNow log in with:');
  console.log('Email: testclient@afya.org');
  console.log('Password: TestClient123!');
  console.log('\nThe dashboard should now work!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
