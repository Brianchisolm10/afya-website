/**
 * Seed script to create the initial admin user account with password
 * 
 * This script creates the first admin account for the AFYA system with:
 * - Email and password authentication
 * - ADMIN role
 * - ACTIVE status
 * 
 * Usage: 
 *   npx tsx scripts/seed-admin.ts
 * 
 * The script will prompt for email and password, or you can provide them as arguments:
 *   npx tsx scripts/seed-admin.ts admin@example.com SecurePassword123
 * 
 * For security, it's recommended to run without arguments and enter the password interactively.
 */

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/password';
import * as readline from 'readline';

const prisma = new PrismaClient();

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements: minimum 8 characters, one uppercase, one lowercase, one number
 */
function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Prompt user for input
 */
function prompt(question: string, hideInput: boolean = false): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    if (hideInput) {
      // Hide password input
      const stdin = process.stdin;
      (stdin as any).setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');

      process.stdout.write(question);
      let password = '';

      stdin.on('data', (char: string) => {
        char = char.toString('utf8');

        switch (char) {
          case '\n':
          case '\r':
          case '\u0004':
            // Enter pressed
            (stdin as any).setRawMode(false);
            stdin.pause();
            process.stdout.write('\n');
            rl.close();
            resolve(password);
            break;
          case '\u0003':
            // Ctrl+C
            process.exit();
            break;
          case '\u007f':
            // Backspace
            password = password.slice(0, -1);
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(question + '*'.repeat(password.length));
            break;
          default:
            password += char;
            process.stdout.write('*');
            break;
        }
      });
    } else {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

async function seedAdmin() {
  console.log('\n🌱 AFYA Admin Account Seed Script\n');
  console.log('This script will create the initial admin account with password authentication.\n');

  let email = process.argv[2];
  let password = process.argv[3];
  let name = process.argv[4] || 'Admin User';

  // Get email if not provided
  if (!email) {
    email = await prompt('Enter admin email: ');
  }

  // Validate email
  if (!isValidEmail(email)) {
    console.error('\n❌ Error: Invalid email format');
    process.exit(1);
  }

  email = email.toLowerCase().trim();

  // Get password if not provided
  if (!password) {
    password = await prompt('Enter admin password: ', true);
    const confirmPassword = await prompt('Confirm password: ', true);
    
    if (password !== confirmPassword) {
      console.error('\n❌ Error: Passwords do not match');
      process.exit(1);
    }
  }

  // Validate password strength
  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.valid) {
    console.error('\n❌ Error: Password does not meet requirements:');
    passwordValidation.errors.forEach(error => {
      console.error(`   - ${error}`);
    });
    console.error('\nPassword requirements:');
    console.error('   - Minimum 8 characters');
    console.error('   - At least one uppercase letter');
    console.error('   - At least one lowercase letter');
    console.error('   - At least one number');
    process.exit(1);
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`\n⚠️  User with email ${email} already exists`);
      console.log(`   Current role: ${existingUser.role}`);
      console.log(`   Current status: ${existingUser.status}`);
      
      // Ask if they want to update
      const update = await prompt('\nDo you want to update this user to ADMIN with the new password? (yes/no): ');
      
      if (update.toLowerCase() !== 'yes' && update.toLowerCase() !== 'y') {
        console.log('\n❌ Operation cancelled');
        process.exit(0);
      }

      // Hash the password
      console.log('\n🔐 Hashing password...');
      const hashedPassword = await hashPassword(password);

      // Update existing user
      console.log('🔄 Updating user...');
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
          name,
        },
      });

      console.log('\n✅ Admin user updated successfully!');
      console.log(`\n👤 Admin User Details:`);
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Name: ${updatedUser.name}`);
      console.log(`   Role: ${updatedUser.role}`);
      console.log(`   Status: ${updatedUser.status}`);
      console.log(`   ID: ${updatedUser.id}`);
    } else {
      // Hash the password
      console.log('\n🔐 Hashing password...');
      const hashedPassword = await hashPassword(password);

      // Create new admin user
      console.log('🔨 Creating admin user...');
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
        },
      });

      console.log('\n✅ Admin user created successfully!');
      console.log(`\n👤 Admin User Details:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   ID: ${user.id}`);
    }

    console.log(`\n📧 Next Steps:`);
    console.log(`   1. Start your development server: npm run dev`);
    console.log(`   2. Go to: http://localhost:3000/login`);
    console.log(`   3. Enter your email: ${email}`);
    console.log(`   4. Enter your password`);
    console.log(`   5. Access the admin panel at: http://localhost:3000/admin/users`);
    console.log('');

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed script
seedAdmin().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
