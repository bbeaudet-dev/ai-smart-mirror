# OpenAI API Integration Strategy

## Architecture Overview

```
ai-smart-mirror/
├── server/                    # Your existing Node.js backend
│   ├── services/
│   │   ├── openai.js         # OpenAI service (existing)
│   │   ├── promptService.js  # Prompt management (existing)
│   │   └── outfitRecommendationService.js (existing)
│   └── routes/
│       └── ai.js             # AI endpoints (existing)
├── modules/                   # MagicMirror² modules
│   ├── ai-outfit-recommendation/
│   │   ├── index.ts          # Module that calls your API
│   │   └── types.ts
│   ├── ai-motivation/
│   │   ├── index.ts          # Module that calls your API
│   │   └── types.ts
│   └── ai-vision/
│       ├── index.ts          # New module for image analysis
│       └── types.ts
└── shared/
    └── utils/
        └── ai-client.ts      # Shared AI client utilities
```

## Integration Approaches

### **Approach 1: Backend-First (Recommended)**

**Keep your existing OpenAI services in the backend, create MagicMirror² modules that call them.**

**Benefits:**

- ✅ Reuse your existing, tested OpenAI integration
- ✅ Centralized API management
- ✅ Easy to maintain and update
- ✅ Can be used by other clients (mobile app, web app)

**Implementation:**

```typescript
// server/services/openai.js (existing - keep as-is)
class OpenAIService {
  async chat(message, context) {
    // Your existing OpenAI chat implementation
  }

  async analyzeImage(imageBuffer, imageType, prompt, context) {
    // Your existing image analysis implementation
  }
}

// modules/ai-outfit-recommendation/index.ts (new)
Module.register("ai-outfit-recommendation", {
  defaults: {
    apiEndpoint: "http://localhost:5000/api/ai/outfit-recommendation",
    updateInterval: 300000,
  },

  async fetchOutfitRecommendation() {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: this.weatherData.temperature,
          condition: this.weatherData.condition,
          timeOfDay: this.getTimeOfDay(),
        }),
      });

      const data = await response.json();
      this.outfitData = data.recommendation;
      this.updateDom();
    } catch (error) {
      Log.error("Outfit recommendation failed:", error);
    }
  },
});
```

### **Approach 2: Module-First**

**Create MagicMirror² modules that directly integrate with OpenAI API.**

**Benefits:**

- ✅ Direct integration, no network calls
- ✅ Lower latency
- ✅ Simpler architecture

**Drawbacks:**

- ❌ Duplicate OpenAI integration code
- ❌ API keys in frontend (security concern)
- ❌ Harder to maintain

**Implementation:**

```typescript
// modules/ai-outfit-recommendation/index.ts
Module.register("ai-outfit-recommendation", {
  defaults: {
    openaiApiKey: "", // Would need to be configured
    updateInterval: 300000,
  },

  async fetchOutfitRecommendation() {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are a fashion advisor...",
              },
              {
                role: "user",
                content: `Recommend an outfit for ${this.weatherData.temperature}°F, ${this.weatherData.condition} weather`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      this.outfitData = data.choices[0].message.content;
      this.updateDom();
    } catch (error) {
      Log.error("OpenAI API call failed:", error);
    }
  },
});
```

### **Approach 3: Hybrid (Best of Both Worlds)**

**Use your backend for complex AI operations, direct API calls for simple ones.**

**Implementation:**

```typescript
// Complex operations (outfit recommendations, motivation) → Backend
// Simple operations (text completion, basic chat) → Direct API

// modules/ai-outfit-recommendation/index.ts (uses backend)
Module.register("ai-outfit-recommendation", {
  defaults: {
    apiEndpoint: "http://localhost:5000/api/ai/outfit-recommendation",
  },
  // Calls your existing backend service
});

// modules/ai-quick-chat/index.ts (direct API)
Module.register("ai-quick-chat", {
  defaults: {
    openaiApiKey: "",
  },
  // Direct OpenAI API calls for simple operations
});
```

## Recommended Implementation Plan

### **Phase 1: Backend Integration (Days 1-2)**

1. **Copy your existing OpenAI services**

   ```bash
   cp -r /Users/benbeau/dev/smart-mirror/server/services ./server/
   cp -r /Users/benbeau/dev/smart-mirror/server/routes ./server/
   ```

2. **Update CORS for MagicMirror²**

   ```javascript
   // server/server.js
   app.use(
     cors({
       origin: ["http://localhost:8080", "http://localhost:3000"],
       credentials: true,
     })
   );
   ```

3. **Test your existing endpoints**
   ```bash
   curl -X POST http://localhost:5000/api/ai/outfit-recommendation \
     -H "Content-Type: application/json" \
     -d '{"temperature": 72, "condition": "sunny"}'
   ```

