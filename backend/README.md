# PlotThePlot Backend 🛠️🎬

A Node.js/Express API for managing media, users, and ratings for the PlotThePlot application.

## 📁 Project Structure

```text
backend/
├── index.js              # Main Express app & server setup
├── package.json          # Project dependencies
├── data/                 # Data storage (dummy data for now)
│   ├── users.js
│   ├── media.js
│   └── ratings.js
└── routes/              # API route handlers
    ├── users.js         # User endpoints
    ├── media.js         # Media endpoints
    ├── mediaSearch.js   # Media Search Endpoints
    └── ratings.js       # Ratings/Plots endpoints
```

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📝 API Endpoints Documentation

### 👥 Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `DELETE /api/users/:id` - Delete a user

### 🎦 Media

- `GET /api/media` - Get all media
- `GET /api/media/:id/ratings` - Get ratings for media

### 🪄 Ratings

- `GET /api/users/:userId/ratings` - Get user's ratings
- `POST /api/users/:userId/ratings` - Creates a new rating
- `PUT /api/users/:userId/ratings/:ratingId` - Update a rating
- `DELETE /api/users/:userId/ratings/:ratingId` - Deletes a rating

## Middleware

- `express.json()` - Parse JSON request bodies
- `requestLogger` - Logs all incoming requests (header, method, path, body)
- `requireAuth` - Checks if a supabase authorisation token exists in the header of an incoming request

## Current Status

- Using data from Supabase
- Authorisation checks for actions on a user's ratings

## Next Steps

- [ ] Start Phase 2 endpoints
