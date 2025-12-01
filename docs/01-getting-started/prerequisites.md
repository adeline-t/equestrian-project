# Prerequisites

Before you begin working with the Equestrian Management System, ensure you have the following tools and accounts set up.

## 💻 System Requirements

### Operating System
- **macOS** 10.15 or later
- **Windows** 10/11 with WSL2
- **Linux** (Ubuntu 20.04+, Debian 11+, or equivalent)

### Hardware
- **RAM:** Minimum 4GB (8GB recommended)
- **Storage:** At least 2GB free space
- **Internet:** Stable connection required for cloud services

## 🛠️ Required Software

### Node.js and npm

**Version Required:** Node.js 18.x or later

**Installation:**

**macOS (using Homebrew):**
```bash
brew install node@18
```

**Windows:**
Download from [nodejs.org](https://nodejs.org/) and run the installer.

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Installation:**
```bash
node --version  # Should show v18.x.x or later
npm --version   # Should show 9.x.x or later
```

### Git

**Version Required:** Git 2.30 or later

**Installation:**

**macOS:**
```bash
brew install git
```

**Windows:**
Download from [git-scm.com](https://git-scm.com/)

**Linux:**
```bash
sudo apt-get install git
```

**Verify Installation:**
```bash
git --version
```

### Wrangler CLI (Cloudflare Workers)

**Installation:**
```bash
npm install -g wrangler
```

**Verify Installation:**
```bash
wrangler --version
```

## ☁️ Required Accounts

### 1. Cloudflare Account

**Purpose:** Hosting backend (Workers) and frontend (Pages)

**Sign Up:**
1. Go to [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Create a free account (no credit card required)
3. Verify your email address

**What You'll Need:**
- Account ID (found in dashboard)
- API Token (for Wrangler authentication)

### 2. Supabase Account

**Purpose:** PostgreSQL database hosting

**Sign Up:**
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub (recommended) or email
3. Verify your email if using email signup

**What You'll Need:**
- Project URL
- Anon/Public Key
- Service Role Key (for admin operations)

### 3. GitHub Account (Optional but Recommended)

**Purpose:** Version control and CI/CD

**Sign Up:**
1. Go to [github.com/join](https://github.com/join)
2. Create a free account

**Benefits:**
- Automatic deployments
- Issue tracking
- Collaboration features

## 🔧 Optional Tools

### Code Editor

**Recommended:** Visual Studio Code
- Download from [code.visualstudio.com](https://code.visualstudio.com/)
- Install recommended extensions:
  - ESLint
  - Prettier
  - Vite
  - React Developer Tools

**Alternatives:**
- WebStorm
- Sublime Text
- Vim/Neovim

### Database Client

**Recommended:** DBeaver or pgAdmin
- For viewing and managing your Supabase database
- Supabase also provides a built-in SQL editor

### API Testing Tool

**Recommended:** Postman or Insomnia
- For testing API endpoints during development
- Thunder Client (VS Code extension) is also good

## ✅ Verification Checklist

Before proceeding to installation, verify you have:

- [ ] Node.js 18+ installed and working
- [ ] npm installed and working
- [ ] Git installed and configured
- [ ] Wrangler CLI installed
- [ ] Cloudflare account created
- [ ] Supabase account created
- [ ] Code editor installed
- [ ] Terminal/command line access

## 🚀 Next Steps

Once you have all prerequisites ready:

1. **[Installation Guide](./installation.md)** - Set up the project
2. **[Quick Start](./quick-start.md)** - Get running quickly

## 🆘 Troubleshooting

### Node.js Version Issues

If you need multiple Node.js versions, consider using:
- **nvm** (Node Version Manager) for macOS/Linux
- **nvm-windows** for Windows

### Permission Errors

If you get permission errors when installing global npm packages:
```bash
# Fix npm permissions (Linux/macOS)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Wrangler Authentication Issues

If Wrangler won't authenticate:
```bash
# Clear existing auth and re-authenticate
wrangler logout
wrangler login
```

---

**Ready to install?** Continue to the [Installation Guide](./installation.md)