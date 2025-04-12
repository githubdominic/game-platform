'use client';
import { useGameStore } from '../stores/gameStore';
import GameCard from './GameCard';
import { GameCategory } from '../types';

export default function GameGrid() {
  const { games, searchQuery, filterCategory } = useGameStore();
  
  // Filter games based on search query and category
  const filteredGames = games.filter((game) => {
    const matchesSearch = searchQuery 
      ? game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesCategory = filterCategory 
      ? game.categories.includes(filterCategory as GameCategory) 
      : true;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredGames.length > 0 ? (
        filteredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No games found matching your criteria</p>
        </div>
      )}
    </div>
  );
} 