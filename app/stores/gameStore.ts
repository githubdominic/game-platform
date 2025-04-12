import { create } from 'zustand';
import { Game, GameCategory, GamesState } from '../types';

// Sample games data
const sampleGames: Game[] = [
  {
    id: '1',
    title: '3D Cube Runner',
    description: 'Navigate through obstacles in this 3D runner game',
    thumbnail: '/games/cube-runner-thumb.jpg',
    path: '/games/cube-runner',
    categories: ['3D', 'Action'],
    featured: true,
  },
  {
    id: '2',
    title: '2D Platformer',
    description: 'Classic platformer with modern mechanics',
    thumbnail: '/games/platformer-thumb.jpg',
    path: '/games/platformer',
    categories: ['2D', 'Action'],
    isNew: true,
  },
  {
    id: '3',
    title: 'Super Mario',
    description: 'Classic Super Mario style platformer game',
    thumbnail: '/games/super-mario-thumb.jpg',
    path: '/games/super-mario',
    categories: ['2D', 'Action', 'Arcade'],
    isNew: true,
  },
];

export const useGameStore = create<GamesState>((set) => ({
  games: sampleGames,
  selectedGame: null,
  searchQuery: '',
  filterCategory: null,
  setSelectedGame: (game) => set({ selectedGame: game }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterCategory: (category) => set({ filterCategory: category }),
})); 