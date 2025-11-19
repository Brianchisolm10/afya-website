#!/bin/bash

# Script to create an admin user account
# Usage: ./scripts/create-admin.sh your-email@example.com "Your Name"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if email is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Email is required${NC}"
    echo ""
    echo "Usage: ./scripts/create-admin.sh your-email@example.com \"Your Name\""
    echo ""
    echo "Example:"
    echo "  ./scripts/create-admin.sh admin@afya.com \"AFYA Admin\""
    exit 1
fi

EMAIL="$1"
NAME="${2:-Admin User}"
DB_PATH="prisma/dev.db"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}❌ Error: Database not found at $DB_PATH${NC}"
    echo "Please run: npx prisma migrate dev"
    exit 1
fi

echo ""
echo -e "${BLUE}🔨 Creating admin user...${NC}"
echo ""

# Generate a random ID
ID=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-z0-9' | fold -w 25 | head -n 1)

# Create the admin user
sqlite3 "$DB_PATH" <<EOF
INSERT INTO User (id, email, name, role, createdAt, updatedAt, emailVerified) 
VALUES (
  '$ID',
  '$EMAIL',
  '$NAME',
  'ADMIN',
  datetime('now'),
  datetime('now'),
  NULL
);
EOF

# Check if the insert was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Admin user created successfully!${NC}"
    echo ""
    echo -e "${BLUE}👤 Admin User Details:${NC}"
    
    # Display the created user
    sqlite3 "$DB_PATH" <<EOF
.mode column
.headers on
SELECT email, name, role, createdAt FROM User WHERE email = '$EMAIL';
EOF
    
    echo ""
    echo -e "${YELLOW}📧 Next Steps:${NC}"
    echo "   1. Start your development server: ${GREEN}npm run dev${NC}"
    echo "   2. Go to: ${BLUE}http://localhost:3000/login${NC}"
    echo "   3. Enter your email: ${GREEN}$EMAIL${NC}"
    echo "   4. Check your email for the magic link"
    echo "   5. Click the link to log in"
    echo "   6. Access the admin panel at: ${BLUE}http://localhost:3000/admin${NC}"
    echo ""
else
    echo -e "${RED}❌ Error creating admin user${NC}"
    echo ""
    echo "The user might already exist. Check existing users:"
    echo "  sqlite3 $DB_PATH \"SELECT * FROM User;\""
    exit 1
fi
