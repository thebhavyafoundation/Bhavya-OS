#!/bin/bash
# Bhavya Foundation - Vercel Deployment Script
# Usage: ./scripts/deploy-vercel.sh <app-name>
# Example: ./scripts/deploy-vercel.sh website

set -e

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
  echo "Usage: $0 <app-name>"
  echo ""
  echo "Available apps:"
  echo "  website, dashboard, forest, heritage, research,"
  echo "  volunteer, knowledge, library, admin, docs,"
  echo "  transparency, design-system"
  exit 1
fi

# Map app names to package names
case $APP_NAME in
  "admin") PACKAGE_NAME="admin-app" ;;
  "docs") PACKAGE_NAME="docs-app" ;;
  *) PACKAGE_NAME="$APP_NAME" ;;
esac

echo "=========================================="
echo "Bhavya Foundation - Vercel Deployment"
echo "=========================================="
echo ""
echo "App: $APP_NAME"
echo "Package: @bhavya/$PACKAGE_NAME"
echo ""

# Verify app exists
if [ ! -d "apps/$APP_NAME" ]; then
  echo "Error: App directory 'apps/$APP_NAME' does not exist"
  exit 1
fi

# Run validation
echo "Running validation..."
pnpm validate
echo ""

# Build the app
echo "Building @bhavya/$PACKAGE_NAME..."
pnpm --filter "@bhavya/$PACKAGE_NAME" build
echo ""

# Deploy to Vercel
echo "Deploying to Vercel..."
cd "apps/$APP_NAME"
vercel --prod
cd ../..

echo ""
echo "=========================================="
echo "Deployment complete!"
echo "=========================================="
