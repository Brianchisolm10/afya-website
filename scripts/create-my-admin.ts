import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'afya@theafya.org';
  const password = 'Mememe23!';
  const name = 'AFYA Admin';

  console.log('Creating admin account...');
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
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
    console.log('✅ Admin account updated successfully!');
    console.log('User ID:', user.id);
  } else {
    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
    console.log('✅ Admin account created successfully!');
    console.log('User ID:', user.id);
  }

  console.log('\nYou can now log in with:');
  console.log('Email:', email);
  console.log('Password: Mememe23!');
  console.log('\nGo to: http://localhost:3000/login');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
