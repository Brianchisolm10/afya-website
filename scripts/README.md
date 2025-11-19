# Admin Account Setup Scripts

This directory contains scripts to help you create admin accounts for the AFYA system.

## Quick Start

### Option 1: Using the Seed Script (Recommended for Password-Based Auth)

The seed script creates an admin account with password authentication, which is required for the new account management system.

```bash
# Interactive mode (recommended for security - password won't be visible in command history)
npx tsx scripts/seed-admin.ts

# Or provide credentials as arguments
npx tsx scripts/seed-admin.ts admin@example.com SecurePassword123 "Admin User"
```

**Example (Interactive):**
```bash
npx tsx scripts/seed-admin.ts

# You'll be prompted for:
# - Email address
# - Password (hidden input)
# - Password confirmation
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Option 2: Using the TypeScript Script (Magic Link Auth)

This creates an admin account that uses email magic link authentication (legacy method).

```bash
npx tsx scripts/create-admin.ts your-email@example.com "Your Name"
```

**Example:**
```bash
npx tsx scripts/create-admin.ts admin@afya.com "AFYA Admin"
```

### Option 3: Using the Bash Script

```bash
# Make the script executable (if not already)
chmod +x scripts/create-admin.sh

# Create an admin user
./scripts/create-admin.sh your-email@example.com "Your Name"
```

### Option 4: Using SQL Directly

1. Edit `scripts/create-admin.sql` and replace:
   - `your-email@example.com` with your email
   - `Your Name` with your name

2. Run the SQL script:
```bash
sqlite3 prisma/dev.db < scripts/create-admin.sql
```

### Option 5: Manual Database Entry

```bash
# Open the database
sqlite3 prisma/dev.db

# Create admin user (replace email and name)
INSERT INTO User (id, email, name, role, createdAt, updatedAt) 
VALUES (
  lower(hex(randomblob(16))),
  'your-email@example.com',
  'Your Name',
  'ADMIN',
  datetime('now'),
  datetime('now')
);

# Verify it was created
SELECT * FROM User WHERE role = 'ADMIN';

# Exit
.quit
```

## After Creating Your Admin Account

### For Password-Based Authentication (seed-admin.ts)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Go to the login page:**
   ```
   http://localhost:3000/login
   ```

3. **Enter your admin email and password**

4. **Click "Sign In"**

5. **Access the admin panel:**
   ```
   http://localhost:3000/admin/users
   ```

### For Magic Link Authentication (create-admin.ts)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Go to the login page:**
   ```
   http://localhost:3000/login
   ```

3. **Enter your admin email** and click "Send Magic Link"

4. **Check your email** for the magic link (check spam folder if needed)

5. **Click the link** to log in

6. **Access the admin panel:**
   ```
   http://localhost:3000/admin
   ```

## Troubleshooting

### User Already Exists

If you get an error that the user already exists, you can update their role:

```bash
sqlite3 prisma/dev.db "UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@example.com';"
```

### View All Users

```bash
sqlite3 prisma/dev.db "SELECT email, name, role FROM User;"
```

### Delete a User

```bash
sqlite3 prisma/dev.db "DELETE FROM User WHERE email = 'your-email@example.com';"
```

### Email Not Sending

Make sure your email environment variables are configured in `.env`:

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@afya.com
```

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an "App Password" 
3. Use that app password in `EMAIL_SERVER_PASSWORD`

## User Roles

- **ADMIN**: Full access to admin panel, can view all clients
- **COACH**: Access to admin panel, can view all clients
- **CLIENT**: Can only view their own dashboard

## Which Script Should I Use?

- **seed-admin.ts**: Use this for the new account management system with password authentication. This is the recommended approach for production-ready admin accounts.
- **create-admin.ts**: Use this if you only need magic link authentication (legacy method).
- **Bash/SQL scripts**: Use these for quick setup or if you don't have Node.js/TypeScript tools available.

## Security Notes

- Admin accounts should use strong, unique email addresses
- Use strong passwords that meet the requirements (8+ chars, uppercase, lowercase, number)
- When using `seed-admin.ts`, run it in interactive mode to avoid passwords in command history
- Keep the database file (`prisma/dev.db`) secure and backed up
- In production, use environment-specific admin creation methods
- Never commit the database file to version control
- Never commit passwords or credentials to version control
