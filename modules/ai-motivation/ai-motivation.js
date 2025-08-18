/* global Module, Log */

Module.register("ai-motivation", {
  defaults: {
    updateInterval: 600000, // 10 minutes
    apiEndpoint: "http://localhost:5000/api/ai/motivation",
    timeOfDay: "morning",
    mood: "neutral"
  },

  motivationData: null,

  start() {
    Log.info("Starting AI Motivation module");
    this.fetchMotivation();
    this.scheduleUpdate();
  },

  async fetchMotivation() {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeOfDay: this.getTimeOfDay(),
          mood: this.config.mood
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.motivationData = data;
      this.updateDom();
    } catch (error) {
      Log.error("Motivation fetch failed:", error);
      // Set error state so we can show it in the UI
      this.motivationData = {
        motivation: "Unable to connect to AI server",
        timeOfDay: this.getTimeOfDay(),
        timestamp: new Date().toISOString()
      };
      this.updateDom();
    }
  },

  scheduleUpdate() {
    setInterval(() => {
      this.fetchMotivation();
    }, this.config.updateInterval);
  },

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 5) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "ai-motivation";

    // Always show the header
    let content = '<div class="motivation-title">Daily Inspiration</div>';
    
    if (!this.motivationData) {
      content += '<div class="motivation-content">Loading AI motivation...</div>';
      content += '<div class="motivation-note">Backend server may not be running</div>';
    } else if (this.motivationData.motivation === "Unable to connect to AI server") {
      content += '<div class="motivation-content error">Unable to connect to AI server</div>';
      content += '<div class="motivation-note">Start backend server: npm run server</div>';
    } else {
      content += `<div class="motivation-content">${this.motivationData.motivation}</div>`;
      content += `<div class="motivation-timestamp">Updated: ${new Date(this.motivationData.timestamp).toLocaleTimeString()}</div>`;
    }

    wrapper.innerHTML = content;
    return wrapper;
  },

  getStyles() {
    return ["ai-motivation.css"];
  }
});
