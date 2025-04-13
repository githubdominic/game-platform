'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 动态导入游戏组件，避免SSR问题
const AnimalFarmGame = dynamic(() => import('./AnimalFarmGame'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-[500px] w-full max-w-3xl bg-gray-800 rounded-lg">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-white">加载游戏中...</p>
    </div>
  ),
});

export default function AnimalFarmPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    // 在客户端渲染完成后设置加载状态为false
    // 简化初始加载过程，不再等待音频预加载
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // 重新开始游戏
  const restartGame = () => {
    setScore(0);
    setIsGameOver(false);
  };

  // 处理分数更新
  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">小动物农场</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[500px] w-full max-w-3xl bg-gray-800 rounded-lg">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">加载游戏中...</p>
        </div>
      ) : (
        <div className="relative w-full max-w-3xl h-[500px] bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded">
            分数: {score}
          </div>
          <AnimalFarmGame onScoreUpdate={handleScoreUpdate} />
        </div>
      )}
      
      <div className="mt-6 max-w-3xl">
        <h2 className="text-xl font-bold mb-2">游戏说明</h2>
        <p className="mb-4">
          这是一个专为4岁儿童设计的简单有趣的小动物农场游戏。点击农场里的动物，
          听听它们发出的声音！每点击一次动物，你就能获得一分。
        </p>
        <h2 className="text-xl font-bold mb-2">游戏特点</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>简单有趣的点击互动</li>
          <li>可爱的动物形象和生动的声音</li>
          <li>丰富多彩的农场场景</li>
          <li>适合儿童的简单游戏机制</li>
        </ul>
        <h2 className="text-xl font-bold mb-2">操作方式</h2>
        <ul className="list-disc pl-5">
          <li>点击或触摸屏幕上的动物</li>
          <li>听一听它们会发出什么声音</li>
          <li>观察动物们的可爱动画</li>
        </ul>
      </div>
    </div>
  );
} 