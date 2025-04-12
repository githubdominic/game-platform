import GameControls from '../components/GameControls';
import GameGrid from '../components/GameGrid';

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          All Games
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg">
          Browse our collection of games
        </p>
      </div>

      <GameControls />
      <GameGrid />
    </div>
  );
} 