'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface AnimalFarmGameProps {
  onScoreUpdate: (score: number) => void;
}

// 动物数据
const ANIMALS = [
  {
    id: 'cow',
    name: '牛',
    sound: '/games/animals/cow.mp3',
    color: '#8B4513',
    x: 150,
    y: 200,
    width: 120,
    height: 100,
    // 牛的音调与持续时间
    frequency: [150, 130],
    duration: [0.5, 0.8]
  },
  {
    id: 'dog',
    name: '狗',
    sound: '/games/animals/dog.mp3',
    color: '#D2691E',
    x: 350,
    y: 250,
    width: 90,
    height: 80,
    // 狗的音调与持续时间
    frequency: [300, 280, 310],
    duration: [0.15, 0.15, 0.15]
  },
  {
    id: 'cat',
    name: '猫',
    sound: '/games/animals/cat.mp3',
    color: '#A0522D',
    x: 500,
    y: 230,
    width: 80,
    height: 70,
    // 猫的音调与持续时间
    frequency: [500, 600],
    duration: [0.3, 0.4]
  },
  {
    id: 'chicken',
    name: '鸡',
    sound: '/games/animals/chicken.mp3',
    color: '#CD853F',
    x: 600,
    y: 300,
    width: 70,
    height: 60,
    // 鸡的音调与持续时间
    frequency: [800, 750, 820],
    duration: [0.1, 0.1, 0.2]
  },
  {
    id: 'sheep',
    name: '羊',
    sound: '/games/animals/sheep.mp3',
    color: '#F5DEB3',
    x: 250,
    y: 320,
    width: 100,
    height: 80,
    // 羊的音调与持续时间
    frequency: [400, 350],
    duration: [0.3, 0.4]
  },
];

// 农场背景颜色
const FARM_BG_COLOR = '#8BC34A'; // 草地绿色
const SKY_COLOR = '#87CEEB';     // 天空蓝色
const BARN_COLOR = '#B22222';    // 谷仓红色

