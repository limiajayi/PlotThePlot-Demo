# PlotThePlot 📊🎬

> A media rating platform that captures the complexity of how we actually experience art and stories.

![A two-dimensional scatter plot showing movies and books positioned on an X-Y coordinate grid. The horizontal axis represents quality, while the vertical axis represents personal enjoyment. Various media titles are plotted as points across the graph, with some clustered in the upper right quadrant (high quality, high enjoyment) and others scattered throughout other regions.](/assets/PTP-1.png)

![The same two dimensional scatter plot showing more movies and books on an X-Y coordinate grid.](/assets/PTP-2.png)

## 🌟 What is PlotThePlot?

Traditional rating systems force us to collapse complex feelings into oversimplified metrics (⭐⭐⭐⭐). PlotThePlot uses a **two-dimensional coordinate system** that separates "quality" from "personal enjoyment":

- **X-axis**: Bad (-1) ←→ Good (+1)
- **Y-axis**: Didn't Like It (-1) ←→ Liked It (+1)

This creates four quadrants:
- **Amazing Media** (good + liked): Masterpieces you genuinely love.
- **Guilty Pleasure** (bad + liked): Objectively flawed in every way but you enjoy them anyway.
- **Good, But Not For Me** (good + didn't like): Technically excellent but didn't connect.
- **Don't Touch** (bad + didn't like): Neither well-made nor enjoyable.

![An illustration of the PlotThePlot rating system divided into four quadrants. The horizontal axis ranges from Bad on the left to Good on the right. The vertical axis ranges from Didn't Like It at the bottom to Liked It at the top. The four quadrants are labeled: Amazing Media in the upper right (good and liked), Guilty Pleasure in the upper left (bad but liked), Good But Not For Me in the lower right (good but didn't like), and Don't Touch in the lower left (bad and didn't like). Each quadrant is color-coded and includes representative media examples. The overall tone is informative and encouraging, presenting the coordinate system as a nuanced alternative to traditional star ratings.](/assets/PTP-3.png)


## ✨ Key Features

### Currently Developing (Phase 1)
- 📍 **Interactive Coordinate Rating System**: Click to place your rating on the 2D graph
- 📊 **Beautiful D3.js Visualizations**: See your entire media consumption mapped visually
- 🎯 **Context Capture**: Record why you rated something and what circumstances influenced your experience
- 🔄 **Multiple View Modes**: Toggle between scatter plot and grid views
- ♿ **Accessible Design**: Simple slider mode for users who prefer not to use coordinate clicking
- 📱 **Responsive Design**: Optimized for desktop with mobile support

### Coming Soon (Phase 2)
- 👥 Social features and friend comparisons
- 📈 Aggregate coordinates showing community consensus
- 🔍 Media search and discovery
- 🪄 Separate plots based on media type (books, shows, movies, etc)
- 🎭 Rewatch tracking to see how opinions evolve

## 🚀 Quick Start

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/limiajayi/PlotThePlot-Demo.git

# Navigate to project directory
cd PlotThePlot-Demo

# Install dependencies for backend
cd backend
npm install

# Install dependencies for frontend
cd frontend
npm install

# Start the mock API server (in one terminal)
npm run dev

