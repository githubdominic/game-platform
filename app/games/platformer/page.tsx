'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the 2D game component with no SSR
const PlatformerGame = dynamic(() => import('./PlatformerGame'), { ssr: false });

export default function PlatformerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
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
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">2D 平台跳跃</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[500px] w-full bg-gray-800 rounded-lg">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">加载游戏中...</p>
        </div>
      ) : isGameOver ? (
        <div className="flex flex-col items-center justify-center h-[500px] w-full bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-2">游戏结束！</h2>
          <p className="text-xl text-white mb-6">你的得分: {score}</p>
          <div className="flex space-x-4">
            <button
              onClick={restartGame}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              再玩一次
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              返回游戏列表
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[500px] bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded">
            得分: {score}
          </div>
          <PlatformerGame onGameOver={handleGameOver} onScoreUpdate={setScore} />
        </div>
      )}
      
      <div className="mt-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-2">游戏说明</h2>
        <p className="mb-4">
          使用方向键或WASD移动和跳跃。收集金币增加得分，避免从平台上掉落。
          看看你能走多远？
        </p>
        <h2 className="text-xl font-bold mb-2">控制方式</h2>
        <ul className="list-disc pl-5">
          <li>A/左方向键: 向左移动</li>
          <li>D/右方向键: 向右移动</li>
          <li>W/上方向键/空格键: 跳跃</li>
          <li>P: 暂停游戏</li>
        </ul>
      </div>
    </div>
  );
} 