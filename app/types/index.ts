// Game types for our platform

export type GameCategory = '2D' | '3D' | 'Puzzle' | 'Action' | 'Strategy' | 'RPG' | 'Arcade';

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  path: string;
  categories: GameCategory[];
  featured?: boolean;
  isNew?: boolean;
}

export interface GamesState {
  games: Game[];
  selectedGame: Game | null;
  searchQuery: string;
  filterCategory: GameCategory | null;
  setSelectedGame: (game: Game | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterCategory: (category: GameCategory | null) => void;
} 