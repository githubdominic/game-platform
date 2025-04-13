'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface SuperMarioGameProps {
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  onLivesUpdate: (lives: number) => void;
}

// Game constants
const GRAVITY = 0.6;
const JUMP_POWER = -15;
const MOVE_SPEED = 5;
const MARIO_WIDTH = 40;
const MARIO_HEIGHT = 60;
const GROUND_HEIGHT = 40;
const COIN_SIZE = 25;
const COIN_VALUE = 100;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;
const ENEMY_SPEED = 2;
const PLATFORM_HEIGHT = 20;
const BRICK_SIZE = 40;
const FLAG_WIDTH = 40;
const FLAG_HEIGHT = 200;

// Game classes
class Mario {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
  direction: 'left' | 'right';
  isShrinking: boolean;
  shrinkTimeout: ReturnType<typeof setTimeout> | null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = MARIO_WIDTH;
    this.height = MARIO_HEIGHT;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.direction = 'right';
    this.isShrinking = false;
    this.shrinkTimeout = null;
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
    // Drawing a simple Mario character
    ctx.fillStyle = this.isShrinking ? 'rgba(255, 0, 0, 0.5)' : 'red';
    
    // Body
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Hat
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - 5, this.y, this.width + 10, 15);
    
    // Face
    ctx.fillStyle = 'tan';
    ctx.fillRect(this.x + 5, this.y + 15, this.width - 10, 25);
    
    // Eyes
    ctx.fillStyle = 'white';
    if (this.direction === 'right') {
      ctx.fillRect(this.x + this.width - 15, this.y + 25, 8, 8);
      ctx.fillStyle = 'black';
      ctx.fillRect(this.x + this.width - 12, this.y + 28, 4, 4);
    } else {
      ctx.fillRect(this.x + 7, this.y + 25, 8, 8);
      ctx.fillStyle = 'black';
      ctx.fillRect(this.x + 9, this.y + 28, 4, 4);
    }
    
    // Mustache
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x + 5, this.y + 40, this.width - 10, 5);
  }
}

class Platform {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = PLATFORM_HEIGHT;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Brick {
  x: number;
  y: number;
  size: number;
  hasCoin: boolean;
  isHit: boolean;

  constructor(x: number, y: number, hasCoin = false) {
    this.x = x;
    this.y = y;
    this.size = BRICK_SIZE;
    this.hasCoin = hasCoin;
    this.isHit = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw brick
    ctx.fillStyle = this.hasCoin ? '#D2B48C' : '#964B00'; // Tan or brown
    ctx.fillRect(this.x, this.y, this.size, this.size);
    
    // Draw pattern on brick
    ctx.fillStyle = '#5C3317'; // Darker brown
    ctx.fillRect(this.x + 5, this.y + 5, this.size - 10, 5);
    ctx.fillRect(this.x + 5, this.y + 20, this.size - 10, 5);
    ctx.fillRect(this.x + 5, this.y + 35, this.size - 10, 5);
  }
}

class Coin {
  x: number;
  y: number;
  size: number;
  collected: boolean;
  bounceHeight: number;
  bounceSpeed: number;
  initialY: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.initialY = y;
    this.size = COIN_SIZE;
    this.collected = false;
    this.bounceHeight = 80;
    this.bounceSpeed = 2;
  }

  update() {
    if (!this.collected) {
      this.y = this.initialY - Math.abs(Math.sin(Date.now() / 300) * 10);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.collected) return;
    
    // Draw a coin
    ctx.fillStyle = 'gold';
    ctx.beginPath();
    ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw a dollar sign
    ctx.fillStyle = '#DAA520'; // Darker gold
    ctx.font = '16px Arial';
    ctx.fillText('$', this.x + this.size/2 - 4, this.y + this.size/2 + 5);
  }
}

class Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: -1 | 1;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = ENEMY_WIDTH;
    this.height = ENEMY_HEIGHT;
    this.speed = ENEMY_SPEED;
    this.direction = -1; // Start moving left
  }

  update() {
    this.x += this.speed * this.direction;
  }

  reverseDirection() {
    this.direction = this.direction === 1 ? -1 : 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Drawing a simple Goomba enemy
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Face
    if (this.direction === -1) {
      // Eyes
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x + 5, this.y + 10, 8, 8);
      ctx.fillRect(this.x + 25, this.y + 10, 8, 8);
      
      // Pupils
      ctx.fillStyle = 'black';
      ctx.fillRect(this.x + 7, this.y + 12, 4, 4);
      ctx.fillRect(this.x + 27, this.y + 12, 4, 4);
    } else {
      // Eyes
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x + 7, this.y + 10, 8, 8);
      ctx.fillRect(this.x + 27, this.y + 10, 8, 8);
      
      // Pupils
      ctx.fillStyle = 'black';
      ctx.fillRect(this.x + 9, this.y + 12, 4, 4);
      ctx.fillRect(this.x + 29, this.y + 12, 4, 4);
    }
    
    // Mouth
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x + 5, this.y + 25, this.width - 10, 5);
  }
}

class Flag {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = FLAG_WIDTH;
    this.height = FLAG_HEIGHT;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Flag pole
    ctx.fillStyle = 'gray';
    ctx.fillRect(this.x + this.width/2 - 5, this.y, 10, this.height);
    
    // Flag
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width/2, this.y + 20);
    ctx.lineTo(this.x + this.width/2 - 30, this.y + 40);
    ctx.lineTo(this.x + this.width/2, this.y + 60);
    ctx.fill();
  }
}

