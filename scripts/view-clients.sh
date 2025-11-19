#!/bin/bash

# Script to view all client data in a readable format

DB_PATH="prisma/dev.db"

echo ""
echo "📊 AFYA Client Data"
echo "===================="
echo ""

# Count total clients
TOTAL=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Client;")
echo "Total Clients: $TOTAL"
echo ""

if [ "$TOTAL" -eq 0 ]; then
    echo "No clients have submitted the intake form yet."
    echo ""
    echo "Clients will appear here after they complete the form at:"
    echo "http://localhost:3000/get-started"
    echo ""
    exit 0
fi

# Show client summary
echo "Client Summary:"
echo "---------------"
sqlite3 "$DB_PATH" <<EOF
.mode column
.headers on
.width 25 30 40 20
SELECT 
    fullName as "Name",
    email as "Email",
    mainFitnessGoals as "Goals",
    datetime(createdAt, 'localtime') as "Submitted"
FROM Client
ORDER BY createdAt DESC;
EOF

echo ""
echo ""
echo "📄 Export Options:"
echo "------------------"
echo ""
echo "1. Export to CSV:"
echo "   sqlite3 $DB_PATH -csv -header \"SELECT * FROM Client;\" > clients.csv"
echo ""
echo "2. View specific client (replace email):"
echo "   sqlite3 $DB_PATH \"SELECT * FROM Client WHERE email = 'client@example.com';\""
echo ""
echo "3. View all packets:"
echo "   sqlite3 $DB_PATH \"SELECT c.fullName, p.type, p.status FROM Client c JOIN Packet p ON c.id = p.clientId;\""
echo ""
