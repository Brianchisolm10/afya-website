import { prisma } from '../lib/db';

async function testClientAPI() {
  try {
    console.log('Checking for test client...');
    
    const clients = await prisma.client.findMany({
      include: {
        packets: true,
      },
    });

    console.log(`Found ${clients.length} clients:`);
    clients.forEach(client => {
      console.log(`\nClient ID: ${client.id}`);
      console.log(`Name: ${client.fullName}`);
      console.log(`Email: ${client.email}`);
      console.log(`Packets: ${client.packets.length}`);
    });

    if (clients.length === 0) {
      console.log('\nNo clients found! Creating test client...');
      
      // First create a user
      const testUser = await prisma.user.create({
        data: {
          email: 'testclient@example.com',
          name: 'Test Client',
          role: 'CLIENT',
        },
      });

      const testClient = await prisma.client.create({
        data: {
          userId: testUser.id,
          fullName: 'Test Client',
          email: 'testclient@example.com',
          goal: 'Weight Loss',
          activityLevel: 'MODERATE',
          mainFitnessGoals: 'Lose weight, Build muscle',
        },
      });

      console.log(`Created test client with ID: ${testClient.id}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testClientAPI();