export default function AnimalFarmGame({ onScoreUpdate }: AnimalFarmGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [activeAnimal, setActiveAnimal] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scoreRef = useRef(0);
  // 用于跟踪当前播放的音频元素
  const audioElementsRef = useRef<Record<string, HTMLAudioElement | null>>({
    cow: null,
    dog: null,
    cat: null,
    chicken: null,
    sheep: null
  });
  
  // 保存点击动物时的缩放动画状态
  const [animalAnimations, setAnimalAnimations] = useState<{[key: string]: {scale: number, direction: number}}>({});
  
  // 使用useCallback包装回调函数
  const handleScoreUpdate = useCallback((newScore: number) => {
    scoreRef.current = newScore;
    setScore(newScore);
    // 使用requestAnimationFrame确保在渲染之外调用
    requestAnimationFrame(() => {
      onScoreUpdate(newScore);
    });
  }, [onScoreUpdate]);

  // 播放动物声音
  const playAnimalSound = useCallback((animal: string, index: number) => {
    try {
      // 如果该动物正在播放声音，先停止它
      if (audioElementsRef.current[animal]) {
        audioElementsRef.current[animal]?.pause();
        audioElementsRef.current[animal] = null;
      }
      
      // 创建新的音频元素
      const audio = new Audio(`/games/animals/${animal}.mp3`);
      audio.volume = 1.0; // 设置音量为最大
      
      // 存储音频引用
      audioElementsRef.current[animal] = audio;
      
      // 设置播放结束事件，清理引用
      audio.addEventListener('ended', () => {
        audioElementsRef.current[animal] = null;
      });
      
      // 设置最大播放时间为5秒
      const maxPlayTime = 5000; // 5秒
      const timeoutId = setTimeout(() => {
        if (audioElementsRef.current[animal]) {
          audioElementsRef.current[animal]?.pause();
          audioElementsRef.current[animal] = null;
        }
      }, maxPlayTime);
      
      // 播放音频
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error(`音频播放错误: ${error.message}`);
          audioElementsRef.current[animal] = null;
          clearTimeout(timeoutId);
        });
      }
    } catch (error) {
      console.error('音频播放错误:', error);
      audioElementsRef.current[animal] = null;
    }
  }, []);

  // 初始化动画状态
  useEffect(() => {
    const initialAnimations: {[key: string]: {scale: number, direction: number}} = {};
    ANIMALS.forEach(animal => {
      initialAnimations[animal.id] = { scale: 1, direction: 0 };
    });
    setAnimalAnimations(initialAnimations);
    
    // 创建Web Audio Context
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('无法创建Audio Context:', error);
    }
    
    // 组件卸载时清理
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // 绘制农场和动物
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // 绘制函数
    const draw = () => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 画天空
      ctx.fillStyle = SKY_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height / 3);
      
      // 画草地/农场
      ctx.fillStyle = FARM_BG_COLOR;
      ctx.fillRect(0, canvas.height / 3, canvas.width, canvas.height * 2/3);
      
      // 画太阳
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(canvas.width - 80, 80, 40, 0, Math.PI * 2);
      ctx.fill();
      
      // 画云朵
      ctx.fillStyle = 'white';
      drawCloud(ctx, 100, 100, 60, 30);
      drawCloud(ctx, 300, 70, 80, 40);
      drawCloud(ctx, 500, 120, 70, 35);
      
      // 画谷仓
      drawBarn(ctx, canvas.width - 200, canvas.height / 3 - 80, 150, 160);
      
      // 画围栏
      drawFence(ctx, 50, canvas.height / 2 + 50, canvas.width - 100);
      
      // 画动物
      ANIMALS.forEach(animal => {
        const animation = animalAnimations[animal.id];
        const scale = animation ? animation.scale : 1;
        
        // 保存当前绘图状态
        ctx.save();
        
        // 移动到动物中心点，应用缩放，然后移回
        ctx.translate(animal.x + animal.width/2, animal.y + animal.height/2);
        ctx.scale(scale, scale);
        ctx.translate(-(animal.x + animal.width/2), -(animal.y + animal.height/2));
        
        // 绘制动物
        ctx.fillStyle = animal.color;
        
        if (animal.id === 'cow') {
          drawCow(ctx, animal.x, animal.y, animal.width, animal.height);
        } else if (animal.id === 'dog') {
          drawDog(ctx, animal.x, animal.y, animal.width, animal.height);
        } else if (animal.id === 'cat') {
          drawCat(ctx, animal.x, animal.y, animal.width, animal.height);
        } else if (animal.id === 'chicken') {
          drawChicken(ctx, animal.x, animal.y, animal.width, animal.height);
        } else if (animal.id === 'sheep') {
          drawSheep(ctx, animal.x, animal.y, animal.width, animal.height);
        }
        
        // 添加动物名称
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(animal.name, animal.x + animal.width/2 - 15, animal.y + animal.height + 20);
        
        // 恢复绘图状态
        ctx.restore();
      });
      
      // 动画循环
      requestAnimationFrame(draw);
    };
    
    // 处理动物动画
    const animateAnimals = () => {
      setAnimalAnimations(prev => {
        const newAnimations = {...prev};
        
        Object.keys(newAnimations).forEach(animalId => {
          const animation = newAnimations[animalId];
          
          // 如果有动画方向，则更新缩放
          if (animation.direction !== 0) {
            animation.scale += animation.direction * 0.04;
            
            // 反转方向
            if (animation.scale >= 1.2) {
              animation.direction = -1;
            } else if (animation.scale <= 0.9) {
              animation.direction = 1;
            }
            
            // 如果回到原始大小且方向为负，停止动画
            if (animation.scale <= 1 && animation.direction === -1) {
              animation.scale = 1;
              animation.direction = 0;
            }
          }
        });
        
        return newAnimations;
      });
    };
    
    // 启动绘制和动画
    draw();
    const animationInterval = setInterval(animateAnimals, 50);
    
    // 处理点击事件
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 检查点击是否命中任何动物
      ANIMALS.forEach((animal, index) => {
        if (
          x >= animal.x && 
          x <= animal.x + animal.width && 
          y >= animal.y && 
          y <= animal.y + animal.height
        ) {
          // 播放声音
          playAnimalSound(animal.id, index);
          
          // 设置动画
          setAnimalAnimations(prev => ({
            ...prev,
            [animal.id]: { scale: 1, direction: 1 }
          }));
          
          // 更新分数
          const newScore = scoreRef.current + 1;
          handleScoreUpdate(newScore);
          
          // 设置活跃动物
          setActiveAnimal(animal.id);
          setTimeout(() => setActiveAnimal(null), 1000);
        }
      });
    };
    
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('click', handleClick);
      clearInterval(animationInterval);
    };
  }, [handleScoreUpdate, playAnimalSound]);

  // 在组件卸载时清理所有音频
  useEffect(() => {
    return () => {
      // 停止并清理所有正在播放的音频
      Object.keys(audioElementsRef.current).forEach(key => {
        if (audioElementsRef.current[key]) {
          audioElementsRef.current[key]?.pause();
          audioElementsRef.current[key] = null;
        }
      });
      
      // 关闭AudioContext（如果存在）
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}

// 绘制云朵
function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.beginPath();
  ctx.arc(x, y, height, 0, Math.PI * 2);
  ctx.arc(x + width * 0.4, y - height * 0.2, height * 0.8, 0, Math.PI * 2);
  ctx.arc(x + width * 0.8, y, height, 0, Math.PI * 2);
  ctx.fill();
}

// 绘制谷仓
function drawBarn(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  // 主体
  ctx.fillStyle = BARN_COLOR;
  ctx.fillRect(x, y + height * 0.3, width, height * 0.7);
  
  // 屋顶
  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.moveTo(x - width * 0.1, y + height * 0.3);
  ctx.lineTo(x + width * 0.5, y);
  ctx.lineTo(x + width * 1.1, y + height * 0.3);
  ctx.closePath();
  ctx.fill();
  
  // 门
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + width * 0.35, y + height * 0.5, width * 0.3, height * 0.5);
  
  // 窗户
  ctx.fillStyle = 'white';
  ctx.fillRect(x + width * 0.2, y + height * 0.4, width * 0.15, width * 0.15);
  ctx.fillRect(x + width * 0.65, y + height * 0.4, width * 0.15, width * 0.15);
}

