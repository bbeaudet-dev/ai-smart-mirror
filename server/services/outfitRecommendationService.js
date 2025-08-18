/**
 * Outfit Recommendation Service for Smart Mirror
 * Handles time-based outfit recommendation logic
 */

class OutfitRecommendationService {
  /**
   * Get current time of day based on hour
   * @param {number} hour - Hour of day (0-23)
   * @returns {string} - Time of day (morning/afternoon/evening/night)
   */
  static getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 17) {
      return 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'evening';
    } else {
      return 'night';
    }
  }

  /**
   * Get current time of day
   * @returns {string} - Time of day (morning/afternoon/evening/night)
   */
  static getCurrentTimeOfDay() {
    const hour = new Date().getHours();
    return this.getTimeOfDay(hour);
  }

  /**
   * Determine if we should recommend tomorrow's outfit
   * @param {number} hour - Current hour
   * @returns {boolean} - True if we should recommend for tomorrow
   */
  static shouldRecommendForTomorrow(hour) {
    // After 8 PM, start recommending for tomorrow
    return hour >= 20;
  }

  /**
   * Get recommendation type based on current time
   * @param {number} hour - Current hour
   * @returns {string} - 'current' or 'tomorrow'
   */
  static getRecommendationType(hour) {
    return this.shouldRecommendForTomorrow(hour) ? 'tomorrow' : 'current';
  }

  /**
   * Get weather data for the appropriate time period
   * @param {Object} weatherData - Full weather data from WeatherAPI
   * @param {string} recommendationType - 'current' or 'tomorrow'
   * @returns {Object} - Weather data for the recommendation
   */
  static getWeatherForRecommendation(weatherData, recommendationType) {
    if (recommendationType === 'tomorrow' && weatherData.forecast && weatherData.forecast.length > 0) {
      // Use tomorrow's forecast data
      const tomorrow = weatherData.forecast.find(day => day.day === 'Tomorrow');
      if (tomorrow) {
        return {
          temperature: tomorrow.high, // Use high temp for day outfit
          condition: tomorrow.condition,
          chanceOfRain: tomorrow.chanceOfRain,
          location: weatherData.location,
          timeOfDay: 'morning', // Assume morning outfit for tomorrow
          recommendationType: 'tomorrow',
          forecast: weatherData.forecast
        };
      }
    }
    
    // Use current weather data with today's forecast context
    const today = weatherData.forecast.find(day => day.day === 'Today');
    return {
      temperature: weatherData.current.temperature,
      condition: weatherData.current.condition,
      chanceOfRain: today?.chanceOfRain,
      location: weatherData.location,
      timeOfDay: this.getCurrentTimeOfDay(),
      recommendationType: 'current',
      forecast: weatherData.forecast,
      todayHigh: today?.high,
      todayLow: today?.low,
      // Enhanced weather data
      humidity: weatherData.current.humidity,
      windSpeed: weatherData.current.windSpeed,
      windDirection: weatherData.current.windDirection,
      uvIndex: weatherData.current.uvIndex,
      visibility: weatherData.current.visibility,
      feelsLike: weatherData.current.feelsLike,
      pressure: weatherData.current.pressure,
      gustSpeed: weatherData.current.gustSpeed,
      cloudCover: weatherData.current.cloudCover,
      dewPoint: weatherData.current.dewPoint
    };
  }

  /**
   * Get location from browser geolocation (client-side)
   * This is a helper function for the client to use
   * @returns {Promise<Object>} - Location data
   */
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Convert coordinates to location string
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {string} - Location string for weather API
   */
  static coordinatesToLocation(latitude, longitude) {
    return `${latitude},${longitude}`;
  }
}

module.exports = OutfitRecommendationService;
