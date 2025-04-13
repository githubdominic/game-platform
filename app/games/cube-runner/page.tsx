'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the 3D game component with no SSR
const CubeRunnerGame = dynamic(() => import('./CubeRunnerGame'), { ssr: false });

export default function CubeRunnerPage() {
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">3D 立方体跑酷</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[500px] w-full max-w-3xl bg-gray-800 rounded-lg">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">加载游戏中...</p>
        </div>
      ) : isGameOver ? (
        <div className="flex flex-col items-center justify-center h-[500px] w-full max-w-3xl bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-2">游戏结束！</h2>
          <p className="text-xl text-white mb-6">你的得分: {score}</p>
          <div className="flex space-x-4">
            <button
              onClick={restartGame}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
        <div className="relative w-full max-w-3xl h-[500px] bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded">
            得分: {score}
          </div>
          <CubeRunnerGame onGameOver={handleGameOver} onScoreUpdate={setScore} />
        </div>
      )}
      
      <div className="mt-6 max-w-3xl">
        <h2 className="text-xl font-bold mb-2">游戏说明</h2>
        <p className="mb-4">
          使用方向键或WASD移动立方体向左和向右。避开障碍物并收集能量提升以增加得分。
          随着得分增加，游戏速度会变快。你能坚持多久？
        </p>
        <h2 className="text-xl font-bold mb-2">控制方式</h2>
        <ul className="list-disc pl-5">
          <li>A/左方向键: 向左移动</li>
          <li>D/右方向键: 向右移动</li>
          <li>空格键: 跳跃 (如果启用)</li>
          <li>P: 暂停游戏</li>
        </ul>
      </div>
    </div>
  );
} 