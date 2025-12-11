# Path-Finding Visualizer

A modern, interactive visualization tool for pathfinding algorithms featuring a stunning dark theme UI with glassmorphic design and smooth animations.

## ✨ Features

### Algorithms
- **Breadth-First Search (BFS)** - Unweighted shortest path algorithm
- **Dijkstra's Algorithm** - Weighted shortest path with optimal guarantees
- **A* Search** - Heuristic-based pathfinding with Manhattan and Euclidean distance options

### Interactive Controls
- **Draw Walls** - Click and drag to create obstacles on the grid
- **Erase Walls** - Remove obstacles easily
- **Reposition Points** - Move start and end points anywhere on the grid
- **Diagonal Movement** - Toggle diagonal pathfinding support
- **Dynamic Grid Size** - Customize rows (5-50) and columns (5-100)

### Visual Design
- **Dark Theme** - Premium dark mode with vibrant accent colors
- **Glassmorphic Panels** - Modern frosted glass effect with backdrop blur
- **Glowing Effects** - Beautiful glow animations on cells
- **Smooth Animations** - Satisfying visual feedback for all interactions
- **Sticky Grid** - Grid stays in view while scrolling controls

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be running at `http://localhost:3000`

## 🎮 How to Use

1. **Choose Algorithm** - Select BFS, Dijkstra, or A* from the dropdown
2. **Draw Your Maze** - Use drawing mode to create walls
3. **Configure Options** - Enable diagonal movement or select heuristic (for A*)
4. **Run Algorithm** - Click "Run Algorithm" to visualize the pathfinding
5. **Clear & Repeat** - Use "Clear Path" or "Clear Grid" to start fresh

## 📁 Project Structure

```
path-finding-visualizer/
├── src/
│   ├── App.jsx              # Main application component
│   ├── index.jsx            # Entry point
│   ├── index.css            # Global styles & design system
│   ├── components/
│   │   ├── Grid.jsx         # Grid container with mouse interactions
│   │   ├── Cell.jsx         # Individual cell component
│   │   ├── Controls.jsx     # Control panel with all settings
│   │   └── Legend.jsx       # Color legend
│   └── algorithms/
│       ├── bfs.js           # Breadth-First Search implementation
│       ├── dijkstra.js      # Dijkstra's algorithm implementation
│       ├── astar.js         # A* search implementation
│       └── utils.js         # Helper functions
├── package.json
└── vite.config.js
```

## 🎨 Design System

### Color Palette
- **Background**: Dark theme with multiple depth layers
- **Accents**: Purple-to-magenta gradients
- **Cell States**:
  - Start: Green with pulsing glow
  - End: Red with pulsing glow
  - Wall: Glowing white
  - Visited: Purple with rotation animation
  - Frontier: Blue with color shift
  - Path: Golden with explosive entrance

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Weights**: 300-800 for perfect hierarchy

## 🔧 Technologies

- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **CSS Variables** - Design token system
- **Custom Algorithms** - Pure JavaScript implementations

## 📊 Algorithm Complexity

| Algorithm | Time Complexity | Space Complexity | Optimal Path |
|-----------|----------------|------------------|--------------|
| BFS | O(V + E) | O(V) | ✅ (unweighted) |
| Dijkstra | O((V + E) log V) | O(V) | ✅ |
| A* | O((V + E) log V) | O(V) | ✅ (with admissible heuristic) |

## 🎯 Key Features

- **Sticky Grid**: Grid stays locked while scrolling controls
- **Responsive Design**: Works on all screen sizes
- **Custom Scrollbar**: Styled to match dark theme
- **Glassmorphism**: Modern frosted glass panels
- **Smooth Animations**: Cubic-bezier easing for premium feel
- **Visual Feedback**: Hover effects on all interactive elements

## 📝 License

MIT

---

Built with React + Vite