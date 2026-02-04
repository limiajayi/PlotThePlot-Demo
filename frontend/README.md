# PlotThePlot FrontEnd 🖼️📊

A React + TypeScript + Vite for managing how ratings, users and media is handled by the PlotThePlot application.

## 📁  Project Structure

Planned structure for the frontend -

```
src/
├── components/
│   ├── rating/
│   │   ├── RatingGraph.tsx          # D3 scatter plot
│   │   ├── RatingForm.tsx           # Multi-step rating creation
│   │   ├── RatingCard.tsx           # Individual rating display
│   │   └── RatingList.tsx           # Grid view of ratings
│   ├── media/
│   │   ├── MediaSearch.tsx          # Search bar/input
│   │   ├── MediaCard.tsx            # Display media info
│   │   └── MediaSelector.tsx        # Type dropdown (movie/book/show)
│   ├── layout/
│   │   ├── Header.tsx               # App header/nav
│   │   ├── Dashboard.tsx            # Main dashboard layout
│   │   └── Sidebar.tsx              # Navigation sidebar (if needed)
│   └── common/
│       ├── Button.tsx               # Reusable button
│       ├── Input.tsx                # Form inputs
│       └── Loading.tsx              # Loading spinner
├── types/
│   ├── index.ts                     # Export all types
│   ├── rating.types.ts              # Rating-related interfaces
│   ├── media.types.ts               # Media interfaces
│   └── user.types.ts                # User interfaces
├── api/
│   ├── client.ts                    # Base API client (fetch wrapper)
│   ├── ratings.ts                   # Rating API calls
│   ├── media.ts                     # Media API calls
│   └── users.ts                     # User API calls
├── hooks/
│   ├── useRatings.ts                # Custom hook for rating data
│   ├── useAuth.ts                   # Auth state (Phase 2)
│   └── useMediaSearch.ts            # Media search logic
├── utils/
│   ├── coordinateHelpers.ts         # Convert pixels to coordinates
│   ├── dateHelpers.ts               # Format dates
│   └── quadrantHelpers.ts           # Determine which quadrant
├── pages/
│   ├── HomePage.tsx                 # Landing/dashboard
│   ├── RatePage.tsx                 # Create new rating
│   └── ProfilePage.tsx              # View all your ratings
├── App.tsx
├── main.tsx
└── styles/
    └── global.css
```

Structure may end up being more complicated / simpler than this.

## Get Structure 

### Installation
```bash
cd frontend
npm install
```

### Running the server
```bash
npm run dev
```

The server will start from `http://localhost:5174/`

## Current Status ✈️
- Wiring up POST methods with the frontend