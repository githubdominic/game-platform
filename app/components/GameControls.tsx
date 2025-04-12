'use client';
import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { GameCategory } from '../types';

const CATEGORIES: GameCategory[] = ['2D', '3D', 'Puzzle', 'Action', 'Strategy', 'RPG', 'Arcade'];

export default function GameControls() {
  const { setSearchQuery, setFilterCategory, filterCategory } = useGameStore();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: GameCategory | null) => {
    setFilterCategory(category);
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <input
          type="text"
          value={localSearch}
          onChange={handleSearch}
          placeholder="Search games..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
        <svg
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded-full text-sm ${
            filterCategory === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => handleCategoryChange(null)}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-sm ${
              filterCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
} 