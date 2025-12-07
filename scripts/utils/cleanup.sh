#!/bin/bash

# Cleanup Script
# This script helps clean up build artifacts, caches, and temporary files

set -e

echo "🧹 Equestrian Project Cleanup Script"
echo ""

# Function to clean frontend
clean_frontend() {
    echo "🎨 Cleaning frontend..."
    
    cd frontend
    
    # Remove build directories
    if [ -d "dist" ]; then
        rm -rf dist
        echo "  ✅ Removed dist/"
    fi
    
    if [ -d "dist-dev" ]; then
        rm -rf dist-dev
        echo "  ✅ Removed dist-dev/"
    fi
    
    # Clean cache
    if [ -d "node_modules/.cache" ]; then
        rm -rf node_modules/.cache
        echo "  ✅ Cleaned frontend cache"
    fi
    
    # Clean Vite cache
    if [ -d ".vite" ]; then
        rm -rf .vite
        echo "  ✅ Cleaned Vite cache"
    fi
    
    echo "  ✅ Frontend cleanup complete"
}

# Function to clean backend
clean_backend() {
    echo "⚙️  Cleaning backend..."
    
    cd backend
    
    # Clean Wrangler cache
    if [ -d ".wrangler" ]; then
        rm -rf .wrangler
        echo "  ✅ Cleaned Wrangler cache"
    fi
    
    # Clean npm cache
    if [ -d "node_modules/.cache" ]; then
        rm -rf node_modules/.cache
        echo "  ✅ Cleaned backend cache"
    fi
    
    echo "  ✅ Backend cleanup complete"
}

# Function to clean all node_modules
clean_node_modules() {
    echo "📦 Cleaning node_modules..."
    
    # Clean frontend node_modules
    if [ -d "frontend/node_modules" ]; then
        rm -rf frontend/node_modules
        echo "  ✅ Removed frontend/node_modules"
    fi
    
    # Clean backend node_modules
    if [ -d "backend/node_modules" ]; then
        rm -rf backend/node_modules
        echo "  ✅ Removed backend/node_modules"
    fi
    
    # Clean root node_modules if it exists
    if [ -d "node_modules" ]; then
        rm -rf node_modules
        echo "  ✅ Removed root/node_modules"
    fi
    
    echo "  ✅ Node modules cleanup complete"
}

# Function to clean environment files
clean_env_files() {
    echo "🔧 Cleaning environment files..."
    
    # Remove active environment files (keep source files)
    if [ -f "frontend/.env" ]; then
        rm frontend/.env
        echo "  ✅ Removed frontend/.env"
    fi
    
    if [ -f "frontend/.env.local" ]; then
        rm frontend/.env.local
        echo "  ✅ Removed frontend/.env.local"
    fi
    
    if [ -f "backend/.env" ]; then
        rm backend/.env
        echo "  ✅ Removed backend/.env"
    fi
    
    echo "  ✅ Environment files cleanup complete"
}

# Function to clean logs
clean_logs() {
    echo "📋 Cleaning logs..."
    
    # Remove log files
    find . -name "*.log" -type f -delete 2>/dev/null || true
    echo "  ✅ Removed *.log files"
    
    # Remove Wrangler logs
    find . -name "wrangler-*.log" -type f -delete 2>/dev/null || true
    echo "  ✅ Removed Wrangler logs"
    
    echo "  ✅ Logs cleanup complete"
}

# Function to clean temporary files
clean_temp_files() {
    echo "🗂️  Cleaning temporary files..."
    
    # Remove temporary files
    find . -name "*.tmp" -type f -delete 2>/dev/null || true
    find . -name "*.temp" -type f -delete 2>/dev/null || true
    find . -name ".DS_Store" -type f -delete 2>/dev/null || true
    find . -name "Thumbs.db" -type f -delete 2>/dev/null || true
    
    # Remove backup files
    find . -name "*.bak" -type f -delete 2>/dev/null || true
    find . -name "*.backup" -type f -delete 2>/dev/null || true
    
    echo "  ✅ Temporary files cleanup complete"
}

# Function to reset git
reset_git() {
    echo "🔄 Resetting git repository..."
    
    # Remove untracked files
    git clean -fd 2>/dev/null || true
    echo "  ✅ Removed untracked files"
    
    # Reset staged changes
    git reset HEAD 2>/dev/null || true
    echo "  ✅ Reset staged changes"
    
    echo "  ✅ Git reset complete"
}

# Function to show disk usage
show_disk_usage() {
    echo "💾 Disk usage:"
    echo ""
    
    # Show project size
    du -sh . 2>/dev/null || echo "  Unable to determine project size"
    
    # Show largest directories
    echo ""
    echo "📊 Largest directories:"
    du -sh */ 2>/dev/null | sort -hr | head -5 || echo "  Unable to analyze directories"
}

# Function to full reset
full_reset() {
    echo "🔥 Performing full reset..."
    echo ""
    echo "⚠️  This will remove ALL build artifacts, caches, node_modules, and temporary files!"
    echo ""
    read -p "Are you sure you want to continue? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        clean_frontend
        clean_backend
        clean_node_modules
        clean_env_files
        clean_logs
        clean_temp_files
        
        echo ""
        echo "🎉 Full reset complete!"
        echo ""
        echo "📋 Next steps:"
        echo "1. Run 'npm install' in frontend and backend directories"
        echo "2. Copy appropriate .env files (.env.dev or .env.prod)"
        echo "3. Run 'npm run dev' to start development servers"
    else
        echo "❌ Full reset cancelled"
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  frontend     Clean frontend build artifacts and cache"
    echo "  backend      Clean backend cache and temporary files"
    echo "  node-modules Remove all node_modules directories"
    echo "  env          Clean active environment files"
    echo "  logs         Clean log files"
    echo "  temp         Clean temporary files"
    echo "  git          Reset git state (untracked files only)"
    echo "  full         Perform complete cleanup (requires confirmation)"
    echo "  all          Clean everything except node_modules and git"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 frontend     # Clean frontend only"
    echo "  $0 all          # Clean most things (safe)"
    echo "  $0 full         # Complete reset (destructive)"
}

# Main function
main() {
    local option=${1:-all}
    
    case $option in
        "frontend")
            clean_frontend
            ;;
        "backend")
            clean_backend
            ;;
        "node-modules")
            clean_node_modules
            ;;
        "env")
            clean_env_files
            ;;
        "logs")
            clean_logs
            ;;
        "temp")
            clean_temp_files
            ;;
        "git")
            reset_git
            ;;
        "full")
            full_reset
            ;;
        "all")
            echo "🧹 Starting comprehensive cleanup..."
            clean_frontend
            clean_backend
            clean_env_files
            clean_logs
            clean_temp_files
            echo ""
            echo "🎉 Comprehensive cleanup complete!"
            echo ""
            show_disk_usage
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            echo "❌ Unknown option: $option"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"