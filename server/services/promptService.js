/**
 * Centralized prompt service for AI interactions
 * Eliminates duplicate prompts and provides consistent AI interactions
 */

class PromptService {
  /**
   * Generate outfit recommendation prompt
   * @param {Object} weatherData - Weather information
   * @param {number} weatherData.temperature - Temperature in Fahrenheit
   * @param {string} weatherData.condition - Weather condition
   * @param {number} weatherData.chanceOfRain - Chance of rain percentage
   * @param {string} weatherData.location - Location
   * @param {string} weatherData.timeOfDay - Time of day (morning/afternoon/evening/night)
   * @param {string} weatherData.recommendationType - Type of recommendation (current/tomorrow)
   * @param {Object} weatherData.forecast - Weather forecast for context
   * @returns {string} - Formatted prompt for AI
   */
  static generateOutfitRecommendationPrompt(weatherData) {
    const { 
      temperature, 
      condition, 
      weatherCode,
      chanceOfRain, 
      location, 
      timeOfDay,
      recommendationType,
      forecast,
      todayHigh,
      todayLow,
      humidity,
      windSpeed,
      windDirection,
      uvIndex,
      visibility,
      feelsLike,
      gender,
      missingData
    } = weatherData;
    
    let timeContext = '';
    let forecastContext = '';
    let severeWeatherAlert = '';
    let genderContext = '';
    let weatherContext = '';
    
    // Check for severe weather conditions based on weather code
    if (weatherCode) {
      const severeCodes = [95, 96, 99, 82, 75, 67]; // thunderstorm, violent rain, heavy snow, freezing rain
      if (severeCodes.includes(weatherCode)) {
        severeWeatherAlert = 'SEVERE WEATHER ALERT! ';
      }
    }
    
    // Gender context
    if (gender === "neutral") {
      genderContext = ' Use gender-neutral clothing terms (shirts, pants, coats, etc.) - avoid gender-specific items.';
    }
    
    // Weather context
    if (missingData && missingData.includes('weather')) {
      const currentMonth = new Date().getMonth();
      const season = currentMonth >= 2 && currentMonth <= 4 ? 'spring' : 
                    currentMonth >= 5 && currentMonth <= 7 ? 'summer' :
                    currentMonth >= 8 && currentMonth <= 10 ? 'fall' : 'winter';
      
      weatherContext = ` No weather data available. Base recommendation on ${season} season and current time of day.`;
    } else {
      weatherContext = ` Weather: ${temperature}°F${todayHigh ? ` (${todayLow}°F-${todayHigh}°F)` : ''}, ${condition}, ${chanceOfRain}% rain chance`;
    }
    
    // Time-based context
    switch (timeOfDay) {
      case 'morning':
        timeContext = 'morning outfit for the day ahead';
        break;
      case 'afternoon':
        timeContext = 'outfit for the rest of the day';
        break;
      case 'evening':
        timeContext = 'evening outfit';
        break;
      case 'night':
        if (recommendationType === 'tomorrow') {
          timeContext = 'outfit to prepare for tomorrow';
        } else {
          timeContext = 'evening wear';
        }
        break;
      default:
        timeContext = 'appropriate outfit for the current time';
    }
    
    // Add forecast context if available
    if (forecast && forecast.length > 0) {
      const tomorrow = forecast.find(day => day.day === 'Tomorrow');
      if (tomorrow) {
        forecastContext = ` Tomorrow: ${tomorrow.high}°F high, ${tomorrow.low}°F low, ${tomorrow.condition}.`;
      }
    }
    
    return `You are a smart mirror fashion advisor. Provide a ${timeContext} recommendation.${weatherContext}${forecastContext}${genderContext}

IMPORTANT: Follow this exact format and priority order:

1. SEVERE WEATHER ALERTS FIRST (if any): "${severeWeatherAlert}Severe Thunderstorms! Stay inside or gear up." or "High UV Alert! Sun protection essential." or "Air Quality Alert! Limit time outdoors."

2. ESSENTIAL ITEMS (if needed): "Bring an umbrella!" or "Put on your winter coat!" or "Grab sunglasses!"

3. MAIN OUTFIT: "Wear [specific items] today"

4. BRIEF REASONING: "it'll be [temperature/condition summary]"

Example good response: "Bring an umbrella! Wear jeans and a light jacket today - it'll be cool and rainy."

Example with alert: "High UV Alert! Wear sunscreen and a hat. Light shirt and shorts today - sunny and warm."

Keep under 60 words. Be direct and actionable. No greetings or fluff.`;
  }

  /**
   * Generate motivation prompt
   * @param {string} timeOfDay - Time of day (morning/afternoon/evening)
   * @param {string} mood - User's mood
   * @returns {string} - Formatted prompt for AI
   */
  static generateMotivationPrompt(timeOfDay = 'morning', mood = 'neutral') {
    return `You are a smart mirror motivation advisor. Provide a brief, direct ${timeOfDay} motivation message.

IMPORTANT RULES:
- NO greetings like "Hello radiant soul" or "Looking good!"
- NO introductory phrases
- Go straight to the wisdom/motivation
- Keep under 30 words
- Be direct and impactful
- Consider this is for a smart mirror display

Example good responses:
- "Every frustration is an opportunity to learn something new."
- "You will be stronger tomorrow than you are today."
- "Small actions create big changes. Your potential is limitless."

Example bad response: "Hello radiant soul! Looking good today! You're halfway through the week! Here's some wisdom for you..."

Focus on actionable wisdom, not fluff.`;
  }



}

module.exports = PromptService;
