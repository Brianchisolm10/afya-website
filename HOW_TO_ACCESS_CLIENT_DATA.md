# 📊 How to Access Client Data

You have **3 easy ways** to access client data without needing the magic link email system.

## ✅ Method 1: Simple Command Line Viewer (Easiest)

Just run this anytime you want to see client data:

```bash
./scripts/view-clients.sh
```

This shows:
- Total number of clients
- Client names, emails, goals, and submission dates
- Export options for detailed data

## ✅ Method 2: Export to CSV/Excel

Export all client data to open in Excel or Google Sheets:

```bash
# Export everything
sqlite3 prisma/dev.db -csv -header "SELECT * FROM Client;" > clients.csv

# Then open clients.csv in Excel or Google Sheets
```

This gives you ALL 50+ fields from the intake form in a spreadsheet!

## ✅ Method 3: Direct Database Queries

### View Client Summary
```bash
sqlite3 prisma/dev.db "SELECT fullName, email, mainFitnessGoals, createdAt FROM Client;"
```

### View Specific Client's Full Data
```bash
sqlite3 prisma/dev.db "SELECT * FROM Client WHERE email = 'client@example.com';"
```

### View All Packets
```bash
sqlite3 prisma/dev.db "SELECT c.fullName, p.type, p.status, p.docUrl FROM Client c JOIN Packet p ON c.id = p.clientId;"
```

### Count Clients
```bash
sqlite3 prisma/dev.db "SELECT COUNT(*) as total FROM Client;"
```

## 🌐 Method 4: Access Admin Panel (When Email is Configured)

Once you configure email settings, you can use the web interface:

### Option A: Manual Session (No Email Required)

1. Run this script:
   ```bash
   ./scripts/create-session.sh
   ```

2. Copy the session token it gives you

3. Open browser DevTools (F12) → Application → Cookies

4. Add cookie:
   - Name: `next-auth.session-token`
   - Value: (paste the token)
   - Domain: `localhost`
   - Path: `/`

5. Go to `http://localhost:3000/admin`

### Option B: Configure Email (For Magic Links)

Add to your `.env` file:

```env
# For Gmail
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@afya.com

# For other providers, adjust accordingly
```

Then you can use the normal login at `/login`

## 📋 What Data You'll See

When clients submit the intake form, you'll see:

### Basic Information
- Full name, email, gender
- Date of birth, height, weight

### Activity & Goals
- Activity level, daily movement
- Fitness goals, training experience

### Training Preferences
- Days per week, session duration
- Equipment, location, coaching style

### Health & Medical
- Injuries, medical conditions
- Medications, pain/discomfort

### Nutrition
- Diet type, allergies, eating patterns
- Meal frequency, water intake
- Favorite foods, macro preferences

### Program Delivery
- Delivery preference (PDF, Google Doc, etc.)
- Weekly check-in preference

### Sport-Specific (if applicable)
- Sports played, school grade
- Pre-practice eating, hydration
- Motivation and challenges

## 🔄 Real-Time Monitoring

To watch for new submissions in real-time:

```bash
# Run this in a terminal and leave it open
watch -n 5 './scripts/view-clients.sh'
```

This will refresh every 5 seconds and show new clients as they submit!

## 📤 Sharing Data

### Export for Your Team
```bash
# Create a formatted report
sqlite3 prisma/dev.db <<EOF
.mode markdown
.output client_report.md
SELECT 
    fullName as "Client Name",
    email as "Email",
    mainFitnessGoals as "Goals",
    activityLevel as "Activity Level",
    trainingExperience as "Experience",
    datetime(createdAt, 'localtime') as "Submitted"
FROM Client
ORDER BY createdAt DESC;
.quit
EOF
```

### Export to JSON
```bash
sqlite3 prisma/dev.db <<EOF
.mode json
.output clients.json
SELECT * FROM Client;
.quit
EOF
```

## 🆘 Troubleshooting

### "No such table: Client"
Run database migrations:
```bash
npx prisma migrate dev
```

### "Database is locked"
Stop your dev server and try again:
```bash
# Stop server (Ctrl+C)
# Then run your query
```

### Can't see new submissions
Make sure your dev server is running:
```bash
npm run dev
```

## 📞 Quick Reference

| Task | Command |
|------|---------|
| View all clients | `./scripts/view-clients.sh` |
| Export to CSV | `sqlite3 prisma/dev.db -csv -header "SELECT * FROM Client;" > clients.csv` |
| Count clients | `sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Client;"` |
| View packets | `sqlite3 prisma/dev.db "SELECT * FROM Packet;"` |
| Create session | `./scripts/create-session.sh` |

---

**No clients yet?** They'll appear here after submitting the form at:
`http://localhost:3000/get-started`

Test it yourself by filling out the form!
