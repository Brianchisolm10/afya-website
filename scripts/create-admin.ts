/**
 * Script to create an admin user account
 * 
 * Usage: npx tsx scripts/create-admin.ts your-email@example.com "Your Name"
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2];
  const name = process.argv[3] || 'Admin User';

  if (!email) {
    console.error('❌ Error: Email is required');
    console.log('\nUsage: npx tsx scripts/create-admin.ts your-email@example.com "Your Name"');
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Error: Invalid email format');
    process.exit(1);
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      console.log(`\n⚠️  User with email ${email} already exists`);
      console.log(`   Current role: ${existingUser.role}`);
      
      if (existingUser.role !== 'ADMIN') {
        console.log('\n🔄 Updating user role to ADMIN...');
        const updatedUser = await prisma.user.update({
          where: { email: email.toLowerCase() },
          data: { role: 'ADMIN' },
        });
        console.log('✅ User role updated to ADMIN successfully!');
        console.log(`\n👤 Admin User Details:`);
        console.log(`   Email: ${updatedUser.email}`);
        console.log(`   Name: ${updatedUser.name}`);
        console.log(`   Role: ${updatedUser.role}`);
      } else {
        console.log('✅ User is already an ADMIN');
      }
    } else {
      // Create new admin user
      console.log(`\n🔨 Creating admin user...`);
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name: name,
          role: 'ADMIN',
        },
      });

      console.log('✅ Admin user created successfully!');
      console.log(`\n👤 Admin User Details:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user.id}`);
    }

    console.log(`\n📧 Next Steps:`);
    console.log(`   1. Start your development server: npm run dev`);
    console.log(`   2. Go to: http://localhost:3000/login`);
    console.log(`   3. Enter your email: ${email}`);
    console.log(`   4. Check your email for the magic link`);
    console.log(`   5. Click the link to log in`);
    console.log(`   6. Access the admin panel at: http://localhost:3000/admin`);
    console.log('');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
