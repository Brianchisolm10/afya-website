#!/bin/bash

# Production Database Migration Script
# Safely runs Prisma migrations in production with backup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║        AFYA Production Database Migration Script          ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ ERROR: DATABASE_URL environment variable is not set${NC}"
  exit 1
fi

# Check if we're in production
if [ "$NODE_ENV" != "production" ]; then
  echo -e "${YELLOW}⚠️  WARNING: NODE_ENV is not set to 'production'${NC}"
  echo "Current NODE_ENV: ${NODE_ENV:-not set}"
  echo ""
  read -p "Continue anyway? (yes/no): " CONTINUE
  if [ "$CONTINUE" != "yes" ]; then
    echo "Aborted."
    exit 0
  fi
fi

echo -e "${YELLOW}⚠️  WARNING: This will run migrations on the production database!${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo -e "${GREEN}Step 1: Creating database backup...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/backup-database.sh

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Backup failed! Aborting migration.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}Step 2: Checking migration status...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx prisma migrate status

echo ""
echo -e "${GREEN}Step 3: Running migrations...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Migrations completed successfully!${NC}"
  
  echo ""
  echo -e "${GREEN}Step 4: Verifying schema...${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  npx tsx scripts/verify-schema.ts
  
  echo ""
  echo -e "${GREEN}🎉 Production migration complete!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Verify application is working correctly"
  echo "  2. Monitor error logs for any issues"
  echo "  3. Test critical user flows"
  
else
  echo ""
  echo -e "${RED}❌ Migration failed!${NC}"
  echo ""
  echo "To restore from backup:"
  echo "  1. Find the latest backup in ./backups/"
  echo "  2. Run: gunzip backups/afya_backup_TIMESTAMP.sql.gz"
  echo "  3. Run: psql \$DATABASE_URL -f backups/afya_backup_TIMESTAMP.sql"
  exit 1
fi
