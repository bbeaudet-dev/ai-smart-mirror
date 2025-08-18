# AI-Powered Smart Mirror - Capstone Proposal

## Project Description

This smart mirror serves as your hub for morning and evening routines, displaying contextual information by integrating with Google Calendar, weather, Co-Star, news; utilizing OpenAI API integration, this context/data is used to provide daily/nightly outfit recommendations, horoscopes and motivational messages, news and calendar summaries, and much more. Using a built-in webcam/microphone/speaker, the smart mirror uses object detection to, for example, tell you how good your outfit looks today, or if you need to change into something more professional for an upcoming interview on your calendar!

The core system uses a Raspberry Pi single-board CPU, a 2K monitor, and a two-way mirror.

## Core Features

### Information Display System

- Time-Based Content & Routines: Automatic morning vs evening displays with visual checklists and reminders based on time of day.
- Weather Integration: Current conditions with outfit recommendations catered to time of day (e.g. suggests outfit for the next day if it’s late at night)
- Calendar Preview: Daily events with reminders and recommendations
- Daily Content: Horoscope, news summaries, motivational content

### Advanced Features (Stretch Goals)

- AI Recommendations: Contextual outfit and preparation suggestions based on weather, calendar, and personal preferences
- Tamagotchi Integration: Work with Eric to get interactive pet working with smart mirror display
- Device Interaction: Voice control, physical buttons, or mobile app for hands-free management
- Advanced Configuration: Custom routine builder, personalized content curation, and user preferences

## Technical Implementation

### Hardware Stack

- Raspberry Pi 4 (4GB RAM) with ARZOPA 16" 2.5K portable monitor
- Two-way mirror overlay and custom frame
- Speakers integrated into frame (stretch goal)
- Camera module for object detection and interaction features (advanced stretch goal)

### Software Architecture

- Frontend: React for mirror display with smooth animations
- Backend: Node.js server on Pi managing data aggregation and synchronization
- API Integrations: Google Calendar, weather services, Co-Star, news APIs
- AI Integration: OpenAI API for contextual reasoning
- Mobile App: React Native companion app for setup and interaction (stretch goal)

### System Architecture

#### The Flow:

- Monitor & Raspberry Pi use USB-C for power and video I/O
- Raspberry Pi runs a Node.js web server to handle data storage and API calls
- Raspberry Pi serves React app to monitor
- Mobile App connects to Pi via WiFi for real-time communication
- Power source provides 30W+ continuous power

#### System Communication:

- Pi ↔ Internet: WiFi for API calls
- Pi ↔ Mobile App: Local WiFi network
- Pi ↔ Display: HDMI cable

## Scope

### In Scope (2 weeks)

- Raspberry Pi-powered display system with time- and context-based content
- API integrations for weather, calendar, horoscope, news, and more
- Visually appealing and simple web interface optimized for display
- Two-way mirror and frame construction

### Stretch Goals

- OpenAI API integration for real-time contextual content and recommendations
- Device interaction through voice control, buttons, or mobile app
- Advanced configuration and customization features

### Out of Scope

- Complex interaction systems
- Health monitoring and analysis
- Extensive customization beyond basic preferences
- Visually stunning frontend UI

### Development Phases

- Phase 1: Get Raspberry Pi displaying basic React web app on monitor
- Phase 2: Create simple UI and logic to display contextual data
- Phase 3: API integrations for weather, calendar, and news data
- Phase 4: OpenAI API integration with real-time recommendations/content
- Phase 5: Simple two-way mirror integration
- Phase 6: Camera/speaker integration and object-based detection
- Phase 7: AI-powered object-detection-based recommendations/content
- Phase 8: Custom frame construction/assembly

## Challenges & Solutions

### API Integration Complexity

- Challenge: Coordinating multiple third-party APIs with different authentication methods and data formats
- Solution: Modular architecture with robust error handling and graceful degradation when services are unavailable

### Hardware Integration

- Challenge: Coordinating Pi, display, and two-way mirror construction while ensuring reliable system performance
- Solution: Phased development approach, clear hardware interfaces, and comprehensive testing protocols

### Visual Design & Mirror Interface

- Challenge: Creating an appealing UI optimized for mirror viewing and ensuring proper two-way mirror functionality
- Solution: Design specifically for 16" display, test visibility through mirror material, and focus on high contrast elements

### User Interaction Implementation

- Challenge: Adding reliable voice control, mobile app communication, or physical input methods
- Solution: Start with display-only system, then layer interaction features as stretch goals with fallback options

## References & Inspiration

- Beauty and the Beast dresser
- Sleeping Beauty mirror

- Building a Smart Mirror Tutorial
- Smart Mirror Showcase
- DIY Smart Mirror
- Sophia’s Capstone project

 Electron app - possibly for video capture?
- Tote app - provides smart, personalized outfit recommendations

## Demo Plan

### Opening:

"Personally, I'm terrible at creating and maintaining routines, getting up in the morning and going to bed at night, and organizing my day. However, these things are crucial: a disorganized morning can sink your whole day, and a disorganized evening can kill your entire NEXT day. How many of you can relate?"

### Live Demo:

- Opening & Introduction: "Personally, I'm terrible at creating and maintaining routines, getting up in the morning and going to bed at night, and organizing my day. However, these things are crucial: a disorganized morning can sink your whole day, and a disorganized evening can kill your entire NEXT day. How many of you can relate?"
- Bootup Sequence: Show the mirror powering on with smooth loading animation
- Morning Display: Time-based content showing weather, calendar, routine checklist, horoscope
- API Integration: Demonstrate real-time weather data, actual calendar events, live news updates
- Evening Display: Show transition to evening content with next-day preparation
- Advanced Features: Demo any interactive features achieved (voice, mobile app, AI recommendations)
- Hardware/Technical Explanation: Walk through the Raspberry Pi, monitor, mirror construction, API integrations, and development challenges
- Future Plans: Discuss next steps for enhanced interaction and features
- Impact: Creates structure and reduces daily decision fatigue for routine management

### Updated Demo Plan:

Are you a consumer hardware founder? Or the guy that put Tetris on a smart mirror? What’s important is partially the story/pitch and the energy/vibe you’re giving - “I want you to be impressed by me” vs. “I want this to be a successful product”. Starting the demo with “I had this problem so I built this thing” positions it (in the mind of the audience) as a product that you want to take to market, and so you will instantly be compared to all other solutions in the market right now. Compare that to starting the demo with “I was inspired by the wardrobe from beauty and the beast and I wanted to bring that to life with AI, providing a physical interface for humans to interact with AI, which is still very new right now”, which positions you more as “likes building cool things and was able to actually bring this thing that does NOT exist before to life! I’d hire that guy to do anything!”

5 minute demo, does not need to be perfect/complete. You are not building a complete product. You can hack things. Pick an intent or category that you think you can nail and spend your time nailing it. “I wanted to make the wardrobe from beauty and the beast”.

Be cautious of the “AI comments on your outfit from video footage” route, might not be achievable in 2 weeks. The “interactive” aspect doesn’t need to be the main value-add here, although some kind of interactive AI WOULD be something that doesn’t really exist out there. From one perspective, it’s okay if you build something that has already been made. From the other perspective, the interaction with some kind of AI seems to be a major area of engagement/excitement from the demo, and people would love to see that.
