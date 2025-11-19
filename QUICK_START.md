# 🚀 Quick Start: Access Your Client Data

## Right Now (No Setup Required)

### View All Clients
```bash
./scripts/view-clients.sh
```

### Export to Excel/Sheets
```bash
sqlite3 prisma/dev.db -csv -header "SELECT * FROM Client;" > clients.csv
open clients.csv
```

## When Clients Submit

Clients fill out the form at: `http://localhost:3000/get-started`

Their data automatically saves to the database with ALL 50+ fields including:
- Personal info (name, email, age, height, weight)
- Fitness goals and training history
- Health conditions and injuries
- Nutrition preferences and eating habits
- Training preferences and schedule
- Sport-specific information

## Access Methods

1. **Command Line** (instant): `./scripts/view-clients.sh`
2. **CSV Export** (for Excel): See command above
3. **Direct SQL**: `sqlite3 prisma/dev.db "SELECT * FROM Client;"`
4. **Web Admin Panel**: Coming soon (needs email config)

## Files Created for You

- `scripts/view-clients.sh` - View client data anytime
- `scripts/create-admin.sh` - Already used to create your account
- `scripts/create-session.sh` - Bypass email login (if needed)
- `HOW_TO_ACCESS_CLIENT_DATA.md` - Complete guide

## Your Admin Account

✅ **Email:** afya@thefya.org  
✅ **Role:** ADMIN  
✅ **Status:** Active

## Need Help?

See `HOW_TO_ACCESS_CLIENT_DATA.md` for detailed instructions!
