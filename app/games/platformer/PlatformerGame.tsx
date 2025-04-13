'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface PlatformerGameProps {
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

// Game constants
const GRAVITY = 0.5;
const JUMP_POWER = -12;
const MOVE_SPEED = 5;
const PLATFORM_WIDTH = 100;
const PLATFORM_HEIGHT = 20;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
const COIN_SIZE = 15;
const COIN_VALUE = 10;

// Game classes
class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.color = '#3498db';
  }

  update() {
    this.velocityY += GRAVITY;
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = JUMP_POWER;
      this.isJumping = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(x: number, y: number, width = PLATFORM_WIDTH) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = PLATFORM_HEIGHT;
    this.color = '#2ecc71';
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Coin {
  x: number;
  y: number;
  size: number;
  color: string;
  collected: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = COIN_SIZE;
    this.color = '#f1c40f';
    this.collected = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.collected) return;
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size/2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function PlatformerGame({ onGameOver, onScoreUpdate }: PlatformerGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 重置状态
    gameOverRef.current = false;
    scoreRef.current = 0;

    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Initialize game objects
    const player = new Player(50, canvas.height / 2);
    let platforms: Platform[] = [];
    let coins: Coin[] = [];
    let lastPlatformX = 0;
    let cameraOffset = 0;
    let isGameOver = false;

    // Create initial platforms
    for (let i = 0; i < 10; i++) {
      const x = i === 0 ? 0 : lastPlatformX + Math.random() * 200 + 50;
      const y = i === 0 ? canvas.height - 100 : canvas.height - 100 - Math.random() * 200;
      const width = i === 0 ? 200 : PLATFORM_WIDTH + Math.random() * 100;
      
      const platform = new Platform(x, y, width);
      platforms.push(platform);
      lastPlatformX = x + width;
      
      // Add coins on platforms
      if (i !== 0 && Math.random() > 0.3) {
        const coinX = x + width / 2 - COIN_SIZE / 2;
        const coinY = y - COIN_SIZE - 5;
        coins.push(new Coin(coinX, coinY));
      }
    }

    // Input handler
    const keys: { [key: string]: boolean } = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && !player.isJumping) {
        player.jump();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    const update = () => {
      if (isGameOver) return;

      // Player movement
      player.velocityX = 0;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.velocityX = -MOVE_SPEED;
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.velocityX = MOVE_SPEED;
      }

      player.update();

      // Check platform collisions
      player.isJumping = true;
      for (const platform of platforms) {
        if (
          player.velocityY > 0 &&
          player.x + player.width > platform.x &&
          player.x < platform.x + platform.width &&
          player.y + player.height > platform.y &&
          player.y + player.height < platform.y + platform.height + player.velocityY
        ) {
          player.isJumping = false;
          player.velocityY = 0;
          player.y = platform.y - player.height;
        }
      }

      // Check coin collisions
      for (const coin of coins) {
        if (
          !coin.collected &&
          player.x + player.width > coin.x &&
          player.x < coin.x + coin.size &&
          player.y + player.height > coin.y &&
          player.y < coin.y + coin.size
        ) {
          coin.collected = true;
          const newScore = scoreRef.current + COIN_VALUE;
          handleScoreUpdate(newScore);
        }
      }

      // Camera follows player
      if (player.x > canvas.width / 3) {
        cameraOffset = player.x - canvas.width / 3;
      }

      // Add new platforms and coins as player moves right
      if (lastPlatformX - cameraOffset < canvas.width * 1.5) {
        const x = lastPlatformX + Math.random() * 200 + 50;
        const y = canvas.height - 100 - Math.random() * 200;
        const width = PLATFORM_WIDTH + Math.random() * 100;
        
        platforms.push(new Platform(x, y, width));
        lastPlatformX = x + width;
        
        // Add coins on platforms
        if (Math.random() > 0.3) {
          const coinX = x + width / 2 - COIN_SIZE / 2;
          const coinY = y - COIN_SIZE - 5;
          coins.push(new Coin(coinX, coinY));
        }
      }

      // Remove off-screen platforms and coins
      platforms = platforms.filter(p => p.x + p.width > cameraOffset - 100);
      coins = coins.filter(c => c.x + c.size > cameraOffset - 100);

      // Check game over condition (falling off-screen)
      if (player.y > canvas.height) {
        isGameOver = true;
        handleGameOver(scoreRef.current);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#34495e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw game objects relative to camera
      ctx.save();
      ctx.translate(-cameraOffset, 0);
      
      // Draw platforms
      platforms.forEach(platform => platform.draw(ctx));
      
      // Draw coins
      coins.forEach(coin => coin.draw(ctx));
      
      // Draw player
      player.draw(ctx);
      
      ctx.restore();
    };

    const gameLoop = () => {
      if (!isGameOver && !gameOverRef.current) {
        update();
        render();
        requestAnimationFrame(gameLoop);
      }
    };

    // Start game
    setGameStarted(true);
    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleScoreUpdate, handleGameOver]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
} 