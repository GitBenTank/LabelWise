#!/bin/bash

# LabelWise Local Development Setup Script
# Sets up a local PostgreSQL database for development

set -e

echo "🚀 LabelWise Local Development Setup"
echo "===================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
  echo "❌ PostgreSQL not found. Please install it first:"
  echo "   macOS: brew install postgresql@14"
  echo "   Linux: sudo apt-get install postgresql"
  echo ""
  exit 1
fi

echo "✓ PostgreSQL found"

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
  echo "⚠️  PostgreSQL is not running. Starting it..."
  # Try to start (macOS with Homebrew)
  if command -v brew &> /dev/null; then
    brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || true
    sleep 2
  fi
  
  if ! pg_isready &> /dev/null; then
    echo "❌ Could not start PostgreSQL. Please start it manually:"
    echo "   macOS: brew services start postgresql@14"
    echo "   Linux: sudo systemctl start postgresql"
    exit 1
  fi
fi

echo "✓ PostgreSQL is running"

# Create database
DB_NAME="labelwise_dev"
if psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
  echo "✓ Database '$DB_NAME' already exists"
else
  echo "Creating database '$DB_NAME'..."
  createdb "$DB_NAME"
  echo "✓ Database created"
fi

# Set DATABASE_URL in .env.local
ENV_FILE="apps/web/.env.local"
if [ ! -f "$ENV_FILE" ]; then
  echo "Creating $ENV_FILE from example..."
  cp apps/web/.env.example "$ENV_FILE" 2>/dev/null || true
fi

# Update DATABASE_URL
LOCAL_DB_URL="postgresql://$(whoami)@localhost:5432/$DB_NAME"

if grep -q "DATABASE_URL" "$ENV_FILE"; then
  # Update existing
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=$LOCAL_DB_URL|" "$ENV_FILE"
  else
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=$LOCAL_DB_URL|" "$ENV_FILE"
  fi
  echo "✓ Updated DATABASE_URL in $ENV_FILE"
else
  # Add new
  echo "" >> "$ENV_FILE"
  echo "# Local development database" >> "$ENV_FILE"
  echo "DATABASE_URL=$LOCAL_DB_URL" >> "$ENV_FILE"
  echo "✓ Added DATABASE_URL to $ENV_FILE"
fi

echo ""
echo "===================================="
echo "✅ Local setup complete!"
echo ""
echo "Next steps:"
echo "1. Run migrations: npm run db:generate && npm run db:migrate"
echo "2. Start dev server: npm run dev"
echo ""
echo "Database: $LOCAL_DB_URL"
echo "Note: Supabase is optional for local development"

