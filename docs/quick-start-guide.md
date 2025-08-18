# Quick Start Guide: AI Smart Mirror

## Step 1: Create New Repository

```bash
# Create new directory
mkdir ai-smart-mirror
cd ai-smart-mirror

# Initialize git
git init

# Create initial README
echo "# Smart Mirror AI Enhanced" > README.md
git add README.md
git commit -m "Initial commit"
```

## Step 2: Set Up MagicMirror² Base

```bash
# Add MagicMirror² as remote
git remote add magicmirror https://github.com/MagicMirrorOrg/MagicMirror.git

# Fetch MagicMirror²
git fetch magicmirror

# Merge MagicMirror² into your repo
git merge magicmirror/master --allow-unrelated-histories

# Verify MagicMirror² files are present
ls -la
```

## Step 3: Add TypeScript Support

```bash
# Install TypeScript and dependencies
npm install --save-dev typescript @types/node @types/express

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "modules/**/*",
    "shared/**/*",
    "server/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "magicmirror-core"
  ]
}
EOF

# Add build script to package.json
npm pkg set scripts.build="tsc"
npm pkg set scripts.dev="tsc --watch"
```

## Step 4: Create Custom Modules Directory

```bash
# Create modules directory structure
mkdir -p modules/ai-outfit-recommendation
mkdir -p modules/ai-motivation
mkdir -p modules/enhanced-weather
mkdir -p modules/ai-vision

# Create shared utilities directory
mkdir -p shared/types
mkdir -p shared/utils

# Create server directory
mkdir -p server

# Create config directory
mkdir -p config
```

## Step 5: Copy Your Existing Backend

```bash
# Copy your existing server code
cp -r /Users/benbeau/dev/smart-mirror/server/* ./server/

# Copy shared constants
cp -r /Users/benbeau/dev/smart-mirror/shared/* ./shared/

# Update server CORS for MagicMirror²
# Edit server/server.js to add:
# app.use(cors({
#   origin: ['http://localhost:8080', 'http://localhost:3000'],
#   credentials: true
# }));
```

## Step 6: Create Your First AI Module

```bash
# Create AI Outfit Recommendation Module
cat > modules/ai-outfit-recommendation/index.ts << 'EOF'
/* global Module, Log */

interface OutfitConfig {
  updateInterval: number;
  apiEndpoint: string;
  location: string;
}

interface OutfitData {
  recommendation: string;
  weather: any;
  timestamp: string;
}

Module.register("ai-outfit-recommendation", {
  defaults: {
    updateInterval: 300000, // 5 minutes
    apiEndpoint: "http://localhost:5000/api/ai/outfit-recommendation",
    location: "New York"
  } as OutfitConfig,

  outfitData: null as OutfitData | null,

  start() {
    Log.info("Starting AI Outfit Recommendation module");
    this.fetchOutfitRecommendation();
    this.scheduleUpdate();
  },

  async fetchOutfitRecommendation() {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: this.config.location,
          timeOfDay: this.getTimeOfDay()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.outfitData = data;
      this.updateDom();
    } catch (error) {
      Log.error("Outfit recommendation fetch failed:", error);
    }
  },

  scheduleUpdate() {
    setInterval(() => {
      this.fetchOutfitRecommendation();
    }, this.config.updateInterval);
  },

  getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "ai-outfit-recommendation";

    if (!this.outfitData) {
      wrapper.innerHTML = '<div class="loading">Loading outfit recommendation...</div>';
      return wrapper;
    }

    wrapper.innerHTML = `
      <div class="outfit-title">🤖 AI Outfit Recommendation</div>
      <div class="outfit-content">${this.outfitData.recommendation}</div>
      <div class="outfit-timestamp">Updated: ${new Date(this.outfitData.timestamp).toLocaleTimeString()}</div>
    `;

    return wrapper;
  },

  getStyles() {
    return ["ai-outfit-recommendation.css"];
  }
});
EOF

# Create CSS for the module
cat > modules/ai-outfit-recommendation/ai-outfit-recommendation.css << 'EOF'
.ai-outfit-recommendation {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  padding: 20px;
  margin: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 400px;
}

.outfit-title {
  font-size: 1.2em;
  color: #fff;
  margin-bottom: 15px;
  font-weight: bold;
  text-align: center;
}

.outfit-content {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 10px;
  font-size: 0.9em;
}

.outfit-timestamp {
  color: #888;
  font-size: 0.8em;
  text-align: right;
  font-style: italic;
}

.loading {
  color: #888;
  text-align: center;
  font-style: italic;
}
EOF
```

## Step 7: Create Configuration

```bash
# Create enhanced configuration
cat > config/config-ai.js << 'EOF'
/* global config */

let config = {
  address: "0.0.0.0",
  port: 8080,
  ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],
  useHttps: false,
  httpsPrivateKey: "",
  httpsCertificate: "",

  language: "en",
  logLevel: ["INFO", "LOG", "WARN", "ERROR"],
  timeFormat: 24,
  units: "imperial",

  modules: [
    {
      module: "clock",
      position: "top_center",
      config: {
        displaySeconds: true,
        showDate: true,
        dateFormat: "dddd, LL"
      }
    },
    {
      module: "calendar",
      header: "Upcoming Events",
      position: "top_left",
      config: {
        maximumEntries: 5,
        maximumNumberOfDays: 10
      }
    },
    {
      module: "ai-outfit-recommendation",
      position: "middle_center",
      config: {
        updateInterval: 300000,
        location: "New York"
      }
    }
  ]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = config;
}
EOF
```

## Step 8: Test Your Setup

```bash
# Start your backend server
cd server
npm install
npm start &
cd ..

# Start MagicMirror²
npm start
```

## Step 9: Commit Your Progress

```bash
# Add all files
git add .

# Commit
git commit -m "Initial AI module integration"

# Push to your repository
git remote add origin https://github.com/yourusername/smart-mirror-ai-enhanced.git
git push -u origin main
```

## Next Steps

1. **Test the outfit recommendation module**
2. **Add the motivation module**
3. **Add enhanced weather module**
4. **Integrate with your existing APIs**
5. **Add more AI features**

## Troubleshooting

### Common Issues:

1. **Module not loading**: Check browser console for errors
2. **API calls failing**: Verify server is running on port 5000
3. **CORS errors**: Ensure CORS is configured in server
4. **TypeScript errors**: Run `npm run build` to check for issues

### Useful Commands:

```bash
# Check MagicMirror² logs
tail -f ~/.pm2/logs/mm-out.log

# Restart MagicMirror²
pm2 restart mm

# Check server logs
tail -f server/logs/app.log

# Build TypeScript
npm run build

# Watch TypeScript changes
npm run dev
```
