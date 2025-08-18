# AI Smart Mirror - Integration Plan

## Repository Structure

```
ai-smart-mirror/
├── magicmirror-core/           # MagicMirror² base (submodule or merged)
│   ├── js/                    # Core framework
│   ├── modules/default/       # Built-in modules
│   └── ...
├── modules/                   # Custom AI modules
│   ├── ai-outfit-recommendation/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── styles.css
│   │   └── README.md
│   ├── ai-motivation/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── styles.css
│   │   └── README.md
│   ├── ai-vision/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── styles.css
│   │   └── README.md
│   └── enhanced-weather/
│       ├── index.ts
│       ├── types.ts
│       ├── styles.css
│       └── README.md
├── server/                    # Your existing Node.js backend
│   ├── routes/
│   │   ├── ai.js
│   │   ├── calendar.js
│   │   └── api.js
│   ├── services/
│   │   ├── openai.js
│   │   ├── weatherService.js
│   │   └── calendarService.js
│   └── server.js
├── shared/                    # Shared utilities and types
│   ├── types/
│   │   ├── weather.ts
│   │   ├── calendar.ts
│   │   └── ai.ts
│   └── utils/
│       ├── api-client.ts
│       └── helpers.ts
├── config/                    # Configuration files
│   ├── config.js
│   └── config-ai.js
├── docs/                      # Documentation
│   ├── modules/
│   ├── api/
│   └── setup.md
├── scripts/                   # Build and deployment scripts
│   ├── build-modules.ts
│   ├── deploy.sh
│   └── setup.sh
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## Migration Strategy

### Phase 1: Repository Setup

1. **Create new repository**

   ```bash
   # Create smart-mirror-ai-enhanced on GitHub
   git clone https://github.com/yourusername/ai-smart-mirror.git
   cd smart-mirror-ai-enhanced
   ```

2. **Set up MagicMirror² base**

   ```bash
   # Option A: Fork and merge
   git remote add magicmirror https://github.com/MagicMirrorOrg/MagicMirror.git
   git fetch magicmirror
   git merge magicmirror/master --allow-unrelated-histories

   # Option B: Submodule approach
   git submodule add https://github.com/MagicMirrorOrg/MagicMirror.git magicmirror-core
   ```

3. **Add TypeScript support**
   ```bash
   npm install --save-dev typescript @types/node @types/express
   # Create tsconfig.json
   ```

### Phase 2: Module Development

1. **Create Simple AI Outfit Recommendation Module**

   ```typescript
   // modules/ai-outfit-recommendation/index.ts
   Module.register("ai-outfit-recommendation", {
     defaults: {
       updateInterval: 300000, // 5 minutes
       apiEndpoint: "http://localhost:5000/api/ai/outfit-recommendation",
     },

     async start() {
       await this.fetchOutfitRecommendation();
       this.scheduleUpdate();
     },

     async fetchOutfitRecommendation() {
       try {
         const response = await fetch(this.config.apiEndpoint);
         const data = await response.json();
         this.outfitData = data.recommendation;
         this.updateDom();
       } catch (error) {
         Log.error("Outfit recommendation fetch failed:", error);
       }
     },
   });
   ```

2. **Create AI Motivation Module**

   ```typescript
   // modules/ai-motivation/index.ts
   Module.register("ai-motivation", {
     defaults: {
       updateInterval: 600000, // 10 minutes
       apiEndpoint: "http://localhost:5000/api/ai/motivation",
     },

     async start() {
       await this.fetchMotivation();
       this.scheduleUpdate();
     },
   });
   ```

### Phase 3: Backend Integration

1. **Copy your existing server**

   ```bash
   cp -r /Users/benbeau/dev/smart-mirror/server ./server
   ```

2. **Update server configuration**

   ```javascript
   // server/server.js
   const PORT = process.env.PORT || 5000;

   // Add CORS for MagicMirror²
   app.use(
     cors({
       origin: ["http://localhost:8080", "http://localhost:3000"],
       credentials: true,
     })
   );
   ```

3. **Create shared API client**

   ```typescript
   // shared/utils/api-client.ts
   export class ApiClient {
     private baseUrl: string;

     constructor(baseUrl: string = "http://localhost:5000") {
       this.baseUrl = baseUrl;
     }

     async getOutfitRecommendation(weather: any) {
       const response = await fetch(
         `${this.baseUrl}/api/ai/outfit-recommendation`,
         {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(weather),
         }
       );
       return response.json();
     }
   }
   ```

### Phase 4: Configuration and Styling

1. **Create enhanced configuration**

   ```javascript
   // config/config-ai.js
   {
     modules: [
       // Built-in modules
       {
         module: "clock",
         position: "top_center",
       },
       {
         module: "calendar",
         position: "top_left",
       },

       // AI modules
       {
         module: "enhanced-weather",
         position: "top_right",
         config: {
           location: "New York",
           units: "imperial",
         },
       },
       {
         module: "ai-outfit-recommendation",
         position: "middle_center",
         config: {
           updateInterval: 300000,
         },
       },
       {
         module: "ai-motivation",
         position: "bottom_center",
         config: {
           updateInterval: 600000,
         },
       },
     ];
   }
   ```

2. **Custom styling**

   ```css
   /* modules/ai-outfit-recommendation/styles.css */
   .ai-outfit-recommendation {
     background: rgba(0, 0, 0, 0.8);
     border-radius: 10px;
     padding: 20px;
     margin: 10px;
     backdrop-filter: blur(10px);
   }

   .outfit-title {
     font-size: 1.2em;
     color: #fff;
     margin-bottom: 10px;
   }

   .outfit-content {
     color: #ccc;
     line-height: 1.4;
   }
   ```

### Phase 5: Testing and Refinement

1. **Test module integration**
2. **Optimize performance**
3. **Add error handling**
4. **Documentation**

## Development Workflow

### Daily Development Process:

1. **Morning**: Pull latest changes, test existing modules
2. **Development**: Work on new modules or enhancements
3. **Testing**: Test modules individually and together
4. **Evening**: Commit changes, update documentation

### Module Development Template:

```typescript
// Template for new modules
Module.register("module-name", {
  defaults: {
    // Configuration options
  },

  // Required methods
  start() {
    // Initialize module
  },

  getDom() {
    // Return DOM element
  },

  // Optional methods
  notificationReceived(notification, payload, sender) {
    // Handle notifications
  },

  socketNotificationReceived(notification, payload) {
    // Handle socket notifications
  },
});
```

## Benefits of This Approach

1. **Clean separation**: MagicMirror² core remains untouched
2. **Easy updates**: Can pull latest MagicMirror² changes
3. **Type safety**: TypeScript for all custom modules
4. **Modular**: Each AI feature is a separate module
5. **Maintainable**: Clear folder structure
6. **Scalable**: Easy to add new modules

## Next Steps

1. Create the new repository
2. Set up MagicMirror² base
3. Add TypeScript support
4. Start with one AI module (outfit recommendation)
5. Gradually add more modules
6. Test and refine
