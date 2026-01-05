# PlotThePlot Backend 🛠️🎬

A Node.js/Express API for managing media, users, and ratings for the PlotThePlot application.

## 📁 Project Structure

```
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

## API Endpoints

###  Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
- `GET /api/users/:id/ratings` - Get ratings for a user

### 🎦 Media
- `GET /api/media` - Get all media
- `GET /api/media/:id` - Get a specific media
- `POST /api/media` - Create new media
- `PUT /api/media/:id` - Update media
- `GET /api/media/:id/ratings` - Get ratings for media

### 🪄 Ratings
- `GET /api/users/:userId/ratings` - Get user's ratings
- `PUT /api/users/:userId/ratings/:ratingId` - Update a rating

## Current Status
- Using dummy in-memory data (will migrate to database)
- All endpoints return JSON
- Basic validation implemented for required fields

## Middleware
- `express.json()` - Parse JSON request bodies
- `requestLogger` - Logs all incoming requests (method, path, body)

## Next Steps
- [ ] Finish Phase 1 Endpoints
- [ ] Migrate to database (MongoDB/PostgreSQL)
- [ ] Add authentication/authorization
- [ ] Add pagination to list endpoints
- [ ] Add search/filter functionality
