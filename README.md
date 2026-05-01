# PlotThePlot 📊🎬

A media rating platform that captures the complexity of how we actually experience art and stories.

## 🌟 What is PlotThePlot?

Traditional rating systems force us to collapse complex feelings into oversimplified metrics (⭐⭐⭐⭐). PlotThePlot uses a **two-dimensional coordinate system** that separates "quality" from "personal enjoyment":

- **X-axis**: Bad (-1) ←→ Good (+1)
- **Y-axis**: Didn't Like It (-1) ←→ Liked It (+1)

This creates four quadrants:

- **Over** (good + liked): Masterpieces you genuinely love.
- **Overhated** (bad + liked): Objectively flawed in every way but you enjoy them anyway.
- **Overhated** (good + didn't like): Technically excellent but didn't connect.
- **Under** (bad + didn't like): Neither well-made nor enjoyable.

## ✨ Key Features

### Currently Developing (Phase 1)

- 🚺**User Settings**: Changing the user's username, password and deleting their account
- 🔄 **Multiple View Modes**: Toggle between scatter plot and grid views
- ♿ **Accessible Design**: Simple slider mode for users who prefer not to use coordinate clicking

### Coming Soon (Phase 2)

- 👥 Social features and friend comparisons
- 📈 Aggregate coordinates showing community consensus
- 🔍 Media search and discovery
- 🪄 Separate plots based on media type (books, shows, movies, etc)
- 🎭 Rewatch tracking to see how opinions evolve
- 📱 **Responsive Design**: Optimized for desktop with mobile support

## 🚀 Quick Start

### Prerequisites

- Node.js (v22 or higher)
- npm

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

### Backend

- **Node.js** with Express.js
- **PostgreSQL** for data persistence
- **Supabase** or similar for authentication and real-time features

### Development Tools

- **TypeScript** for type safety
- **Vite** for fast development and building
- **ESLint & Prettier** for code quality
- **Git** for version control

## 📁 Project Structure

```text
PlotThePlot-Demo/
├── backend/
│   ├── index.js           # Defines current API endpoints
│   ├── package.json       # Project Dependencies
│   ├── data/              # Contains the what the API should look like
│   ├── routes/            # Routes for the API
│   └── ...
├── assets/                # Contains images
├── frontend/              # Contains React + Typescript frontend
│   ├── src/               # frontend files ( ratings, hooks, media, pages, styling  )
│   │   ├── App.tsx        # Public and Private routes
│   │   └── ...
│   └── ...
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

- Love objectively bad media
- Respect but don't enjoy critically acclaimed works
- Forgetting our own authentic reactions after social media's influence
- Struggle to articulate *why* we felt a certain way

The coordinate system provides vocabulary for these complex experiences while creating data rich enough to reveal patterns such as personal taste, genre fatigue, and cultural trends.

## 📄 License

All Rights Reserved.

## 👤 Author

**Temi Ajayi**

- GitHub: [@limiajayi](https://github.com/limiajayi)
- Project Link: [PlotThePlot Demo](https://github.com/limiajayi/PlotThePlot-demo)

## 🙏 Acknowledgments

- Inspired by conversations with my parents and [@jothamsl](https://github.com/jothamsl) about media criticism and the limitations of star ratings
- Built as a learning project to master React, TypeScript, D3.js, and full-stack development

---

*Built with ❤️ and way too many opinions about shows, movies and books*