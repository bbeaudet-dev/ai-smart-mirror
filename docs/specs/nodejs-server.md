Restructure this React project into a full-stack application with client/server architecture for a smart mirror with AI integration.

CURRENT STATE: Basic React app in root directory
TARGET: Monorepo with separate client and server

REPOSITORY STRUCTURE:
Create this folder structure:
smart-mirror/
├── client/ (Move existing React app here)
│ ├── src/
│ │ ├── components/
│ │ ├── services/
│ │ └── App.js
│ ├── package.json
│ └── public/
├── server/ (New Node.js server)
│ ├── routes/
│ │ ├── ai.js
│ │ └── api.js
│ ├── services/
│ │ ├── openai.js
│ │ └── mockData.js
│ ├── server.js
│ ├── package.json
│ └── .env
├── shared/ (Common utilities)
│ ├── constants.js
│ └── mockData.json
└── package.json (Root package.json for managing both)

SERVER REQUIREMENTS:

- Express.js server with CORS enabled
- Environment variable support (.env file)
- Routes for:

  - GET /api/daily-summary (returns mock weather/calendar data, etc.)
  - POST /api/ai-chat (general AI interaction endpoint)
  - POST /api/analyze-image (accepts image, calls OpenAI Vision API)
  - GET /api/health (health check)

- OpenAI INTEGRATION

  - Set up flexible OpenAI service that can handle:
  - Text-based AI conversations (GPT-4)
  - Image analysis (Vision API)
  - Configurable prompts for different mirror interactions
  - Smart mirror personality/context in responses

- MOCK DATA SERVICE:
  - Weather data (temperature, conditions, outfit suggestions)
  - Calendar events
  - Morning/evening routines
  - News headlines

CLIENT UPDATES:

- API client service for server communication
- Components for displaying AI responses
- Development vs production environment handling

DEVELOPMENT WORKFLOW:

- Root package.json should have scripts to run both client and server
- Client runs on port 3000, server on port 5000
- Server serves static client files in production
- Hot reloading for both during development

Focus on creating a flexible foundation that can support various AI interactions rather than specific use cases.
