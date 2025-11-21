#!/bin/bash

# Database Backup Script
# Creates a backup of the PostgreSQL database before migrations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🗄️  AFYA Database Backup Script${NC}\n"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ ERROR: DATABASE_URL environment variable is not set${NC}"
  echo "Please set DATABASE_URL before running this script"
  exit 1
fi

# Parse DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Create backup directory if it doesn't exist
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/afya_backup_$TIMESTAMP.sql"

echo -e "${YELLOW}📊 Database Information:${NC}"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

echo -e "${YELLOW}💾 Creating backup...${NC}"
echo "  Backup file: $BACKUP_FILE"
echo ""

# Set password for pg_dump
export PGPASSWORD=$DB_PASSWORD

# Create backup using pg_dump
if pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F p -f $BACKUP_FILE; then
  echo -e "${GREEN}✅ Backup created successfully!${NC}"
  
  # Get file size
  FILE_SIZE=$(du -h $BACKUP_FILE | cut -f1)
  echo "  File size: $FILE_SIZE"
  
  # Compress backup
  echo ""
  echo -e "${YELLOW}🗜️  Compressing backup...${NC}"
  gzip $BACKUP_FILE
  COMPRESSED_FILE="$BACKUP_FILE.gz"
  COMPRESSED_SIZE=$(du -h $COMPRESSED_FILE | cut -f1)
  echo -e "${GREEN}✅ Backup compressed!${NC}"
  echo "  Compressed file: $COMPRESSED_FILE"
  echo "  Compressed size: $COMPRESSED_SIZE"
  
  echo ""
  echo -e "${GREEN}🎉 Backup complete!${NC}"
  echo ""
  echo "To restore this backup, run:"
  echo "  gunzip $COMPRESSED_FILE"
  echo "  psql -h \$DB_HOST -p \$DB_PORT -U \$DB_USER -d \$DB_NAME -f $BACKUP_FILE"
  
else
  echo -e "${RED}❌ Backup failed!${NC}"
  exit 1
fi

# Unset password
unset PGPASSWORD

# List recent backups
echo ""
echo -e "${YELLOW}📁 Recent backups:${NC}"
ls -lh $BACKUP_DIR | tail -n 5

# Cleanup old backups (keep last 10)
echo ""
echo -e "${YELLOW}🧹 Cleaning up old backups (keeping last 10)...${NC}"
cd $BACKUP_DIR
ls -t afya_backup_*.sql.gz | tail -n +11 | xargs -r rm
echo -e "${GREEN}✅ Cleanup complete${NC}"
