'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the game component with no SSR
const SuperMarioGame = dynamic(() => import('./SuperMarioGame'), { ssr: false });

export default function SuperMarioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setIsGameOver(true);
  };

  const restartGame = () => {
    setIsGameOver(false);
    setScore(0);
    setLives(3);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Super Mario</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[500px] w-full bg-gray-800 rounded-lg">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading game...</p>
        </div>
      ) : isGameOver ? (
        <div className="flex flex-col items-center justify-center h-[500px] w-full bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
          <p className="text-xl text-white mb-6">Your score: {score}</p>
          <div className="flex space-x-4">
            <button
              onClick={restartGame}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Play Again
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Back to Games
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[500px] bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded flex gap-4">
            <div>Score: {score}</div>
            <div>Lives: {lives}</div>
          </div>
          <SuperMarioGame 
            onGameOver={handleGameOver} 
            onScoreUpdate={setScore} 
            onLivesUpdate={setLives} 
          />
        </div>
      )}
      
      <div className="mt-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-2">How to Play</h2>
        <p className="mb-4">
          Adventure as Mario in this classic platformer. Run, jump, and collect coins while avoiding enemies.
          Reach the flag at the end of the level to win!
        </p>
        <h2 className="text-xl font-bold mb-2">Controls</h2>
        <ul className="list-disc pl-5">
          <li>A/Left Arrow: Move left</li>
          <li>D/Right Arrow: Move right</li>
          <li>W/Up Arrow/Space: Jump</li>
          <li>S/Down Arrow: Duck (in some areas)</li>
          <li>P: Pause game</li>
        </ul>
      </div>
    </div>
  );
} 