const express = require('express');
const CalendarService = require('../services/calendarService');
const { getStoredTokens } = require('./auth');

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  const tokens = getStoredTokens();
  if (!tokens) {
    return res.status(401).json({ 
      error: 'Not authenticated', 
      message: 'Please connect your Google Calendar first' 
    });
  }
  
  // Set credentials for this request
  CalendarService.setCredentials(tokens);
  next();
};

// GET /api/calendar/today - Get today's events
router.get('/today', requireAuth, async (req, res) => {
  try {
    const events = await CalendarService.getTodayEvents();
    res.json({
      events,
      count: events.length,
      date: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error fetching today\'s events:', error);
    res.status(500).json({ 
      error: 'Failed to fetch today\'s events',
      message: error.message 
    });
  }
});

// GET /api/calendar/next - Get next upcoming event
router.get('/next', requireAuth, async (req, res) => {
  try {
    const event = await CalendarService.getNextEvent();
    res.json({
      event,
      hasNextEvent: !!event
    });
  } catch (error) {
    console.error('Error fetching next event:', error);
    res.status(500).json({ 
      error: 'Failed to fetch next event',
      message: error.message 
    });
  }
});

// GET /api/calendar/upcoming - Get upcoming events
router.get('/upcoming', requireAuth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const events = await CalendarService.getUpcomingEvents(days);
    res.json({
      events,
      count: events.length,
      days
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ 
      error: 'Failed to fetch upcoming events',
      message: error.message 
    });
  }
});

// GET /api/calendar/summary - Get calendar summary
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const [todayEvents, nextEvent] = await Promise.all([
      CalendarService.getTodayEvents(),
      CalendarService.getNextEvent()
    ]);

    console.log('Today events:', todayEvents);
    console.log('Next event:', nextEvent);

    const now = new Date();
    const nextEventTime = nextEvent ? new Date(nextEvent.start) : null;
    const minutesUntilNext = nextEventTime ? 
      Math.round((nextEventTime - now) / (1000 * 60)) : null;

    const response = {
      todayEvents: todayEvents,
      todayCount: todayEvents.length,
      nextEvent: nextEvent ? {
        ...nextEvent,
        minutesUntil: minutesUntilNext
      } : null,
      hasNextEvent: !!nextEvent,
      summary: {
        todayEvents: todayEvents.length,
        nextEventIn: minutesUntilNext ? `${minutesUntilNext} minutes` : null
      }
    };

    console.log('Calendar summary response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error fetching calendar summary:', error);
    res.status(500).json({ 
      error: 'Failed to fetch calendar summary',
      message: error.message 
    });
  }
});

module.exports = router;
