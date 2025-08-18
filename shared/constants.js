// API Endpoints
const API_ENDPOINTS = {
  // Data endpoints
  DAILY_SUMMARY: '/api/daily-summary',
  WEATHER: '/api/weather',
  CALENDAR: '/api/calendar',
  ROUTINE: '/api/routine',
  NEWS: '/api/news',
  HOROSCOPE: '/api/horoscope',
  OUTFIT_SUGGESTION: '/api/outfit-suggestion',
  
  // AI endpoints
  AI_CHAT: '/api/ai/chat',

  AI_MOTIVATION: '/api/ai/motivation',
  AI_ANALYZE_IMAGE: '/api/ai/analyze-image',
  
  // System endpoints
  HEALTH: '/api/health'
};

// Time-based routine periods
const ROUTINE_PERIODS = {
  MORNING: {
    start: 6,
    end: 11,
    name: 'morning'
  },
  EVENING: {
    start: 19,
    end: 23,
    name: 'evening'
  }
};



// News categories and their colors
const NEWS_CATEGORIES = {
  technology: '#74b9ff',
  business: '#00b894',
  science: '#fd79a8',
  environment: '#fdcb6e',
  health: '#a29bfe',
  sports: '#fd79a8',
  entertainment: '#fdcb6e'
};

// Smart mirror personality contexts
const AI_CONTEXTS = {
  SMART_MIRROR: 'smart-mirror',
  MOTIVATION: 'motivation',
  OUTFIT_ANALYSIS: 'outfit-analysis',
  OUTFIT_RECOMMENDATION: 'outfit-recommendation'
};

// File upload limits
const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
};

// Development configuration
const DEV_CONFIG = {
  CLIENT_PORT: 3000,
  SERVER_PORT: 5000,
  CLIENT_URL: 'http://localhost:3000',
  SERVER_URL: 'http://localhost:5000'
};

module.exports = {
  API_ENDPOINTS,
  ROUTINE_PERIODS,
  NEWS_CATEGORIES,
  AI_CONTEXTS,
  DEV_CONFIG
};