export default function SuperMarioGame({ onGameOver, onScoreUpdate, onLivesUpdate }: SuperMarioGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [levelComplete, setLevelComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // 使用useRef存储游戏状态，避免在渲染期间调用父组件的更新函数
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const gameOverRef = useRef(false);
  const levelCompleteRef = useRef(false);

  // 使用useCallback包装回调函数
  const handleScoreUpdate = useCallback((newScore: number) => {
    scoreRef.current = newScore;
    setScore(newScore);
    // 使用requestAnimationFrame确保在渲染之外调用
    requestAnimationFrame(() => {
      onScoreUpdate(newScore);
    });
  }, [onScoreUpdate]);

  const handleLivesUpdate = useCallback((newLives: number) => {
    livesRef.current = newLives;
    setLives(newLives);
    // 使用requestAnimationFrame确保在渲染之外调用
    requestAnimationFrame(() => {
      onLivesUpdate(newLives);
    });
  }, [onLivesUpdate]);

  const handleGameOver = useCallback((finalScore: number) => {
    if (gameOverRef.current) return; // 防止重复调用
    gameOverRef.current = true;
    // 使用requestAnimationFrame确保在渲染之外调用
    requestAnimationFrame(() => {
      onGameOver(finalScore);
    });
  }, [onGameOver]);

  const handleLevelComplete = useCallback(() => {
    if (levelCompleteRef.current) return;
    levelCompleteRef.current = true;
    setLevelComplete(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 重置状态
    gameOverRef.current = false;
    scoreRef.current = score;
    livesRef.current = lives;
    levelCompleteRef.current = levelComplete;

    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const groundY = canvas.height - GROUND_HEIGHT;

    // Initialize game objects
    const mario = new Mario(50, groundY - MARIO_HEIGHT);
    let platforms: Platform[] = [];
    let bricks: Brick[] = [];
    let coins: Coin[] = [];
    let enemies: Enemy[] = [];
    let flag: Flag | null = null;
    
    let levelLength = 5000; // Total level length
    let cameraOffset = 0; // Camera offset for scrolling
    let isGameOver = false;
    
    // Create level layout
    
    // Ground platforms
    for (let x = 0; x < levelLength; x += 300) {
      const width = Math.min(300, levelLength - x);
      platforms.push(new Platform(x, groundY, width));
    }
    
    // Gaps in the ground
    [500, 1200, 2000, 3000, 3800].forEach(x => {
      const gapWidth = 100 + Math.random() * 50;
      // Remove platforms at gap locations
      platforms = platforms.filter(p => 
        !(p.x < x + gapWidth && p.x + p.width > x)
      );
    });
    
    // Add floating platforms
    [300, 700, 1500, 2500, 3500].forEach(x => {
      const y = groundY - 120 - Math.random() * 80;
      const width = 100 + Math.random() * 100;
      platforms.push(new Platform(x, y, width));
    });
    
    // Add bricks with coins
    [400, 450, 500, 1000, 1050, 1100, 2000, 2050, 2100, 3000, 3050, 3100].forEach(x => {
      bricks.push(new Brick(x, groundY - 200, true));
    });
    
    // Add regular bricks
    [550, 600, 650, 1150, 1200, 1250, 1500, 1550, 1600, 2150, 2200, 2250, 2800, 2850, 2900].forEach(x => {
      bricks.push(new Brick(x, groundY - 200, false));
    });
    
    // Add coins
    [350, 800, 900, 1300, 1400, 1800, 1900, 2300, 2400, 2700, 3200, 3300, 3600, 3700].forEach(x => {
      coins.push(new Coin(x, groundY - 70));
    });
    
    // Add enemies
    [400, 900, 1400, 1900, 2400, 2900, 3400, 3900].forEach(x => {
      enemies.push(new Enemy(x, groundY - ENEMY_HEIGHT));
    });
    
    // Add end flag
    flag = new Flag(levelLength - 200, groundY - FLAG_HEIGHT);

    // Input handling
    const keys: Record<string, boolean> = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止空格键等按键引起页面滚动
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
          e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
      
      keys[e.key] = true;
      
      // Pause game with P key
      if (e.key === 'p' || e.key === 'P') {
        setIsPaused(prev => !prev);
      }
      
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && !mario.isJumping) {
        mario.jump();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // 防止空格键等按键引起页面滚动
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
          e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
      
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    const update = () => {
      if (isGameOver || levelCompleteRef.current || isPaused) return;

      // Player movement
      mario.velocityX = 0;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        mario.velocityX = -MOVE_SPEED;
        mario.direction = 'left';
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        mario.velocityX = MOVE_SPEED;
        mario.direction = 'right';
      }

      mario.update();

      // Camera follows Mario
      if (mario.x > canvas.width / 3) {
        cameraOffset = mario.x - canvas.width / 3;
      }
      
      // Limit camera to level bounds
      cameraOffset = Math.max(0, Math.min(cameraOffset, levelLength - canvas.width));

      // Check collisions with ground platforms
      mario.isJumping = true;
      for (const platform of platforms) {
        // Standing on platform
        if (
          mario.velocityY > 0 &&
          mario.x + mario.width > platform.x &&
          mario.x < platform.x + platform.width &&
          mario.y + mario.height > platform.y &&
          mario.y + mario.height < platform.y + platform.height + mario.velocityY
        ) {
          mario.isJumping = false;
          mario.velocityY = 0;
          mario.y = platform.y - mario.height;
        }
      }

      // Check collisions with bricks
      for (const brick of bricks) {
        // Hitting brick from below
        if (
          !brick.isHit &&
          mario.velocityY < 0 &&
          mario.x + mario.width > brick.x &&
          mario.x < brick.x + brick.size &&
          mario.y > brick.y &&
          mario.y < brick.y + brick.size - mario.velocityY
        ) {
          mario.velocityY = 0;
          brick.isHit = true;
          
          // If brick has a coin, create one
          if (brick.hasCoin) {
            const coin = new Coin(brick.x + brick.size/2 - COIN_SIZE/2, brick.y - COIN_SIZE - 10);
            coins.push(coin);
            
            // Animate coin rising and then collect it
            setTimeout(() => {
              if (!isGameOver && !gameOverRef.current) {
                coin.collected = true;
                const newScore = scoreRef.current + COIN_VALUE;
                handleScoreUpdate(newScore);
              }
            }, 500);
          }
        }
        
        // Standing on brick
        if (
          mario.velocityY > 0 &&
          mario.x + mario.width > brick.x &&
          mario.x < brick.x + brick.size &&
          mario.y + mario.height > brick.y &&
          mario.y + mario.height < brick.y + brick.size + mario.velocityY
        ) {
          mario.isJumping = false;
          mario.velocityY = 0;
          mario.y = brick.y - mario.height;
        }
      }

      // Update coins
      for (const coin of coins) {
        coin.update();
        
        // Collect coins
        if (
          !coin.collected &&
          mario.x + mario.width > coin.x &&
          mario.x < coin.x + coin.size &&
          mario.y + mario.height > coin.y &&
          mario.y < coin.y + coin.size
        ) {
          coin.collected = true;
          const newScore = scoreRef.current + COIN_VALUE;
          handleScoreUpdate(newScore);
        }
      }
      
      // Update enemies
      for (const enemy of enemies) {
        enemy.update();
        
        // Enemy collides with other enemies
        for (const otherEnemy of enemies) {
          if (enemy !== otherEnemy && 
              enemy.x + enemy.width > otherEnemy.x &&
              enemy.x < otherEnemy.x + otherEnemy.width &&
              enemy.y + enemy.height > otherEnemy.y &&
              enemy.y < otherEnemy.y + otherEnemy.height) {
            enemy.reverseDirection();
            break;
          }
        }
        
        // Enemy falls off platform
        let onPlatform = false;
        for (const platform of platforms) {
          if (enemy.x + enemy.width > platform.x &&
              enemy.x < platform.x + platform.width &&
              enemy.y + enemy.height === platform.y) {
            onPlatform = true;
            break;
          }
        }
        
        if (!onPlatform) {
          // Enemy at edge of platform, reverse direction
          if (enemy.direction === -1) {
            enemy.x += 5; // Move back onto platform
            enemy.reverseDirection();
          } else if (enemy.direction === 1) {
            enemy.x -= 5; // Move back onto platform
            enemy.reverseDirection();
          }
        }
        
        // Mario stomps on enemy
        if (!mario.isShrinking &&
            mario.velocityY > 0 &&
            mario.x + mario.width > enemy.x + 5 &&
            mario.x < enemy.x + enemy.width - 5 &&
            mario.y + mario.height > enemy.y &&
            mario.y + mario.height < enemy.y + enemy.height/2
        ) {
          // Remove the enemy
          const index = enemies.indexOf(enemy);
          if (index > -1) {
            enemies.splice(index, 1);
          }
          
          // Bounce Mario
          mario.velocityY = -10;
          
          // Give points
          const newScore = scoreRef.current + 200;
          handleScoreUpdate(newScore);
        }
        // Enemy hits Mario from the side
        else if (!mario.isShrinking &&
                 mario.x + mario.width > enemy.x &&
                 mario.x < enemy.x + enemy.width &&
                 mario.y + mario.height > enemy.y &&
                 mario.y < enemy.y + enemy.height) {
          // Lose a life
          const newLives = livesRef.current - 1;
          handleLivesUpdate(newLives);
          
          if (newLives <= 0) {
            isGameOver = true;
            handleGameOver(scoreRef.current);
          } else {
            // Make Mario temporarily invulnerable
            mario.isShrinking = true;
            if (mario.shrinkTimeout) {
              clearTimeout(mario.shrinkTimeout);
            }
            mario.shrinkTimeout = setTimeout(() => {
              mario.isShrinking = false;
            }, 2000);
            
            // Knockback
            mario.velocityY = -10;
            if (enemy.direction === -1) {
              mario.velocityX = -10;
            } else {
              mario.velocityX = 10;
            }
          }
        }
      }
      
      // Check if Mario reaches the flag
      if (flag && !levelCompleteRef.current &&
          mario.x + mario.width > flag.x &&
          mario.x < flag.x + flag.width &&
          mario.y + mario.height > flag.y &&
          mario.y < flag.y + flag.height) {
        handleLevelComplete();
        
        // Add bonus points for completing level
        const newScore = scoreRef.current + 1000;
        handleScoreUpdate(newScore);
        
        // Wait a bit and then end game
        setTimeout(() => {
          if (!isGameOver && !gameOverRef.current) {
            isGameOver = true;
            handleGameOver(scoreRef.current + 1000); // Include the bonus points
          }
        }, 3000);
      }
      
      // Game over if Mario falls off screen
      if (mario.y > canvas.height) {
        const newLives = livesRef.current - 1;
        handleLivesUpdate(newLives);
        
        if (newLives <= 0) {
          isGameOver = true;
          handleGameOver(scoreRef.current);
        } else {
          // Reset Mario position
          mario.x = 50;
          mario.y = groundY - MARIO_HEIGHT;
          mario.velocityX = 0;
          mario.velocityY = 0;
          cameraOffset = 0;
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw sky background
      ctx.fillStyle = '#87CEEB'; // Sky blue
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw clouds
      ctx.fillStyle = 'white';
      [200, 500, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800].forEach((x, i) => {
        const cloudX = x - cameraOffset;
        if (cloudX > -200 && cloudX < canvas.width + 200) {
          ctx.beginPath();
          ctx.arc(cloudX, 80 + (i % 3) * 30, 30, 0, Math.PI * 2);
          ctx.arc(cloudX + 40, 70 + (i % 3) * 30, 40, 0, Math.PI * 2);
          ctx.arc(cloudX + 80, 80 + (i % 3) * 30, 30, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Save context for camera transformation
      ctx.save();
      ctx.translate(-cameraOffset, 0);
      
      // Draw ground
      ctx.fillStyle = '#5c4033'; // Brown
      ctx.fillRect(0, groundY, levelLength, GROUND_HEIGHT);
      
      // Draw grass on ground
      ctx.fillStyle = '#228B22'; // Forest green
      ctx.fillRect(0, groundY, levelLength, 10);
      
      // Draw platforms
      for (const platform of platforms) {
        platform.draw(ctx);
      }
      
      // Draw bricks
      for (const brick of bricks) {
        brick.draw(ctx);
      }
      
      // Draw coins
      for (const coin of coins) {
        coin.draw(ctx);
      }
      
      // Draw enemies
      for (const enemy of enemies) {
        enemy.draw(ctx);
      }
      
      // Draw flag
      if (flag) {
        flag.draw(ctx);
      }
      
      // Draw Mario
      mario.draw(ctx);
      
      ctx.restore();
      
      // Draw pause overlay
      if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width/2, canvas.height/2);
        ctx.font = '18px Arial';
        ctx.fillText('Press P to continue', canvas.width/2, canvas.height/2 + 40);
      }
      
      // Draw level complete message
      if (levelComplete) {
        ctx.fillStyle = 'rgba(0, 0, 0, a)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', canvas.width/2, canvas.height/2);
        ctx.font = '18px Arial';
        ctx.fillText(`Score: ${scoreRef.current + 1000}`, canvas.width/2, canvas.height/2 + 40);
      }
    };

    let lastTime = 0;
    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      if (!isGameOver && !gameOverRef.current) {
        update();
        render();
        requestAnimationFrame(gameLoop);
      }
    };

    // Start game
    requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (mario.shrinkTimeout) {
        clearTimeout(mario.shrinkTimeout);
      }
    };
  }, [onGameOver, onScoreUpdate, onLivesUpdate, isPaused, score, lives, levelComplete, handleScoreUpdate, handleLivesUpdate, handleGameOver, handleLevelComplete]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
} 