import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const clients = await prisma.client.findMany({
    include: {
      packets: true,
    },
  });

  console.log('Total clients:', clients.length);
  clients.forEach(client => {
    console.log('\nClient:');
    console.log('  Email:', client.email);
    console.log('  Name:', client.fullName);
    console.log('  Packets:', client.packets.length);
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
