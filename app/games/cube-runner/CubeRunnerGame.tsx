'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';
import { BufferGeometry, Mesh, Vector3 } from 'three';

interface PlayerProps {
  position: [number, number, number];
  onCollision: () => void;
}

interface ObstacleProps {
  position: [number, number, number];
  speed: number;
}

interface CubeRunnerGameProps {
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

// Player component
function Player({ position, onCollision }: PlayerProps) {
  const ref = useRef<Mesh>(null);
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>(position);
  const [moveDirection, setMoveDirection] = useState<number>(0);
  const speed = 0.1;
  const clampX = 2; // Maximum x position

  useFrame(() => {
    if (ref.current) {
      // Update player position based on input
      let newX = playerPosition[0] + moveDirection * speed;
      newX = Math.max(-clampX, Math.min(clampX, newX)); // Clamp position
      
      setPlayerPosition([newX, playerPosition[1], playerPosition[2]]);
      ref.current.position.x = newX;
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止方向键引起页面滚动
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
          e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setMoveDirection(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setMoveDirection(1);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // 防止方向键引起页面滚动
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
          e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
      }
      
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) {
        setMoveDirection(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Box ref={ref} position={playerPosition} args={[0.5, 0.5, 0.5]} castShadow>
      <meshStandardMaterial color="blue" />
    </Box>
  );
}

// Obstacle component
function Obstacle({ position, speed }: ObstacleProps) {
  const ref = useRef<Mesh>(null);
  const startZ = position[2];
  const { viewport } = useThree();
  
  useFrame(() => {
    if (ref.current) {
      ref.current.position.z += speed;
      
      // Reset obstacle when it goes off screen
      if (ref.current.position.z > 5) {
        ref.current.position.z = startZ - 15 - Math.random() * 10;
        ref.current.position.x = (Math.random() - 0.5) * 4;
      }
    }
  });

  return (
    <Box 
      ref={ref} 
      position={position} 
      args={[Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5]} 
      castShadow
    >
      <meshStandardMaterial color="red" />
    </Box>
  );
}

// Game scene
function GameScene({ onGameOver, onScoreUpdate }: CubeRunnerGameProps) {
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<Array<[number, number, number]>>([]);
  const [gameSpeed, setGameSpeed] = useState(0.1);
  
  // 使用useRef存储游戏状态，避免在渲染期间调用父组件的更新函数
  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);
  
  // 使用useCallback包装回调函数
  const handleScoreUpdate = useCallback((newScore: number) => {
    scoreRef.current = newScore;
    setScore(newScore);
    // 使用requestAnimationFrame确保在渲染之外调用
    requestAnimationFrame(() => {
      onScoreUpdate(newScore);
    });
  }, [onScoreUpdate]);
  
  const handleGameOver = useCallback((finalScore: number) => {
    if (gameOverRef.current) return; // 防止重复调用
    gameOverRef.current = true;
    // 使用requestAnimationFrame确保在渲染之外调用
    requestAnimationFrame(() => {
      onGameOver(finalScore);
    });
  }, [onGameOver]);
  
  useEffect(() => {
    // 重置状态
    scoreRef.current = 0;
    gameOverRef.current = false;
    
    // Create initial obstacles
    const newObstacles: Array<[number, number, number]> = [];
    for (let i = 0; i < 10; i++) {
      newObstacles.push([
        (Math.random() - 0.5) * 4, // x between -2 and 2
        0, // y at ground level
        -i * 5 - 10, // z spaced out behind the player
      ]);
    }
    setObstacles(newObstacles);
  }, []);

  useFrame(() => {
    // Increase score over time
    const newScore = scoreRef.current + 1;
    handleScoreUpdate(newScore);
    
    // Increase game speed based on score
    if (newScore % 500 === 0) {
      setGameSpeed(prev => Math.min(prev + 0.02, 0.5));
    }
  });

  const handleCollision = () => {
    if (!gameOverRef.current) {
      handleGameOver(scoreRef.current);
    }
  };

  return (
    <>
      {/* Player */}
      <Player position={[0, 0, 0]} onCollision={handleCollision} />
      
      {/* Obstacles */}
      {obstacles.map((position, index) => (
        <Obstacle key={index} position={position} speed={gameSpeed} />
      ))}
      
      {/* Environment */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <gridHelper args={[20, 20, 'white', 'gray']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
    </>
  );
}

export default function CubeRunnerGame({ onGameOver, onScoreUpdate }: CubeRunnerGameProps) {
  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 75 }}>
      <GameScene onGameOver={onGameOver} onScoreUpdate={onScoreUpdate} />
    </Canvas>
  );
} 