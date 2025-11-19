#!/bin/bash

# Script to create a direct login session for admin
# This bypasses the email magic link requirement

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

EMAIL="afya@thefya.org"
DB_PATH="prisma/dev.db"

echo ""
echo -e "${BLUE}🔐 Creating admin session...${NC}"
echo ""

# Get the user ID
USER_ID=$(sqlite3 "$DB_PATH" "SELECT id FROM User WHERE email = '$EMAIL';")

if [ -z "$USER_ID" ]; then
    echo -e "${RED}❌ Error: Admin user not found${NC}"
    exit 1
fi

# Generate a session token
SESSION_TOKEN=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

# Create session that expires in 30 days
EXPIRES=$(date -u -v+30d '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date -u -d '+30 days' '+%Y-%m-%d %H:%M:%S')

# Insert session
sqlite3 "$DB_PATH" <<EOF
INSERT INTO Session (id, sessionToken, userId, expires) 
VALUES (
  lower(hex(randomblob(16))),
  '$SESSION_TOKEN',
  '$USER_ID',
  '$EXPIRES'
);
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Session created successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Your Session Token:${NC}"
    echo ""
    echo "  $SESSION_TOKEN"
    echo ""
    echo -e "${YELLOW}🍪 To use this session:${NC}"
    echo ""
    echo "1. Open your browser DevTools (F12)"
    echo "2. Go to Application > Cookies"
    echo "3. Add a new cookie:"
    echo "   Name: next-auth.session-token"
    echo "   Value: $SESSION_TOKEN"
    echo "   Domain: localhost"
    echo "   Path: /"
    echo ""
    echo "4. Refresh the page and you'll be logged in!"
    echo ""
    echo -e "${BLUE}Or visit: http://localhost:3000/admin${NC}"
    echo ""
else
    echo -e "${RED}❌ Error creating session${NC}"
    exit 1
fi
