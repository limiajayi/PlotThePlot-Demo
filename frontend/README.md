# PlotThePlot FrontEnd 🖼️📊

A React + TypeScript + Vite for managing how ratings, users and media is handled by the PlotThePlot application.

## 📁  Project Structure

Current structure for the frontend -

```text
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
│   ├── context/
│   │   ├── useAuth.tsx                   # Auth state hook
│   │   ├── AuthProvider.tsx              # Defines Auth actions
│   │   └── AuthContext.tsx               # Context for Auth actions
    ├── pages/
│   │   ├── HomePage.tsx                 # Landing/dashboard
│   │   ├── LoginPage.tsx                # Login to PTP
│   │   ├── SignUpPage.tsx               # Sign up to PTP
│   │   ├── SettingsPage.tsx             # Change User info
│   │   └── ProfilePage.tsx              # View all your ratings
│   ├── common/
│   │   └── PasswordConfirmModal.tsx # Entering and confirming user's password
├── types/
│   ├── rating.types.ts              # Rating-related interfaces
│   ├── media.types.ts               # Media interfaces
│   └── user.types.ts                # User interfaces
├── api/
│   ├── client.ts                    # Base API client (fetch wrapper)
│   ├── ratings.ts                   # Rating API calls
│   ├── mediaSearch.ts               # Media Search API calls
│   └── users.ts                     # User API calls
├── hooks/
│   ├── useApi.ts                    # Custom hook for calling the backend
│   ├── useRatings.ts                # Custom hook for rating data
│   └── useMediaSearch.ts            # Media search logic
├── utils/
│   └── helpers.ts                   # Quadrant and media helpers
├── App.tsx
├── main.tsx
└── styles/
    └── ...
```

### Installation

```bash
cd frontend
npm install
```

### Running the server

```bash
npm run dev
```

The server will start from `http://localhost:5173/`

## Current Status ✈️

- GET, POST, PUT, DELETE for ratings done
- Ratings filtering done
- Services Layer done

## Next Steps

- [ ] Forms for accessibility
- [ ] Style settings, login and sign up pages
- [ ] Create and style home page
- [ ] Sanitise all user input
- [ ] Dark mode