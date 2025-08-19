Module.register("ai-outfit", {
  defaults: {
    updateInterval: 900000, // 15 minutes
    apiEndpoint: "http://localhost:5001/api/ai/outfit-recommendation",
    position: "top_right",
    showWeather: true,
    showTimestamp: false
  },

  // Error message constants
  ERROR_MESSAGES: {
    MISSING_GENDER: "Missing essential user profile: gender",
    MISSING_WEATHER: "Weather data not available",
    MISSING_PROFILE: "userProfile not configured in global config"
  },

  outfitData: null,
  weatherData: null,

  start() {
    Log.info("Starting AI Outfit module");
    this.fetchOutfitRecommendation();
    this.scheduleUpdate();
  },

  async fetchOutfitRecommendation() {
    try {
      // Get user profile first
      const userProfile = this.getUserProfile();
      const missingData = [];

      // Check for missing data - only gender is truly essential for personalized recommendations
      if (!userProfile.gender || userProfile.gender === "neutral") {
        missingData.push("gender");
      }

      // Get weather data
      let weatherData = null;
      const weatherModule = MM.getModules().find(module => module.name === "weather");
      if (!weatherModule || !weatherModule.weatherData) {
        missingData.push("weather");
      } else {
        const weather = weatherModule.weatherData;
        const currentWeather = weather.current || weather.today || weather;
        if (!currentWeather || !currentWeather.temperature) {
          missingData.push("weather");
        } else {
          weatherData = {
            temperature: currentWeather.temperature,
            condition: currentWeather.condition || currentWeather.weatherType || "clear",
            weatherCode: currentWeather.weatherCode || null,
            chanceOfRain: currentWeather.rain || currentWeather.precipitation || 0,
            location: weather.location || "current location"
          };
        }
      }

      // Only make API request if we have the required weather data
      if (!weatherData || !weatherData.temperature || !weatherData.condition) {
        info("AI Outfit: Missing required weather data, skipping API request");
        this.outfitData = {
          recommendation: "Weather data unavailable - waiting for current conditions",
          missingData: missingData
        };
        this.updateDom();
        return;
      }

      const requestBody = {
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        weatherCode: weatherData.weatherCode,
        chanceOfRain: weatherData.chanceOfRain,
        location: weatherData.location || "current location",
        timeOfDay: this.getTimeOfDay(),
        recommendationType: this.getRecommendationType(),
        gender: userProfile.gender || "neutral",
        missingData: missingData
      };

      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // SCENARIO 1: AI call succeeded, but we may have missing data
      // Add helpful tags based on missing data to inform user
      let recommendation = data.recommendation;
      if (missingData.includes("gender")) {
        recommendation += " (Update user profile for better results)";
      }
      if (missingData.includes("weather")) {
        recommendation += " (Weather data unavailable, weak recommendation)";
      }

      this.outfitData = {
        ...data,
        recommendation: recommendation,
        missingData: missingData
      };
      this.weatherData = weatherData;
      this.updateDom();
    } catch (error) {
      _error("Outfit recommendation fetch failed:", error);
      
      // SCENARIO 2 & 3: Network/server error - AI call failed completely
      // This happens when:
      // - Server is down
      // - Network connection issues  
      // - HTTP errors (404, 500, etc.)
      // - OpenAI API errors
      this.outfitData = {
        recommendation: "Unable to get personalized recommendation - check server connection",
        missingData: ["connection"]
      };
      this.updateDom();
    }
  },

  scheduleUpdate() {
    setInterval(() => {
      this.fetchOutfitRecommendation();
    }, this.config.updateInterval);
  },

  // Listen for weather updates to automatically refresh recommendations
  notificationReceived (notification, payload, sender) {
    if (notification === "WEATHER_UPDATED" && sender.name === "weather") {
      // Store the weather data from the notification
      if (payload && payload.currentWeather) {
        this.weatherData = {
          temperature: payload.currentWeather.temperature,
          condition: payload.currentWeather.weatherType,
          weatherCode: payload.currentWeather.weatherCode,
          chanceOfRain: payload.currentWeather.precipitation,
          location: payload.locationName
        };
      }
      this.fetchOutfitRecommendation();
    }
  },

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 5) {return 'night';}
    if (hour < 12) {return 'morning';}
    if (hour < 17) {return 'afternoon';}
    if (hour < 21) {return 'evening';}
    return 'night';
  },

  getRecommendationType() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Get user profile from global config
    const userProfile = this.getUserProfile();
    
    // TODO Check for holidays (we can expand this later)
    const month = today.getMonth();
    const date = today.getDate();
    
    // TODO Simple holiday detection (we can make this more sophisticated)
    if ((month === 11 && date === 25) || // Christmas
        (month === 10 && date === 31) || // Halloween
        (month === 6 && date === 4)) {   // Independence Day
      return userProfile.stylePreferences.holiday;
    }
    
    // TODO Check calendar for special events (we'll implement this later)
    // For now, just use weekday/weekend logic
    
    return isWeekend ? userProfile.stylePreferences.weekend : userProfile.stylePreferences.weekday;
  },

  getUserProfile() {
    // Try to get user profile from global config
    if (typeof config !== 'undefined' && config.userProfile) {
      const profile = config.userProfile;
      
      // Use smart fallbacks for missing data
      const smartProfile = {
        gender: profile.gender || "neutral", // Use neutral if gender missing
        location: profile.location || "unknown location",
        stylePreferences: {
          weekday: profile.stylePreferences?.weekday || "smart-casual",
          weekend: profile.stylePreferences?.weekend || "casual", 
          holiday: profile.stylePreferences?.holiday || "festive",
          interview: profile.stylePreferences?.interview || "business",
          birthday: profile.stylePreferences?.birthday || "fun",
          workout: profile.stylePreferences?.workout || "athletic"
        }
      };
      
      return smartProfile;
    }
    
    // Return default profile if none configured
    return {
      gender: "neutral",
      location: "unknown location", 
      stylePreferences: {
        weekday: "smart-casual",
        weekend: "casual",
        holiday: "festive",
        interview: "business", 
        birthday: "fun",
        workout: "athletic"
      }
    };
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "ai-outfit";

    if (!this.outfitData) {
      wrapper.innerHTML = `
        <div class="outfit-title">Today's Style</div>
        <div class="outfit-content">Loading...</div>
      `;
    } else {
      let content = `<div class="outfit-title">Today's Style</div>`;
      
      content += `<div class="outfit-content">${this.outfitData.recommendation}</div>`;
      
      if (this.config.showTimestamp) {
        content += `<div class="outfit-timestamp">Updated: ${new Date(this.outfitData.timestamp).toLocaleTimeString()}</div>`;
      }
      
      wrapper.innerHTML = content;
    }

    return wrapper;
  },

  getStyles() {
    return ["ai-outfit.css"];
  }
});
