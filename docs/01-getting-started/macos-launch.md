# 🍎 macOS-Specific Launch Guide

> **This guide covers macOS-specific considerations for launching the Equestrian Project locally.**

For general launch instructions, see [Quick Start](./quick-start.md). This guide fills in macOS-specific details.

## 🎯 macOS Prerequisites

### Required Software

#### 1. Homebrew (Recommended)
Homebrew simplifies package management on macOS.

**Check if installed:**
```bash
brew --version
```

**Install if needed:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Node.js via Homebrew
**Install:**
```bash
brew install node
```

**Verify:**
```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

**Alternative:** Download from [nodejs.org](https://nodejs.org/)

#### 3. Git (Usually Pre-installed)
**Verify:**
```bash
git --version
```

**Install if needed:**
```bash
brew install git
```

### Optional Tools

#### Wrangler (for deployment)
```bash
npm install -g wrangler
```

## 🚀 Launching on macOS

### Method 1: Launch Script (Recommended)

```bash
cd equestrian-project
./launch-local.sh
```

**What happens:**
1. Script checks prerequisites
2. Installs dependencies if needed
3. Launches backend on port 8787
4. Launches frontend on port 5173
5. Monitors both services

### Method 2: Manual Launch

**Terminal 1 - Backend:**
```bash
cd equestrian-project/backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd equestrian-project/frontend
npm install
npm run dev
```

## 🔐 macOS Security Considerations

### Gatekeeper and Script Execution

When running scripts for the first time, macOS may block execution.

#### Issue: "Cannot be opened because it is from an unidentified developer"

**Solution 1: Allow in System Preferences**
1. Go to System Preferences → Security & Privacy
2. Click "Allow Anyway" next to the blocked script
3. Run the script again

**Solution 2: Remove Quarantine Attribute**
```bash
xattr -d com.apple.quarantine launch-local.sh
```

**Solution 3: Allow All Scripts in Project**
```bash
cd equestrian-project
find . -name "*.sh" -exec xattr -d com.apple.quarantine {} \; 2>/dev/null
```

### Firewall Prompts

When launching for the first time, macOS Firewall may prompt:

**"Do you want the application 'node' to accept incoming network connections?"**

- Click **"Allow"** for both backend (port 8787) and frontend (port 5173)
- This is normal and required for local development

### Script Permissions

If you get "Permission denied":

```bash
chmod +x launch-local.sh
chmod +x deploy.sh
chmod +x scripts/setup/*.sh
chmod +x scripts/utils/*.sh
```

## 🖥️ Terminal Recommendations

### Terminal.app (Built-in)
- ✅ Works perfectly
- ✅ No additional setup needed
- ✅ Good for most users

**Tips:**
- Use ⌘T to open new tabs
- Use ⌘N for new windows
- Customize colors in Preferences

### iTerm2 (Recommended for Power Users)
- ✅ Better color support
- ✅ Split panes
- ✅ Better search
- ✅ Customizable

**Install:**
```bash
brew install --cask iterm2
```

**Recommended iTerm2 Settings:**
1. Profiles → Colors → Color Presets → Solarized Dark
2. Profiles → Text → Font → 14pt Monaco
3. Profiles → Terminal → Scrollback lines → 10000

### Running Multiple Services

**Option 1: Multiple Tabs (Terminal.app)**
1. ⌘T to open new tab
2. Run backend in first tab
3. Run frontend in second tab

**Option 2: Split Panes (iTerm2)**
1. ⌘D to split vertically
2. ⌘⇧D to split horizontally
3. Run services in different panes

**Option 3: Use Launch Script (Easiest)**
```bash
./launch-local.sh  # Handles everything automatically
```

## 🔧 macOS-Specific Troubleshooting

### Port Already in Use

**Check what's using a port:**
```bash
lsof -i :5173  # Frontend
lsof -i :8787  # Backend
```

**Kill process on port:**
```bash
lsof -ti:5173 | xargs kill -9
lsof -ti:8787 | xargs kill -9
```

**Note:** The launch script handles this automatically.

### Node.js Version Issues

**Check current version:**
```bash
node --version
```

**Switch Node.js versions (using nvm):**
```bash
# Install nvm
brew install nvm

# Install specific Node.js version
nvm install 18
nvm use 18
nvm alias default 18
```

### Homebrew Issues

**Update Homebrew:**
```bash
brew update
brew upgrade
```

**Fix Homebrew permissions:**
```bash
sudo chown -R $(whoami) /usr/local/Cellar
sudo chown -R $(whoami) /usr/local/Homebrew
```

### Rosetta 2 (Apple Silicon Macs)

Most Node.js packages work natively on Apple Silicon. If you encounter issues:

**Check architecture:**
```bash
uname -m
# arm64 = Apple Silicon (M1/M2/M3)
# x86_64 = Intel
```

**Run in Rosetta mode (if needed):**
```bash
arch -x86_64 zsh
npm install
```

**Note:** This is rarely needed for this project.

### Network Issues

**Reset DNS cache:**
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**Check localhost resolution:**
```bash
ping localhost
# Should resolve to 127.0.0.1
```

## 🎨 macOS-Specific Features

### Spotlight Search
Add project to Spotlight for quick access:
```bash
# Open project in Finder
open .

# Add to Favorites (⌘T)
```

### Quick Look
Preview files without opening:
- Select file in Finder
- Press Space bar
- Works with most project files

### Automator Workflows

Create a workflow to launch the project:

1. Open Automator
2. New Document → Application
3. Add "Run Shell Script" action
4. Script:
```bash
cd ~/path/to/equestrian-project
./launch-local.sh
```
5. Save as "Launch Equestrian.app"
6. Add to Dock or Applications

## 📱 Accessing from Other Devices

### Access from iPhone/iPad on Same Network

1. Find your Mac's IP address:
```bash
ipconfig getifaddr en0  # WiFi
ipconfig getifaddr en1  # Ethernet
```

2. On iPhone/iPad, open Safari:
```
http://YOUR_MAC_IP:5173
```

**Example:**
```
http://192.168.1.100:5173
```

### Enable Network Access

If you can't access from other devices:

1. Check macOS Firewall:
   - System Preferences → Security & Privacy → Firewall
   - Click "Firewall Options"
   - Ensure "Block all incoming connections" is OFF

2. Allow Node.js through firewall (if prompted)

## 🔄 Keeping macOS Updated

### System Updates
```bash
softwareupdate --list
softwareupdate --install --all
```

### Homebrew Updates
```bash
brew update
brew upgrade
brew cleanup
```

### Node.js Updates
```bash
brew upgrade node
```

## 🎯 macOS Performance Tips

### Free Up Memory
```bash
# Clear system cache
sudo purge

# Check memory usage
top -o mem
```

### Monitor Resource Usage
```bash
# CPU and memory
top

# Network
nettop

# Disk I/O
sudo iotop
```

### Activity Monitor
- Open Activity Monitor (⌘Space → "Activity Monitor")
- Check CPU, Memory, Network tabs
- Look for "node" processes

## 🆘 Getting Help

### macOS-Specific Issues

1. **Check Console.app:**
   - Open Console.app
   - Look for errors related to "node" or project

2. **System Information:**
```bash
system_profiler SPSoftwareDataType
system_profiler SPHardwareDataType
```

3. **Generate Diagnostic Report:**
```bash
# Create report
./launch-local.sh 2>&1 | tee launch-report.txt

# Share launch-report.txt when asking for help
```

## 📚 Additional Resources

- [Homebrew Documentation](https://docs.brew.sh/)
- [macOS Terminal Guide](https://support.apple.com/guide/terminal/)
- [Node.js on macOS](https://nodejs.org/en/download/package-manager/#macos)
- [iTerm2 Documentation](https://iterm2.com/documentation.html)

## ✅ Quick Checklist

Before launching on macOS:
- [ ] Homebrew installed
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Project cloned
- [ ] Environment files configured
- [ ] Scripts are executable (`chmod +x`)
- [ ] Firewall allows Node.js
- [ ] Ports 5173 and 8787 are free

## 🎉 Ready to Launch!

Once everything is set up:

```bash
cd equestrian-project
./launch-local.sh
```

Your application will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8787

---

**macOS Version Tested:** macOS Sonoma 14.x, Ventura 13.x  
**Last Updated:** January 2025