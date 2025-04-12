'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link 
      href={game.path}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]"
    >
      <div className="relative h-40 w-full">
        {imageError ? (
          <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400 text-lg font-bold">{game.title}</span>
          </div>
        ) : (
          <Image 
            src={game.thumbnail || '/placeholder-game.jpg'} 
            alt={game.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
        {game.isNew && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </div>
        )}
        {game.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            FEATURED
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1">{game.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{game.description}</p>
        <div className="flex flex-wrap gap-1">
          {game.categories.map((category) => (
            <span 
              key={category} 
              className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
} 