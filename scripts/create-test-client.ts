import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'testclient@afya.org';
  const password = 'TestClient123!';
  const name = 'Test Client';

  console.log('Creating test client account...');
  console.log('Email:', email);

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    // Update existing user
    const user = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        name,
        role: 'CLIENT',
        status: 'ACTIVE'
      }
    });
    console.log('✅ Test client account updated!');
    console.log('User ID:', user.id);
  } else {
    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'CLIENT',
        status: 'ACTIVE'
      }
    });
    console.log('✅ Test client account created!');
    console.log('User ID:', user.id);
  }

  console.log('\nYou can now log in as a client with:');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('\nGo to: http://localhost:3000/login');
  console.log('\nTo switch back to admin, log out and use: afya@theafya.org / Mememe23!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
