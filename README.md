# Games Platform

A modern, extensible web platform for hosting and playing both 2D and 3D games built with Next.js, React, and TypeScript.

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Game Library**: Browse and search available games
- **Multiple Game Types**: Support for both 2D and 3D games
- **Expandable Architecture**: Easily add new games to the platform
- **Modern Tech Stack**: Next.js, React, TypeScript, Three.js, and more

## Demo Games

The platform currently includes two demo games:

1. **3D Cube Runner**: A 3D game built with Three.js and React Three Fiber
2. **2D Platformer**: A classic platformer built with Canvas API

## Tech Stack

- **Next.js**: React framework for server-side rendering
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **Zustand**: Lightweight state management

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/games-platform.git
   cd games-platform
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Adding New Games

To add a new game to the platform:

1. Create a new directory in `app/games/your-game-name/`
2. Implement your game component in `app/games/your-game-name/YourGameComponent.tsx`
3. Create a page for your game in `app/games/your-game-name/page.tsx`
4. Add your game metadata to the game store in `app/stores/gameStore.ts`

### Game Metadata Example

```typescript
{
  id: '3',
  title: 'Your Game Name',
  description: 'Short description of your game',
  thumbnail: '/games/your-game-thumb.jpg',
  path: '/games/your-game-name',
  categories: ['2D', 'Puzzle'], // or whatever categories fit
  isNew: true, // Optional flag to show "NEW" badge
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
