# Data Flow Architecture

## Module Communication Flow

```mermaid
graph TD
    A[Weather Module] -->|WEATHER_UPDATED| B[AI Outfit Module]
    A -->|WEATHER_UPDATED| C[AI Motivation Module]
    D[Clock Module] -->|CLOCK_MINUTE| E[All Modules]
    F[Calendar Module] -->|CALENDAR_EVENTS| A
    G[User Profile Config] --> B
    G --> C

    H[OpenAI API] --> B
    H --> C

    I[Weather API] --> A
    J[Calendar API] --> F

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#f3e5f5
    style G fill:#fff3e0
    style H fill:#e8f5e8
```

## Module Dependency Chain

```mermaid
graph LR
    A[User Profile Config] --> B[AI Modules]
    C[Weather API] --> D[Weather Module]
    D -->|WEATHER_UPDATED| B
    E[Calendar API] --> F[Calendar Module]
    F -->|CALENDAR_EVENTS| D
    G[Clock Module] -->|CLOCK_MINUTE| H[All Modules]
    I[OpenAI API] --> J[Backend Server]
    J --> B

    subgraph "Data Flow"
        K[User Profile] --> L[Personalization]
        M[Weather Data] --> N[Outfit Context]
        O[Calendar Events] --> P[Location Context]
        Q[Time of Day] --> R[Mood/Context]
    end

    L --> B
    N --> B
    P --> D
    R --> B

    style A fill:#fff3e0
    style B fill:#f3e5f5
    style D fill:#e1f5fe
    style F fill:#e8f5e8
    style G fill:#fff8e1
    style J fill:#e8f5e8
    style K fill:#fff3e0
    style M fill:#e1f5fe
    style O fill:#e8f5e8
    style Q fill:#fff8e1
```

## Data Timing and Triggers

```mermaid
sequenceDiagram
    participant WM as Weather Module
    participant AIO as AI Outfit Module
    participant AIM as AI Motivation Module
    participant API as OpenAI API

    WM->>API: Fetch weather data
    API-->>WM: Return weather data
    WM->>AIO: WEATHER_UPDATED notification
    WM->>AIM: WEATHER_UPDATED notification
    AIO->>API: Request outfit recommendation
    AIM->>API: Request motivation message
    API-->>AIO: Return outfit recommendation
    API-->>AIM: Return motivation message
    AIO->>AIO: Update display
    AIM->>AIM: Update display
```

## Error Handling and Fallbacks

```mermaid
graph TD
    A[Check User Profile] --> B{Gender Available?}
    B -->|Yes| C[Use gender-specific prompts]
    B -->|No| D[Use gender-neutral prompts]
    C --> E[Send to OpenAI]
    D --> E
    E --> F{Weather Available?}
    F -->|Yes| G[Include weather context]
    F -->|No| H[Use seasonal context]
    G --> I[Display AI recommendation]
    H --> J["Display AI recommendation<br/>+ Weather note"]
    D --> K["Display AI recommendation<br/>+ Profile note"]

    style A fill:#fff3e0
    style E fill:#e8f5e8
    style I fill:#e8f5e8
    style J fill:#fff3e0
    style K fill:#fff3e0
```

## Error Recovery Flow

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type?}
    B -->|Network/Server| C[Retry Logic]
    B -->|Missing Data| D[Use Fallbacks]
    B -->|API Error| E[Show Error Message]
    B -->|Authentication| F[Check API Keys]
    B -->|Rate Limit| G[Wait & Retry]
    B -->|Invalid Config| H[Use Defaults]

    C --> I{Retry Success?}
    I -->|Yes| J[Continue Normal Flow]
    I -->|No| K[Show Connection Error]

    D --> L[Display with Warning]
    E --> M[Show Specific Error]
    F --> N[Check .env files]
    G --> O[Implement Backoff]
    H --> P[Load Default Config]

    N --> Q{Keys Valid?}
    Q -->|Yes| J
    Q -->|No| R[Show Setup Guide]

    style A fill:#ffebee
    style J fill:#e8f5e8
    style L fill:#fff3e0
    style M fill:#ffebee
    style R fill:#ffebee
```

## Configuration Flow

```mermaid
graph TD
    A[config.js] --> B[Module Configs]
    A --> C[User Profile]
    A --> D[API Endpoints]
    A --> E[Display Settings]

    B --> F[Module Initialization]
    C --> G[AI Personalization]
    D --> H[Backend Communication]
    E --> I[UI Layout]

    F --> J[Module Behavior]
    G --> J
    H --> J
    I --> J

    subgraph "Environment Variables"
        K[Root .env] --> L[MagicMirror² Config]
        M[Server .env] --> N[API Keys & Secrets]
    end

    L --> A
    N --> H

    subgraph "User Preferences"
        O[Gender] --> C
        P[Style Preferences] --> C
        Q[Location] --> C
        R[Calendar Settings] --> C
    end

    style A fill:#fff3e0
    style C fill:#e8f5e8
    style D fill:#e1f5fe
    style K fill:#fff3e0
    style M fill:#e8f5e8
    style O fill:#f3e5f5
    style P fill:#f3e5f5
    style Q fill:#f3e5f5
    style R fill:#f3e5f5
```

## User Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant Mirror
    participant Weather
    participant AI
    participant Backend

    User->>Mirror: Approaches mirror
    Mirror->>Weather: Request weather data
    Weather->>Mirror: Return weather
    Mirror->>AI: Trigger outfit recommendation
    AI->>Backend: Request AI recommendation
    Backend->>AI: Return recommendation
    AI->>Mirror: Display recommendation
    Mirror->>User: Show updated display

    Note over User,Mirror: Weather updates trigger<br/>automatic outfit refresh
    Weather->>AI: WEATHER_UPDATED notification
    AI->>Backend: Request updated recommendation
    Backend->>AI: Return new recommendation
    AI->>Mirror: Update display
```

## Module Lifecycle

```mermaid
graph TD
    A[Module Start] --> B[Initialize]
    B --> C[Fetch Initial Data]
    C --> D[Display Loading]
    D --> E{Data Available?}
    E -->|Yes| F[Display Content]
    E -->|No| G[Display Error/Fallback]
    F --> H[Schedule Updates]
    G --> H
    H --> I[Listen for Notifications]
    I --> J[Data Changed?]
    J -->|Yes| C
    J -->|No| K[Wait for Next Update]
    K --> J

    subgraph "Error Handling"
        L[Network Error] --> M[Retry Logic]
        N[Missing Data] --> O[Use Fallbacks]
        P[API Error] --> Q[Show Error Message]
    end

    E --> L
    E --> N
    E --> P

    style A fill:#e3f2fd
    style F fill:#e8f5e8
    style G fill:#fff3e0
    style L fill:#ffebee
    style N fill:#fff3e0
    style P fill:#ffebee
```
