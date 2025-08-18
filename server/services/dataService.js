

// Import real weather service
const WeatherService = require('./weatherService');
const weatherService = new WeatherService();

class MockDataService {
  /**
   * Get comprehensive daily summary
   * @param {string} location - Optional location override
   * @returns {Promise<Object>} - Complete daily data
   */
  static async getDailySummary(location) {
    let weather = null;
    let outfitSuggestion = null;
    
    try {
      // Get real weather data
      weather = await weatherService.getWeatherData(location);
      
      // Get AI-generated outfit recommendation
      try {
        const OpenAIService = require('./openai');
        const PromptService = require('./promptService');
        const OutfitRecommendationService = require('./outfitRecommendationService');
        
        const currentHour = new Date().getHours();
        const recommendationType = OutfitRecommendationService.getRecommendationType(currentHour);
        const timeOfDay = OutfitRecommendationService.getCurrentTimeOfDay();
        
        const weatherForRecommendation = OutfitRecommendationService.getWeatherForRecommendation(weather, recommendationType);
        
        const prompt = PromptService.generateOutfitRecommendationPrompt(weatherForRecommendation);

        outfitSuggestion = await OpenAIService.chat(prompt, 'outfit-recommendation');
      } catch (aiError) {
        console.error('AI outfit recommendation failed:', aiError.message);
        outfitSuggestion = 'Unable to generate outfit recommendation';
      }
    } catch (error) {
      console.error('Weather data unavailable:', error.message);
      weather = {
        error: true,
        message: 'Weather data unavailable',
        current: {
          temperature: null,
          condition: 'Unknown',
          icon: '❓'
        },
        forecast: [],
        location: location || 'Unknown',
        lastUpdated: new Date().toISOString()
      };
      outfitSuggestion = 'Weather data unavailable for outfit recommendations';
    }
    
    return {
      weather: weather,
      outfitSuggestion: outfitSuggestion
    };
  }

  /**
   * Get weather data
   * @param {string} location - Optional location override
   * @returns {Promise<Object>} - Weather information
   */
  static async getWeather(location) {
    try {
      return await weatherService.getWeatherData(location);
    } catch (error) {
      console.error('Weather data unavailable:', error.message);
      return {
        error: true,
        message: 'Weather data unavailable',
        current: {
          temperature: null,
          condition: 'Unknown',
          icon: '❓'
        },
        forecast: [],
        location: location || 'Unknown',
        lastUpdated: new Date().toISOString()
      };
    }
  }









  /**
   * Get system status
   * @returns {Promise<Object>} - System status information
   */
  static async getSystemStatus() {
    return {
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };
  }
}

module.exports = MockDataService;
