import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'afya@theafya.org';
  const testPassword = 'Mememe23!';

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.password) {
    console.log('❌ User not found or no password set');
    return;
  }

  console.log('Testing password verification...');
  console.log('Email:', email);
  console.log('Test password:', testPassword);
  
  const isValid = await bcrypt.compare(testPassword, user.password);
  
  if (isValid) {
    console.log('✅ Password is CORRECT!');
  } else {
    console.log('❌ Password is INCORRECT');
    console.log('\nTrying to create a new hash...');
    const newHash = await bcrypt.hash(testPassword, 12);
    console.log('New hash created, updating user...');
    
    await prisma.user.update({
      where: { email },
      data: { password: newHash }
    });
    
    console.log('✅ Password updated! Try logging in again.');
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