### **Phase 2: MagicMirror² Modules (Days 3-5)**

1. **Create AI Outfit Recommendation Module**

   ```typescript
   // modules/ai-outfit-recommendation/index.ts
   Module.register("ai-outfit-recommendation", {
     defaults: {
       apiEndpoint: "http://localhost:5000/api/ai/outfit-recommendation",
       updateInterval: 300000,
     },

     async start() {
       await this.fetchOutfitRecommendation();
       this.scheduleUpdate();
     },

     async fetchOutfitRecommendation() {
       try {
         const response = await fetch(this.config.apiEndpoint, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             temperature: this.weatherData?.temperature || 70,
             condition: this.weatherData?.condition || "clear",
             timeOfDay: this.getTimeOfDay(),
           }),
         });

         const data = await response.json();
         this.outfitData = data.recommendation;
         this.updateDom();
       } catch (error) {
         Log.error("Outfit recommendation failed:", error);
       }
     },
   });
   ```

2. **Create AI Motivation Module**

   ```typescript
   // modules/ai-motivation/index.ts
   Module.register("ai-motivation", {
     defaults: {
       apiEndpoint: "http://localhost:5000/api/ai/motivation",
       updateInterval: 600000,
     },

     async fetchMotivation() {
       try {
         const response = await fetch(this.config.apiEndpoint, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             timeOfDay: this.getTimeOfDay(),
             mood: "neutral",
           }),
         });

         const data = await response.json();
         this.motivationData = data.motivation;
         this.updateDom();
       } catch (error) {
         Log.error("Motivation fetch failed:", error);
       }
     },
   });
   ```

### **Phase 3: Advanced AI Features (Days 6-10)**

1. **AI Vision Module (New)**

   ```typescript
   // modules/ai-vision/index.ts
   Module.register("ai-vision", {
     defaults: {
       apiEndpoint: "http://localhost:5000/api/ai/analyze-image",
       cameraEnabled: false,
       updateInterval: 30000,
     },

     async analyzeOutfit() {
       if (!this.config.cameraEnabled) return;

       try {
         const imageBlob = await this.captureImage();
         const formData = new FormData();
         formData.append("image", imageBlob);
         formData.append("prompt", "Analyze this outfit and provide feedback");

         const response = await fetch(this.config.apiEndpoint, {
           method: "POST",
           body: formData,
         });

         const data = await response.json();
         this.analysisData = data.analysis;
         this.updateDom();
       } catch (error) {
         Log.error("Image analysis failed:", error);
       }
     },
   });
   ```

2. **Enhanced Weather Module with AI**

   ```typescript
   // modules/enhanced-weather/index.ts
   Module.register("enhanced-weather", {
     defaults: {
       weatherApiEndpoint: "http://localhost:5000/api/weather",
       aiEndpoint: "http://localhost:5000/api/ai/weather-insights",
       updateInterval: 180000,
     },

     async fetchWeatherWithAI() {
       // Fetch weather data
       const weatherResponse = await fetch(this.config.weatherApiEndpoint);
       const weatherData = await weatherResponse.json();

       // Get AI insights about the weather
       const aiResponse = await fetch(this.config.aiEndpoint, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(weatherData),
       });
       const aiData = await aiResponse.json();

       this.weatherData = weatherData;
       this.aiInsights = aiData.insights;
       this.updateDom();
     },
   });
   ```

## Configuration Management

### **Environment Variables**

```bash
# .env
OPENAI_API_KEY=your_openai_api_key
WEATHER_API_KEY=your_weather_api_key
GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret
```

### **Module Configuration**

```javascript
// config/config-ai.js
{
  modules: [
    {
      module: "ai-outfit-recommendation",
      position: "middle_center",
      config: {
        updateInterval: 300000,
        apiEndpoint: "http://localhost:5000/api/ai/outfit-recommendation",
      },
    },
    {
      module: "ai-motivation",
      position: "bottom_center",
      config: {
        updateInterval: 600000,
        apiEndpoint: "http://localhost:5000/api/ai/motivation",
      },
    },
    {
      module: "ai-vision",
      position: "top_right",
      config: {
        cameraEnabled: false,
        updateInterval: 30000,
      },
    },
  ];
}
```

## Benefits of This Approach

1. **Reuse Existing Code**: Your tested OpenAI integration
2. **Centralized Management**: All AI logic in one place
3. **Security**: API keys stay in backend
4. **Scalability**: Easy to add new AI features
5. **Maintainability**: Single source of truth for AI logic
6. **Performance**: Backend can cache and optimize API calls

## Next Steps

1. **Set up the workspace** with all three repositories
2. **Copy your existing backend** to the new project
3. **Create your first AI module** (outfit recommendation)
4. **Test the integration** end-to-end
5. **Add more AI modules** gradually
