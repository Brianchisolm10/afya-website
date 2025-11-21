#!/bin/bash

# Post-Deployment Script
# Runs after deployment to set up the production environment

set -e  # Exit on error

echo "🚀 Starting post-deployment setup..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in production
if [ "$NODE_ENV" != "production" ]; then
    print_warning "Not running in production environment (NODE_ENV=$NODE_ENV)"
fi

# 1. Generate Prisma Client
echo "📦 Generating Prisma Client..."
npm run db:generate
print_success "Prisma Client generated"

# 2. Run database migrations
echo "🗄️  Running database migrations..."
npm run db:migrate
print_success "Database migrations completed"

# 3. Seed question blocks
echo "📝 Seeding question blocks..."
if npm run seed:questions; then
    print_success "Question blocks seeded"
else
    print_warning "Question blocks seeding failed or already seeded"
fi

# 4. Seed intake paths
echo "🛤️  Seeding intake paths..."
if npm run seed:paths; then
    print_success "Intake paths seeded"
else
    print_warning "Intake paths seeding failed or already seeded"
fi

# 5. Seed packet templates
echo "📄 Seeding packet templates..."
if npm run seed:templates; then
    print_success "Packet templates seeded"
else
    print_warning "Packet templates seeding failed or already seeded"
fi

# 6. Create packets directory
echo "📁 Creating packets directory..."
mkdir -p public/packets
chmod 755 public/packets
print_success "Packets directory created"

# 7. Verify deployment
echo "🔍 Verifying deployment..."
if npm run verify:deployment; then
    print_success "Deployment verification passed"
else
    print_error "Deployment verification failed"
    exit 1
fi

echo ""
print_success "Post-deployment setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Create an admin user: npm run seed:admin"
echo "   2. Test the application: curl https://yourdomain.com/api/health"
echo "   3. Monitor logs for any issues"
echo "   4. Set up monitoring alerts"
echo ""