# Start the development server (in another terminal)
npm run dev
```

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **D3.js** for interactive data visualizations
- **React Router** for navigation
- **CSS Modules** for styling (considering Tailwind)

### Backend (Planned - Production)
- **Node.js** with Express.js
- **PostgreSQL** for data persistence
- **Supabase** or similar for authentication and real-time features

### Development Tools
- **TypeScript** for type safety
- **Vite** for fast development and building
- **ESLint & Prettier** for code quality
- **Git** for version control

## 📁 Project Structure

```
PlotThePlot-Demo/
├── backend/
│   ├── index.js           # Defines current API endpoints
│   ├── package.json       # Project Dependencies
│   ├── data/              # Contains the what the API should look like
│   ├── routes/            # Routes for the API
│   └── ...
├── assets/                # Contains images
├── frontend/              # Will contain future React + Typescript frontend
```
## 🎨 Design Philosophy

PlotThePlot is built on several core principles:

1. **Nuance Over Simplicity**: Human relationships with media are complex; our tools should reflect that
2. **Context Matters**: The circumstances under which we consume media significantly affect our experience
3. **Self-Awareness**: Visualizing patterns in our taste helps us understand ourselves better
4. **Accessibility First**: Complex features should never exclude users who prefer simpler interactions
5. **Data Integrity**: Preserve authentic first reactions before social influence

## 🛠️ Development Approach

This project follows **Agile methodology** with weekly sprints:

Progress is tracked using Notion workspace and documented in regular sprint retrospectives.

## 🤝 Contributing

This is currently a personal learning project, but feedback and suggestions are welcome! 

### Potential Contribution Areas
- UI/UX improvements
- Accessibility enhancements  
- Performance optimizations
- Bug reports and fixes
- Feature suggestions

Please open an issue to discuss any significant changes before submitting a pull request.

## 📝 API Documentation

### Mock API Endpoints

**Get all users:**
```
GET  http://localhost:3001/api/users
```

**Get a specific user**
```
GET  http://localhost:3001/api/users/:id
```

**Modify a user**
```
PUT http://localhost:3001/api/users/:id

{
    "username": "newUser",
    "email": "newUser@email.com",
    "profile_picture": "new_profile_picture" 
}
```

**Delete a user**
```
DELETE http://localhost:3001/api/users/:id
```

**Get all ratings for a user:**
```
GET http://localhost:3001/api/users/:id/ratings
```

**Modify a user's ratings**
```
PUT http://localhost:3001/api/users/:userId/ratings/:ratingId

{
    "x_coordinate": x, # An integer between -1 and 1
    "y_coordinate": y, # An integer between -1 and 1
    "good_reason": "good reason",
    "like_reason": "like reason",
    "context": "new context",
}
```
**Get all media**
```
GET http://localhost:3001/api/media
```

**Get a specific media:**
```
GET http://localhost:3001/api/media/:id
```

**Get all ratings for a specific media**
```
GET 'http://localhost:3001/api/media/:id/ratings'
```

## 📊 The Down Low of PTP

- **Problem**: Traditional ratings don't capture the "guilty pleasure" vs "prestigious bore" distinction
- **Solution**: Two-dimensional rating system separates quality from personal enjoyment

### For Individual Users
- **Problem**: Forgot why you rated something a certain way months later?
- **Solution**: Context capture preserves your authentic reaction and reasoning

### For Creators
- **Problem**: Binary success/failure metrics don't explain *why* something worked or didn't
- **Solution**: Aggregate coordinate data reveals nuanced audience sentiment

- **Problem**: No way to identify "technically good but audience isn't connecting" scenarios
- **Solution**: Quadrant clustering shows when craft exceeds engagement (or vice versa)

## 🧠 Inspiration & Context

PlotThePlot emerged from frustration with oversimplified rating systems and the observation that we often:
- Love objectively bad media (guilty pleasures)
- Respect but don't enjoy critically acclaimed works
- Forgetting our own authentic reactions after social media's influence
- Struggle to articulate *why* we felt a certain way

The coordinate system provides vocabulary for these complex experiences while creating data rich enough to reveal patterns such as personal taste, genre fatigue, and cultural trends.

## 📄 License

GNU General Public License. All rights reserved while in development.

## 👤 Author

**Temi Ajayi**
- GitHub: [@limiajayi](https://github.com/limiajayi)
- Project Link: [PlotThePlot Demo](https://github.com/limiajayi/PlotThePlot-demo)

## 🙏 Acknowledgments

- Inspired by conversations with my parents and [@jothamsl](https://github.com/jothamsl) about media criticism and the limitations of star ratings
- Built as a learning project to master React, TypeScript, D3.js, and full-stack development

---

**Note**: This is currently a working demo using mock data. Production version with real backend coming soon!

*Built with ❤️ and way too many opinions about shows, movies and books*