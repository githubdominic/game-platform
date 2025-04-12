import GameControls from './components/GameControls';
import GameGrid from './components/GameGrid';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
          <span className="block">欢迎来到</span>
          <span className="block text-blue-600 dark:text-blue-500">游戏平台</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          探索我们的2D和3D游戏集合。我们会定期添加新游戏！
        </p>
      </div>

      <GameControls />
      <GameGrid />
    </div>
  );
}
