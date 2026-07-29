#!/bin/bash
# Bhavya Foundation - Deploy All Apps to Vercel
# Usage: ./scripts/deploy-all-vercel.sh

set -e

echo "=========================================="
echo "Bhavya Foundation - Deploy All Apps"
echo "=========================================="
echo ""

# List of all apps
APPS=(
  "website"
  "dashboard"
  "forest"
  "heritage"
  "research"
  "volunteer"
  "knowledge"
  "library"
  "admin"
  "docs"
  "transparency"
  "design-system"
)

# Run validation first
echo "Running validation..."
pnpm validate
echo ""

# Deploy each app
for APP in "${APPS[@]}"; do
  echo "=========================================="
  echo "Deploying: $APP"
  echo "=========================================="
  
  # Map app names to package names
  case $APP in
    "admin") PACKAGE="admin-app" ;;
    "docs") PACKAGE="docs-app" ;;
    *) PACKAGE="$APP" ;;
  esac
  
  # Build the app
  echo "Building @bhavya/$PACKAGE..."
  pnpm --filter "@bhavya/$PACKAGE" build
  
  # Deploy to Vercel
  echo "Deploying to Vercel..."
  cd "apps/$APP"
  vercel --prod --yes
  cd ../..
  
  echo ""
  echo "✓ $APP deployed successfully"
  echo ""
done

echo "=========================================="
echo "All apps deployed successfully!"
echo "=========================================="
echo ""
echo "Deployment URLs:"
echo "  - bhavyafoundation.org (website)"
echo "  - dashboard.bhavyafoundation.org"
echo "  - forest.bhavyafoundation.org"
echo "  - heritage.bhavyafoundation.org"
echo "  - research.bhavyafoundation.org"
echo "  - volunteer.bhavyafoundation.org"
echo "  - knowledge.bhavyafoundation.org"
echo "  - library.bhavyafoundation.org"
echo "  - admin.bhavyafoundation.org"
echo "  - docs.bhavyafoundation.org"
echo "  - transparency.bhavyafoundation.org"
echo "  - design-system.bhavyafoundation.org"
