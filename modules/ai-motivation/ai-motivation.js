/* global Module, Log */

Module.register("ai-motivation", {
  defaults: {
    updateInterval: 600000, // 10 minutes
    apiEndpoint: "http://localhost:5001/api/ai/motivation",
    timeOfDay: "morning",
    mood: "neutral",
    showTimestamp: false
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
      // Don't show anything if we can't get real data
      this.motivationData = null;
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

    if (!this.motivationData) {
      wrapper.innerHTML = `
        <div class="motivation-title">Daily Inspiration</div>
        <div class="motivation-content">Loading...</div>
      `;
    } else {
      let content = `<div class="motivation-title">Daily Inspiration</div>`;
      content += `<div class="motivation-content">${this.motivationData.motivation}</div>`;
      
      if (this.config.showTimestamp) {
        content += `<div class="motivation-timestamp">Updated: ${new Date(this.motivationData.timestamp).toLocaleTimeString()}</div>`;
      }
      
      wrapper.innerHTML = content;
    }

    return wrapper;
  },

  getStyles() {
    return ["ai-motivation.css"];
  }
});
