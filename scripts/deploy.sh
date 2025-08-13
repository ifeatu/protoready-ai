#!/bin/bash

# ProtoReady.ai Deployment Script
set -e

echo "🚀 Starting ProtoReady.ai deployment process..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found, installing..."
        npm install -g vercel@latest
    fi
    
    print_success "All dependencies are available"
}

# Check environment variables
check_environment() {
    print_status "Checking environment configuration..."
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found, please create it from .env.example"
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_status "Created .env.local from .env.example template"
            print_warning "Please update .env.local with your actual values before deploying"
        fi
    fi
    
    # Check required environment variables
    required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "STRIPE_SECRET_KEY")
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_warning "Environment variable $var is not set"
        fi
    done
    
    print_success "Environment check completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Run tests and linting
run_tests() {
    print_status "Running type checking..."
    npx tsc --noEmit
    
    print_status "Running linting..."
    npm run lint
    
    print_status "Running build test..."
    npm run build
    
    print_success "All checks passed"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if this is production deployment
    if [ "$1" = "production" ]; then
        print_status "Deploying to production..."
        vercel --prod
    else
        print_status "Deploying to preview..."
        vercel
    fi
    
    print_success "Deployment completed"
}

# Health check
health_check() {
    if [ "$1" = "production" ]; then
        print_status "Running health check..."
        sleep 10
        
        # Replace with your actual domain
        HEALTH_URL="https://protoready-ai.vercel.app/healthz"
        
        if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
            print_success "Health check passed"
        else
            print_warning "Health check failed, but deployment may still be successful"
        fi
    fi
}

# Main deployment function
main() {
    echo "==========================================>"
    echo "     ProtoReady.ai Deployment Script"
    echo "==========================================>"
    
    # Parse command line arguments
    DEPLOYMENT_TYPE=${1:-preview}
    
    if [ "$DEPLOYMENT_TYPE" != "production" ] && [ "$DEPLOYMENT_TYPE" != "preview" ]; then
        print_error "Invalid deployment type. Use 'production' or 'preview'"
        exit 1
    fi
    
    print_status "Deployment type: $DEPLOYMENT_TYPE"
    
    # Run deployment steps
    check_dependencies
    check_environment
    install_dependencies
    run_tests
    deploy_to_vercel "$DEPLOYMENT_TYPE"
    health_check "$DEPLOYMENT_TYPE"
    
    echo "==========================================>"
    print_success "Deployment completed successfully! 🎉"
    echo "==========================================>"
    
    if [ "$DEPLOYMENT_TYPE" = "production" ]; then
        print_status "Production URL: https://protoready-ai.vercel.app"
    fi
    
    print_status "Don't forget to:"
    echo "  • Check the deployment in Vercel dashboard"
    echo "  • Verify all environment variables are set"
    echo "  • Test the application functionality"
    echo "  • Monitor for any errors in Sentry"
}

# Handle script interruption
trap 'print_error "Deployment interrupted"; exit 1' INT

# Run main function with all arguments
main "$@"