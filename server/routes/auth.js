const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const CalendarService = require('../services/calendarService');

const router = express.Router();

// Persistent token storage file
const TOKENS_FILE = path.join(__dirname, '../data/tokens.json');

// Load stored tokens from file
let storedTokens = null;

const loadTokens = async () => {
  try {
    const data = await fs.readFile(TOKENS_FILE, 'utf8');
    storedTokens = JSON.parse(data);
    console.log('Loaded stored tokens');
  } catch (error) {
    console.log('No stored tokens found');
    storedTokens = null;
  }
};

const saveTokens = async (tokens) => {
  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(TOKENS_FILE), { recursive: true });
    await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));
    console.log('Saved tokens to file');
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

// Load tokens on startup
loadTokens();

// GET /api/auth/google - Start OAuth flow
router.get('/google', (req, res) => {
  try {
    const authUrl = CalendarService.generateAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
});

// GET /api/auth/google/callback - Handle OAuth callback
router.get('/google/callback', async (req, res) => {
  try {
    console.log('OAuth callback received:', req.query);
    console.log('Full URL:', req.url);
    console.log('Headers:', req.headers);
    
    const { code, error } = req.query;
    
    if (error) {
      console.error('OAuth error:', error);
      return res.redirect('http://localhost:3000?calendar=error&message=' + encodeURIComponent(error));
    }
    
    if (!code) {
      console.error('No authorization code received');
      return res.status(400).json({ error: 'Authorization code is required', query: req.query });
    }

    console.log('Authorization code received:', code);
    const tokens = await CalendarService.getTokensFromCode(code);
    console.log('Tokens received:', tokens ? 'success' : 'failed');
    
    storedTokens = tokens;
    
    // Save tokens to file
    await saveTokens(tokens);
    
    // Set credentials for future requests
    CalendarService.setCredentials(tokens);
    
    // Redirect back to the React app with success message
    res.redirect('http://localhost:3000?calendar=connected');
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    // Redirect back to the React app with error message
    res.redirect('http://localhost:3000?calendar=error&message=' + encodeURIComponent(error.message));
  }
});

// GET /api/auth/google/status - Check authentication status
router.get('/google/status', (req, res) => {
  res.json({ 
    authenticated: !!storedTokens,
    hasTokens: !!storedTokens
  });
});

// POST /api/auth/google/logout - Clear stored tokens
router.post('/google/logout', async (req, res) => {
  storedTokens = null;
  try {
    await fs.unlink(TOKENS_FILE);
  } catch (error) {
    // File doesn't exist, that's fine
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Helper function to get stored tokens
const getStoredTokens = () => storedTokens;

module.exports = { router, getStoredTokens };