// 绘制围栏
function drawFence(ctx: CanvasRenderingContext2D, x: number, y: number, length: number) {
  const postSpacing = 30;
  const postHeight = 40;
  
  ctx.fillStyle = '#8B4513';
  
  // 横木
  ctx.fillRect(x, y, length, 8);
  ctx.fillRect(x, y - 15, length, 8);
  
  // 立柱
  for (let i = 0; i <= length; i += postSpacing) {
    ctx.fillRect(x + i, y - postHeight, 5, postHeight);
  }
}

// 绘制牛
function drawCow(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  // 身体
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, width * 0.8, height * 0.6);
  
  // 黑色斑点
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.ellipse(x + width * 0.3, y + height * 0.2, width * 0.15, height * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + width * 0.6, y + height * 0.4, width * 0.1, height * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 头
  ctx.fillStyle = 'white';
  ctx.fillRect(x - width * 0.2, y + height * 0.1, width * 0.3, height * 0.4);
  
  // 眼睛
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(x - width * 0.1, y + height * 0.2, width * 0.03, 0, Math.PI * 2);
  ctx.fill();
  
  // 嘴
  ctx.fillStyle = 'pink';
  ctx.fillRect(x - width * 0.2, y + height * 0.4, width * 0.15, height * 0.1);
  
  // 腿
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + width * 0.1, y + height * 0.6, width * 0.1, height * 0.4);
  ctx.fillRect(x + width * 0.6, y + height * 0.6, width * 0.1, height * 0.4);
  
  // 角
  ctx.fillStyle = '#D2691E';
  ctx.beginPath();
  ctx.moveTo(x - width * 0.15, y + height * 0.1);
  ctx.lineTo(x - width * 0.25, y);
  ctx.lineTo(x - width * 0.05, y + height * 0.05);
  ctx.fill();
}

// 绘制狗
function drawDog(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  // 身体
  ctx.fillStyle = '#D2691E';
  ctx.fillRect(x, y, width * 0.7, height * 0.5);
  
  // 头
  ctx.fillStyle = '#D2691E';
  ctx.fillRect(x + width * 0.7, y, width * 0.3, height * 0.4);
  
  // 腿
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + width * 0.1, y + height * 0.5, width * 0.1, height * 0.4);
  ctx.fillRect(x + width * 0.5, y + height * 0.5, width * 0.1, height * 0.4);
  
  // 眼睛
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(x + width * 0.85, y + height * 0.15, width * 0.03, 0, Math.PI * 2);
  ctx.fill();
  
  // 嘴
  ctx.fillStyle = 'black';
  ctx.fillRect(x + width * 0.9, y + height * 0.3, width * 0.1, height * 0.05);
  
  // 尾巴
  ctx.fillStyle = '#D2691E';
  ctx.beginPath();
  ctx.moveTo(x, y + height * 0.2);
  ctx.lineTo(x - width * 0.2, y + height * 0.1);
  ctx.lineTo(x, y + height * 0.3);
  ctx.fill();
  
  // 耳朵
  ctx.fillStyle = '#A52A2A';
  ctx.beginPath();
  ctx.moveTo(x + width * 0.7, y);
  ctx.lineTo(x + width * 0.8, y - height * 0.2);
  ctx.lineTo(x + width * 0.9, y);
  ctx.fill();
}

