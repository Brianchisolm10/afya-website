import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'afya@theafya.org';
  const password = 'Mememe23!';

  console.log('Testing authentication flow...\n');
  
  // Step 1: Find user
  console.log('Step 1: Finding user...');
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }
  console.log('✅ User found:', user.email);

  // Step 2: Check password exists
  console.log('\nStep 2: Checking password...');
  if (!user.password) {
    console.log('❌ No password set');
    return;
  }
  console.log('✅ Password exists');

  // Step 3: Check status
  console.log('\nStep 3: Checking status...');
  console.log('Status:', user.status);
  if (user.status !== 'ACTIVE') {
    console.log('❌ Account not active');
    return;
  }
  console.log('✅ Account is active');

  // Step 4: Verify password
  console.log('\nStep 4: Verifying password...');
  const isValid = await bcrypt.compare(password, user.password);
  console.log('Password valid:', isValid);
  
  if (isValid) {
    console.log('\n✅ ALL CHECKS PASSED - Login should work!');
    console.log('\nUser object that would be returned:');
    console.log({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    });
  } else {
    console.log('\n❌ Password verification failed');
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
