# Raspberry Pi Setup Guide

This guide will help you get the basic MagicMirror² running on your Raspberry Pi 5 before adding AI features.

## Prerequisites

- Raspberry Pi 5 (or Pi 4)
- Internet connection
- SSH access (recommended) or direct access to Pi
- Basic Linux command line knowledge

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-smart-mirror
```

### 2. Run the Setup Script

```bash
chmod +x setup-pi.sh
./setup-pi.sh
```

### 3. Start MagicMirror²

```bash
npm start
```

### 4. Access Your Mirror

Open a web browser and go to: `http://your-pi-ip:8080`

**To find your Pi's IP address:**

```bash
hostname -I
```

## Manual Setup (if script doesn't work)

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Verify Node.js Installation

```bash
node --version  # Should be 22.x or higher
npm --version
```

### 4. Install Dependencies

```bash
npm install --only=prod
```

### 5. Create Configuration

```bash
cp config/config.js.sample config/config.js
```

### 6. Edit Configuration

Edit `config/config.js` to customize your setup:

- Change weather coordinates to your location
- Adjust module positions
- Add/remove modules as needed

### 7. Test Configuration

```bash
npm run config:check
```

### 8. Start the Mirror

```bash
npm start
```

## Basic Configuration

The basic config includes:

- **Clock** (top center) - Shows time and date
- **Weather** (top right) - Current weather conditions
- **Compliments** (lower third) - Random compliments
- **News Feed** (bottom bar) - Latest news headlines
- **Alerts** - System notifications

## Verification Steps

### 1. Check if MagicMirror² is Running

```bash
# Check if process is running
ps aux | grep -i magicmirror

# Check if port 8080 is in use
sudo lsof -i :8080
```

### 2. Test Web Access

```bash
# Test locally
curl http://localhost:8080

# Test from another device
curl http://your-pi-ip:8080
```

### 3. Check Logs

```bash
# View MagicMirror² logs
tail -f ~/.pm2/logs/mm-out.log

# Or check system logs
journalctl -u magicmirror -f
```

## Troubleshooting

### Common Issues:

1. **Port already in use**

   ```bash
   sudo lsof -i :8080
   sudo kill -9 <PID>
   ```

2. **Permission denied**

   ```bash
   sudo chown -R $USER:$USER .
   chmod +x setup-pi.sh
   ```

3. **Node.js version too old**

   ```bash
   node --version  # Should be 22.x or higher
   # If too old, reinstall Node.js
   ```

4. **Can't access from other devices**
   - Check your firewall settings
   - Make sure `address: "0.0.0.0"` in config
   - Add your network to `ipWhitelist`
   - Check Pi's IP address: `hostname -I`

5. **Weather not loading**
   - Check internet connection
   - Verify coordinates in config
   - Check if OpenMeteo is accessible

6. **News feed not loading**
   - Check internet connection
   - RSS feed might be down, try different source

### Development and Debugging:

```bash
# Run in development mode
npm run start:dev

# Check configuration
npm run config:check

# View detailed logs
npm start 2>&1 | tee mm.log
```

## Customization

### Change Weather Location

Edit `config/config.js` and update the weather coordinates:

```javascript
{
  module: "weather",
  position: "top_right",
  config: {
    weatherProvider: "openmeteo",
    type: "current",
    lat: YOUR_LATITUDE,  // Change this
    lon: YOUR_LONGITUDE, // Change this
    units: "imperial"
  }
}
```

### Add/Remove Modules

Edit the `modules` array in `config/config.js` to add or remove modules.

### Customize Appearance

Edit CSS files in the `css/` directory to change colors, fonts, etc.

## Auto-Start Setup (Optional)

### Using PM2 (Recommended)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start MagicMirror² with PM2
pm2 start npm --name "magicmirror" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### Using systemd

```bash
# Create service file
sudo nano /etc/systemd/system/magicmirror.service
```

Add this content:

```ini
[Unit]
Description=MagicMirror²
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/ai-smart-mirror
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then enable and start:

```bash
sudo systemctl enable magicmirror
sudo systemctl start magicmirror
```

## Next Steps

Once the basic mirror is working:

1. **Test all modules** - Make sure weather, news, etc. are working
2. **Customize appearance** - Edit CSS files in `css/` directory
3. **Set up auto-start** - Configure PM2 or systemd
4. **Add AI features** - Set up the backend server and AI modules
5. **Hardware setup** - Connect display, mirror, etc.

## AI Features (Later)

When you're ready to add AI features:

1. Set up environment variables in `.env`
2. Start the backend server: `npm run server`
3. Add AI modules to your configuration
4. Test AI functionality

## Support

- Check the [MagicMirror² documentation](https://docs.magicmirror.builders)
- Visit the [MagicMirror² forum](https://forum.magicmirror.builders)
- Check the logs for error messages
- GitHub issues for this repository

## Files Created/Modified

- `config/config.js` - Main configuration file
- `.env` - Environment variables (created from env.example)
- `setup-pi.sh` - Setup script
- `PI-SETUP.md` - This guide
