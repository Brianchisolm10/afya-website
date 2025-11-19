# Admin Account Setup Guide

This guide explains how to create and manage admin accounts in the AFYA system.

## Creating the Initial Admin Account

The AFYA system requires at least one admin account to manage users and access the admin panel. Use the provided seed script to create your first admin account.

### Prerequisites

- Database is set up and migrations are applied
- Node.js and npm are installed
- `tsx` package is available (installed as part of project dependencies)

### Method 1: Interactive Setup (Recommended)

Run the seed script without arguments for an interactive setup:

```bash
npm run seed:admin
```

Or using npx directly:

```bash
npx tsx scripts/seed-admin.ts
```

The script will prompt you for:

1. **Admin email address**
   - Must be a valid email format
   - Will be converted to lowercase
   - Must be unique (not already in use)

2. **Password**
   - Input is hidden for security
   - Must meet password requirements (see below)

3. **Password confirmation**
   - Must match the password entered above

### Method 2: Command-Line Arguments

For automated setups or scripts, you can provide credentials as arguments:

```bash
npm run seed:admin <email> <password> [name]
```

**Example:**

```bash
npm run seed:admin admin@afya.com SecurePass123 "Admin User"
```

**Parameters:**
- `email` (required): Admin email address
- `password` (required): Admin password
- `name` (optional): Display name (defaults to "Admin User")

**Security Note:** When using command-line arguments, the password may be visible in shell history. Use this method only in secure environments or CI/CD pipelines.

## Password Requirements

All passwords must meet the following security requirements:

- ✅ Minimum 8 characters long
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)

**Examples of valid passwords:**
- `SecurePass123`
- `Admin2024!`
- `MyP@ssw0rd`

**Examples of invalid passwords:**
- `password` (no uppercase, no number)
- `PASSWORD123` (no lowercase)
- `Pass123` (too short)

## What the Script Does

When you run the seed script, it will:

1. **Validate input**
   - Check email format
   - Verify password meets requirements
   - Confirm passwords match (interactive mode)

2. **Check for existing user**
   - If a user with the email already exists, you'll be prompted to update them
   - Updating will change their role to ADMIN and set the new password

3. **Hash the password**
   - Uses bcrypt with cost factor 12 for secure password storage
   - Never stores passwords in plain text

4. **Create/update the user**
   - Creates new user with ADMIN role and ACTIVE status
   - Or updates existing user to ADMIN with new password

5. **Display confirmation**
   - Shows the created user details (email, name, role, status, ID)
   - Provides next steps for logging in

## Example Output

```
🌱 AFYA Admin Account Seed Script

This script will create the initial admin account with password authentication.

Enter admin email: admin@afya.com
Enter admin password: ********
Confirm password: ********

🔐 Hashing password...
🔨 Creating admin user...

✅ Admin user created successfully!

👤 Admin User Details:
   Email: admin@afya.com
   Name: Admin User
   Role: ADMIN
   Status: ACTIVE
   ID: clx1234567890abcdef

📧 Next Steps:
   1. Start your development server: npm run dev
   2. Go to: http://localhost:3000/login
   3. Enter your email: admin@afya.com
   4. Enter your password
   5. Access the admin panel at: http://localhost:3000/admin/users
```

## Updating an Existing User to Admin

If you need to promote an existing user to admin:

1. Run the seed script with their email:

```bash
npm run seed:admin existing-user@afya.com NewPassword123
```

2. When prompted that the user exists, confirm the update:

```
⚠️  User with email existing-user@afya.com already exists
   Current role: CLIENT
   Current status: ACTIVE

Do you want to update this user to ADMIN with the new password? (yes/no): yes
```

3. The user will be updated to ADMIN role with the new password

## Production Deployment

### Option 1: Using Vercel CLI

```bash
# Pull production environment variables
vercel env pull .env.production

# Run the seed script (it will use the production DATABASE_URL)
npm run seed:admin
```

### Option 2: Direct Database Connection

```bash
# Set the production database URL and run the script
DATABASE_URL="postgresql://user:pass@host:5432/db" npm run seed:admin admin@afya.com SecurePass123
```

### Option 3: Via Vercel Remote Execution

```bash
# Execute the script on Vercel's infrastructure
vercel exec -- npm run seed:admin admin@afya.com SecurePass123
```

## Security Best Practices

1. **Use Strong Passwords**
   - Exceed minimum requirements
   - Use a mix of characters, numbers, and symbols
   - Consider using a password manager

2. **Protect Admin Credentials**
   - Never commit passwords to version control
   - Don't share admin credentials via insecure channels
   - Use unique passwords for each environment

3. **Limit Admin Accounts**
   - Create admin accounts only for users who need full system access
   - Use COACH role for team members who don't need user management
   - Regularly audit admin account list

4. **Rotate Passwords**
   - Change admin passwords periodically
   - Change passwords immediately if compromised
   - Use the profile settings page to change passwords

5. **Monitor Admin Activity**
   - Review audit logs regularly
   - Check for suspicious login attempts
   - Monitor role and status changes

## Troubleshooting

### Error: "Invalid email format"

**Cause:** The email address doesn't match the expected format.

**Solution:** Ensure the email follows the pattern: `user@domain.com`

### Error: "Password does not meet requirements"

**Cause:** The password doesn't meet one or more security requirements.

**Solution:** Check the error messages and ensure your password has:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number

### Error: "Passwords do not match"

**Cause:** The password and confirmation don't match (interactive mode).

**Solution:** Re-run the script and carefully enter the same password twice.

### Error: "User with email already exists"

**Cause:** A user with that email is already in the database.

**Solution:** 
- Choose a different email, or
- Confirm "yes" when prompted to update the existing user to admin

### Error: Database connection failed

**Cause:** The script can't connect to the database.

**Solution:**
- Verify `DATABASE_URL` in your `.env` file is correct
- Ensure the database server is running
- Check network connectivity to the database

### Error: "tsx: command not found"

**Cause:** TypeScript execution environment is not available.

**Solution:**
```bash
# Install tsx globally
npm install -g tsx

# Or use npx to run it
npx tsx scripts/seed-admin.ts
```

## Managing Admin Accounts

Once you have at least one admin account, you can manage other users through the admin panel:

1. **Login as admin**
   - Go to `/login`
   - Enter admin credentials

2. **Access user management**
   - Navigate to `/admin/users`
   - View all users in the system

3. **Create additional admins**
   - Click "Create User" button
   - Enter email, name, and select ADMIN role
   - User receives invitation email to set their password

4. **Change user roles**
   - Click the action menu (⋮) next to any user
   - Select "Change Role"
   - Choose new role (CLIENT, COACH, or ADMIN)

5. **Manage account status**
   - Click the action menu (⋮) next to any user
   - Select "Suspend" or "Reactivate"
   - Suspended users cannot log in

## Additional Resources

- [Account Management System Requirements](.kiro/specs/account-management-system/requirements.md)
- [Account Management System Design](.kiro/specs/account-management-system/design.md)
- [Main README](README.md)
- [Error Handling Guide](ERROR_HANDLING_GUIDE.md)

## Support

If you encounter issues not covered in this guide:

1. Check the troubleshooting section above
2. Review the seed script source code: `scripts/seed-admin.ts`
3. Check database logs for connection issues
4. Verify all environment variables are set correctly
