const express = require('express');
const dataService = require('../services/dataService');

const router = express.Router();

// GET /api/daily-summary - Returns comprehensive daily data
router.get('/daily-summary', async (req, res) => {
  try {
    const { location } = req.query;
    const summary = await dataService.getDailySummary(location);
    res.json({
      ...summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Daily Summary Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch daily summary',
      message: error.message 
    });
  }
});

// GET /api/weather - Weather data only
router.get('/weather', async (req, res) => {
  try {
    const weather = await dataService.getWeather();
    res.json({
      weather,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Weather Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    });
  }
});







// GET /api/weather/location - Update weather location
router.get('/weather/location', async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }
    
    const weather = await dataService.getWeather(location);
    res.json({
      weather,
      location,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Weather Location Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather for location',
      message: error.message 
    });
  }
});

module.exports = router;
