import { create } from 'zustand';
import { Game, GameCategory, GamesState } from '../types';

// Sample games data
const sampleGames: Game[] = [
  {
    id: '1',
    title: '3D 立方体跑酷',
    description: '在这个3D跑酷游戏中穿越障碍物',
    thumbnail: '/games/cube-runner-thumb.jpg',
    path: '/games/cube-runner',
    categories: ['3D', 'Action'],
    featured: true,
  },
  {
    id: '2',
    title: '2D 平台跳跃',
    description: '经典平台跳跃游戏，融合现代机制',
    thumbnail: '/games/platformer-thumb.jpg',
    path: '/games/platformer',
    categories: ['2D', 'Action'],
    isNew: true,
  },
  {
    id: '3',
    title: '超级玛丽',
    description: '经典超级玛丽风格平台游戏',
    thumbnail: '/games/super-mario-thumb.jpg',
    path: '/games/super-mario',
    categories: ['2D', 'Action', 'Arcade'],
    isNew: true,
  },
  {
    id: '4',
    title: '小动物农场',
    description: '适合儿童的互动农场游戏，点击动物听声音',
    thumbnail: '/games/animal-farm-thumb.jpg',
    path: '/games/animal-farm',
    categories: ['2D', 'Children'],
    isNew: true,
    featured: true,
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