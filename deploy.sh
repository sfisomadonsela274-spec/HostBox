#!/bin/bash

# HostBox Portfolio Deployment Script
# This script deploys both frontend (Netlify) and backend (Railway)

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Banner
clear
echo -e "${BLUE}"
cat << "EOF"
╦ ╦┌─┐┌─┐┌┬┐╔╗ ┌─┐─┐ ┬  ╔═╗╔═╗
╠═╣│ │└─┐ │ ╠╩╗│ │┌┴┬┘  ║ ║╚═╗
╩ ╩└─┘└─┘ ┴ ╚═╝└─┘┴ └─  ╚═╝╚═╝
    Deployment Script v1.0
EOF
echo -e "${NC}"

print_header "🚀 Welcome to HostBox Deployment"

echo "This script will deploy your portfolio:"
echo "  • Frontend → Netlify (free)"
echo "  • Backend  → Railway (free)"
echo ""
read -p "Ready to deploy? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# ═══════════════════════════════════════════════════════════════
# STEP 1: Pre-flight checks
# ═══════════════════════════════════════════════════════════════

print_header "📋 Step 1: Pre-flight Checks"

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized"
    print_info "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - HostBox Portfolio"
    print_success "Git initialized"
else
    print_success "Git repository exists"
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_info "You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Deploy: $(date +%Y-%m-%d-%H:%M:%S)"
    print_success "Changes committed"
else
    print_success "No uncommitted changes"
fi

# Check if Node modules are installed
if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    print_info "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

print_success "Dependencies installed"

# Test build
print_info "Testing production build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Build successful (dist/ created)"
else
    print_error "Build failed. Fix errors and try again."
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# STEP 2: Backend Deployment (Railway)
# ═══════════════════════════════════════════════════════════════

print_header "🗄️  Step 2: Deploy Backend to Railway"

echo "Railway is a platform for deploying Node.js apps (free tier available)"
echo ""
echo "Options:"
echo "  1. Deploy backend now via Railway CLI"
echo "  2. Skip backend (I'll deploy manually later)"
echo "  3. Use existing backend URL"
echo ""
read -p "Choose option (1/2/3): " BACKEND_OPTION

BACKEND_URL=""

if [ "$BACKEND_OPTION" = "1" ]; then
    print_info "Deploying backend to Railway..."

    # Check if Railway CLI is available
    if ! command -v railway &> /dev/null; then
        print_info "Installing Railway CLI..."
        npm install -g @railway/cli
    fi

    echo ""
    print_info "Please login to Railway (browser will open)"
    railway login

    print_info "Creating new Railway project..."
    cd backend
    railway init

    print_info "Setting environment variables..."
    echo ""
    read -p "Enter your MongoDB URI: " MONGODB_URI
    read -p "Enter admin password (default: admin123): " ADMIN_PASSWORD
    ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123}

    railway variables set MONGODB_URI="$MONGODB_URI"
    railway variables set ADMIN_PASSWORD="$ADMIN_PASSWORD"
    railway variables set PORT=3001

    print_info "Deploying to Railway..."
    railway up

    print_info "Getting deployment URL..."
    BACKEND_URL=$(railway domain)

    cd ..

    print_success "Backend deployed to: $BACKEND_URL"

elif [ "$BACKEND_OPTION" = "3" ]; then
    read -p "Enter your existing backend URL: " BACKEND_URL
    print_success "Using backend URL: $BACKEND_URL"
else
    print_info "Skipping backend deployment"
    echo ""
    echo "You'll need to deploy the backend manually:"
    echo "  1. Go to https://railway.app or https://render.com"
    echo "  2. Deploy the 'backend' folder"
    echo "  3. Set environment variables:"
    echo "     - MONGODB_URI"
    echo "     - ADMIN_PASSWORD"
    echo "     - PORT=3001"
    echo ""
    read -p "Press Enter when you have the backend URL ready..."
    read -p "Enter your backend URL: " BACKEND_URL
fi

# Format backend URL
if [ -n "$BACKEND_URL" ]; then
    # Remove trailing slash if present
    BACKEND_URL="${BACKEND_URL%/}"
    # Add /api if not present
    if [[ ! "$BACKEND_URL" == */api ]]; then
        BACKEND_URL="${BACKEND_URL}/api"
    fi
    print_success "Backend API URL: $BACKEND_URL"
fi

# ═══════════════════════════════════════════════════════════════
# STEP 3: Frontend Deployment (Netlify)
# ═══════════════════════════════════════════════════════════════

print_header "🌐 Step 3: Deploy Frontend to Netlify"

echo "Netlify hosts your React frontend (free tier with generous limits)"
echo ""

# Check if Netlify CLI is available via npx
print_info "Using Netlify CLI via npx..."

# Check if already linked
if [ -f ".netlify/state.json" ]; then
    print_info "Site already linked to Netlify"
    read -p "Deploy to existing site? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        DEPLOY_EXISTING=true
    else
        print_info "Creating new site..."
        npx netlify-cli unlink
        DEPLOY_EXISTING=false
    fi
else
    DEPLOY_EXISTING=false
fi

# Login to Netlify
print_info "Logging in to Netlify (browser will open)..."
npx netlify-cli login

if [ "$DEPLOY_EXISTING" = false ]; then
    # Create new site
    print_info "Creating new Netlify site..."

    echo ""
    read -p "Enter a site name (e.g., sfiso-portfolio): " SITE_NAME
    SITE_NAME=${SITE_NAME:-hostbox-portfolio}

    npx netlify-cli init --manual
fi

# Set environment variable for backend URL
if [ -n "$BACKEND_URL" ]; then
    print_info "Setting VITE_API_URL environment variable..."
    npx netlify-cli env:set VITE_API_URL "$BACKEND_URL"
    print_success "Environment variable set"
fi

# Build and deploy
print_info "Building and deploying to Netlify..."
npx netlify-cli deploy --prod --dir=dist --message="Deploy via CLI $(date +%Y-%m-%d)"

# Get site URL
SITE_URL=$(npx netlify-cli status | grep -i "site url" | awk '{print $3}')

print_success "Frontend deployed!"

# ═══════════════════════════════════════════════════════════════
# DEPLOYMENT COMPLETE
# ═══════════════════════════════════════════════════════════════

print_header "🎉 Deployment Complete!"

echo ""
echo -e "${GREEN}Your HostBox Portfolio is now live!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🌐 Frontend:${NC}  $SITE_URL"
if [ -n "$BACKEND_URL" ]; then
    echo -e "${BLUE}🗄️  Backend:${NC}   ${BACKEND_URL%/api}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✅ Next Steps:"
echo "  1. Visit your site and test all features"
echo "  2. Share the link on LinkedIn/GitHub"
echo "  3. Add custom domain (optional): netlify domains:add"
echo ""

echo "📊 Useful Commands:"
echo "  • Check status:  npx netlify-cli status"
echo "  • View logs:     npx netlify-cli logs"
echo "  • Redeploy:      npx netlify-cli deploy --prod"
echo ""

echo "🔄 To update your site in the future:"
echo "   git add . && git commit -m 'Update' && ./deploy.sh"
echo ""

print_success "Deployment script finished!"
