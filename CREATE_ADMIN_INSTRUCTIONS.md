# 🔐 Create Your Admin Account

I've created scripts to help you set up your admin account. Here's how to do it:

## ⚡ Quick Method (Recommended)

Run this command in your terminal, replacing with your actual email and name:

```bash
./scripts/create-admin.sh your-email@example.com "Your Name"
```

**Example:**
```bash
./scripts/create-admin.sh brian@afya.com "Brian"
```

## 📋 What This Does

The script will:
1. ✅ Create an admin user in the database
2. ✅ Set the role to ADMIN
3. ✅ Show you the next steps to log in

## 🚀 After Running the Script

You'll see output like this:

```
✅ Admin user created successfully!

👤 Admin User Details:
   Email: brian@afya.com
   Name: Brian
   Role: ADMIN

📧 Next Steps:
   1. Start your development server: npm run dev
   2. Go to: http://localhost:3000/login
   3. Enter your email: brian@afya.com
   4. Check your email for the magic link
   5. Click the link to log in
   6. Access the admin panel at: http://localhost:3000/admin
```

## 🔍 View Client Data

Once logged in as admin, you can:

1. **View all clients** at `/admin`
   - See client names, emails, signup dates
   - Click any client to see their details

2. **View client packets**
   - See packet status (PENDING, READY, FAILED)
   - Access generated documents
   - View error messages if generation failed

3. **Access full intake data** (coming soon)
   - All 50+ fields from the intake form
   - Health information
   - Nutrition preferences
   - Training goals

## 🛠️ Alternative Methods

If the bash script doesn't work, see `scripts/README.md` for alternative methods including:
- Direct SQL commands
- Manual database entry
- TypeScript script (requires tsx)

## ❓ Need Help?

If you run into issues:

1. **Check if database exists:**
   ```bash
   ls -la prisma/dev.db
   ```

2. **View existing users:**
   ```bash
   sqlite3 prisma/dev.db "SELECT email, name, role FROM User;"
   ```

3. **Make script executable:**
   ```bash
   chmod +x scripts/create-admin.sh
   ```

---

**Ready to create your admin account?** Just run the command above with your email!