// 绘制猫
function drawCat(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  // 身体
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(x, y, width * 0.7, height * 0.5);
  
  // 头
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.arc(x + width * 0.85, y + height * 0.2, width * 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // 腿
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + width * 0.1, y + height * 0.5, width * 0.1, height * 0.4);
  ctx.fillRect(x + width * 0.5, y + height * 0.5, width * 0.1, height * 0.4);
  
  // 眼睛
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.ellipse(x + width * 0.8, y + height * 0.15, width * 0.05, height * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + width * 0.95, y + height * 0.15, width * 0.05, height * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 鼻子
  ctx.fillStyle = 'pink';
  ctx.beginPath();
  ctx.arc(x + width * 0.875, y + height * 0.25, width * 0.03, 0, Math.PI * 2);
  ctx.fill();
  
  // 耳朵
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.moveTo(x + width * 0.75, y + height * 0.05);
  ctx.lineTo(x + width * 0.7, y - height * 0.15);
  ctx.lineTo(x + width * 0.85, y + height * 0.05);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + width * 0.95, y + height * 0.05);
  ctx.lineTo(x + width, y - height * 0.15);
  ctx.lineTo(x + width * 0.85, y + height * 0.05);
  ctx.fill();
  
  // 尾巴
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.moveTo(x, y + height * 0.2);
  ctx.quadraticCurveTo(x - width * 0.3, y - height * 0.2, x - width * 0.2, y + height * 0.2);
  ctx.quadraticCurveTo(x - width * 0.1, y + height * 0.3, x, y + height * 0.25);
  ctx.fill();
}

// 绘制鸡
function drawChicken(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  // 身体
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(x + width * 0.5, y + height * 0.5, width * 0.4, height * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 头
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x + width * 0.8, y + height * 0.2, width * 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼睛
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(x + width * 0.85, y + height * 0.15, width * 0.03, 0, Math.PI * 2);
  ctx.fill();
  
  // 喙
  ctx.fillStyle = 'orange';
  ctx.beginPath();
  ctx.moveTo(x + width * 0.9, y + height * 0.2);
  ctx.lineTo(x + width * 1.1, y + height * 0.25);
  ctx.lineTo(x + width * 0.9, y + height * 0.3);
  ctx.fill();
  
  // 鸡冠
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(x + width * 0.7, y + height * 0.1);
  ctx.lineTo(x + width * 0.75, y - height * 0.1);
  ctx.lineTo(x + width * 0.8, y + height * 0.1);
  ctx.lineTo(x + width * 0.85, y - height * 0.1);
  ctx.lineTo(x + width * 0.9, y + height * 0.1);
  ctx.fill();
  
  // 腿
  ctx.fillStyle = 'orange';
  ctx.fillRect(x + width * 0.4, y + height * 0.8, width * 0.05, height * 0.2);
  ctx.fillRect(x + width * 0.55, y + height * 0.8, width * 0.05, height * 0.2);
}

// 绘制羊
function drawSheep(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  // 蓬松的身体
  ctx.fillStyle = '#F5DEB3';
  ctx.beginPath();
  ctx.arc(x + width * 0.4, y + height * 0.5, width * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // 头
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x + width * 0.8, y + height * 0.3, width * 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼睛
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(x + width * 0.85, y + height * 0.25, width * 0.03, 0, Math.PI * 2);
  ctx.fill();
  
  // 耳朵
  ctx.fillStyle = '#D2B48C';
  ctx.beginPath();
  ctx.ellipse(x + width * 0.7, y + height * 0.2, width * 0.05, height * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 腿
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + width * 0.25, y + height * 0.85, width * 0.1, height * 0.15);
  ctx.fillRect(x + width * 0.45, y + height * 0.85, width * 0.1, height * 0.15);
} 