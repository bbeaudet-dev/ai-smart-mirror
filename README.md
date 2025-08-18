# AI Smart Mirror

An intelligent smart mirror built on MagicMirror² that combines traditional smart mirror functionality with AI-powered features like outfit recommendations, motivational messages, and more.

## Features

### Core Smart Mirror Features
- **Clock & Date**: 12-hour format with AM/PM display
- **Weather**: Current conditions and forecasts with rounded temperatures
- **Calendar**: US Holidays and upcoming events
- **News Feed**: Latest headlines from New York Times
- **Compliments**: Daily positive messages

### AI-Powered Features
- **AI Motivation**: Personalized daily inspiration messages
- **AI Outfit Recommendations**: Weather-aware clothing suggestions
- **Smart Context**: Considers time of day, weather, and user preferences

## Quick Start

### Prerequisites
- Node.js 22.x or higher
- Raspberry Pi 5 (recommended) or any computer with display

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-smart-mirror
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy and edit environment files
   cp env.example .env
   cp server/env.example server/.env
   ```

4. **Start the backend server**
   ```bash
   cd server
   npm install
   npm start
   ```

5. **Start the smart mirror**
   ```bash
   # In a new terminal, from the root directory
   npm start
   ```

6. **Access your mirror**
   Open a web browser and go to: `http://localhost:8080`

## Configuration

### User Profile
Edit `config/config.js` to set your preferences:
```javascript
userProfile: {
  gender: "male", // "male", "female", "non-binary"
  location: "New York",
  stylePreferences: {
    weekday: "smart-casual",
    weekend: "casual",
    holiday: "festive"
  }
}
```

### Weather Location
Update the coordinates in `config/config.js`:
```javascript
lat: 40.776676, // Your latitude
lon: -73.971321, // Your longitude
```

### API Keys
Set up your `.env` files with:
- `OPENAI_API_KEY`: For AI features
- Weather API credentials (if needed)

## Project Structure

```
ai-smart-mirror/
├── config/           # MagicMirror configuration
├── modules/          # Custom AI modules
│   ├── ai-motivation/
│   └── ai-outfit/
├── server/           # Node.js backend API
├── docs/             # Documentation
└── public/           # Static assets
```

## AI Modules

### AI Motivation
- Provides daily inspirational messages
- Updates every minute
- Positioned at top center

### AI Outfit Recommendations
- Weather-aware clothing suggestions
- Considers user preferences and context
- Updates every 15 minutes
- Positioned at top right

## Development

### Adding New AI Modules
1. Create a new directory in `modules/`
2. Implement the module following MagicMirror² conventions
3. Add API endpoints in `server/routes/`
4. Update `config/config.js` to include the module

### Backend API
The Node.js server provides REST endpoints for AI features:
- `POST /api/ai/motivation` - Get motivational messages
- `POST /api/ai/outfit-recommendation` - Get outfit recommendations

## Raspberry Pi Setup

For detailed Raspberry Pi setup instructions, see [docs/PI-SETUP.md](docs/PI-SETUP.md).

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

This project is built on MagicMirror² and is licensed under the MIT License.
