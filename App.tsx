
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SETTINGS, COLORS } from './constants';
import { GameState, PipeData } from './types';
import Bird from './components/Bird';
import Pipe from './components/Pipe';
import UI from './components/UI';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [birdY, setBirdY] = useState(SETTINGS.height / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeData[]>([]);
  const [backgroundPos, setBackgroundPos] = useState(0);

  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const nextPipeId = useRef(0);

  // Speed increases with level
  const currentPipeSpeed = SETTINGS.pipeSpeed + (level - 1) * 0.4;

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('mcBirdieHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLevel(1);
    setBirdY(SETTINGS.height / 2);
    setBirdVelocity(0);
    setPipes([]);
    nextPipeId.current = 0;
    setGameState(GameState.PLAYING);
  }, []);

  const jump = useCallback(() => {
    if (gameState === GameState.IDLE) {
      return;
    }
    if (gameState === GameState.PLAYING) {
      setBirdVelocity(SETTINGS.jumpStrength);
    }
  }, [gameState]);

  const endGame = useCallback(() => {
    if (gameState === GameState.PLAYING) {
      setGameState(GameState.GAME_OVER);
      setHighScore(prev => {
        const newer = Math.max(prev, score);
        localStorage.setItem('mcBirdieHighScore', newer.toString());
        return newer;
      });
    }
  }, [gameState, score]);

  const update = useCallback((time: number) => {
    if (gameState !== GameState.PLAYING) return;

    const dt = (time - lastTimeRef.current) / (1000 / 60); 
    lastTimeRef.current = time;

    // Background scrolling
    setBackgroundPos(prev => (prev - currentPipeSpeed * 0.3) % 400);

    // Physics
    setBirdVelocity(v => v + SETTINGS.gravity);
    setBirdY(y => {
      const nextY = y + birdVelocity;
      if (nextY >= SETTINGS.height - SETTINGS.birdSize || nextY <= 0) {
        endGame();
        return y;
      }
      return nextY;
    });

    // Pipe Management
    setPipes(prevPipes => {
      let nextPipes = prevPipes.map(p => ({ ...p, x: p.x - currentPipeSpeed }));
      nextPipes = nextPipes.filter(p => p.x + SETTINGS.pipeWidth > -50);

      const spawnInterval = 200 + (level * 5); // Pipes get closer or logic adjusts
      if (nextPipes.length === 0 || (SETTINGS.width - nextPipes[nextPipes.length - 1].x) >= spawnInterval) {
        const minGapY = 100;
        const maxGapY = SETTINGS.height - SETTINGS.pipeGap - 100;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        nextPipes.push({
          id: nextPipeId.current++,
          x: SETTINGS.width,
          gapY,
          scored: false
        });
      }

      for (let p of nextPipes) {
        if (!p.scored && p.x + SETTINGS.pipeWidth < SETTINGS.birdX) {
          p.scored = true;
          setScore(s => {
            const newScore = s + 1;
            
            // Level up every 5 points
            if (newScore % 5 === 0) {
              setLevel(l => l + 1);
            }
            
            return newScore;
          });
        }

        const birdLeft = SETTINGS.birdX + 4;
        const birdRight = SETTINGS.birdX + SETTINGS.birdSize - 4;
        const birdTop = birdY + 4;
        const birdBottom = birdY + SETTINGS.birdSize - 4;

        if (birdRight > p.x && birdLeft < p.x + SETTINGS.pipeWidth) {
          if (birdTop < p.gapY || birdBottom > p.gapY + SETTINGS.pipeGap) {
            endGame();
          }
        }
      }
      return nextPipes;
    });

    gameLoopRef.current = requestAnimationFrame(update);
  }, [gameState, birdVelocity, birdY, endGame, currentPipeSpeed, level]);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      lastTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(update);
    } else {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, update]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 select-none">
      {gameState === GameState.IDLE ? (
        <WelcomeScreen onStart={resetGame} highScore={highScore} />
      ) : (
        <div 
          className="relative shadow-2xl overflow-hidden cursor-pointer rounded-lg border-8 border-black group"
          style={{ width: SETTINGS.width, height: SETTINGS.height, backgroundColor: COLORS.sky }}
          onClick={jump}
        >
          {/* Parallax Clouds */}
          <div 
            className="absolute inset-0 opacity-40 z-0 pointer-events-none"
            style={{ 
              background: `url('https://github.com/nasmusic-ai/RAW/blob/main/mcdo.png?raw=true') repeat-x center`, 
              backgroundSize: 'contain', 
              transform: `translateX(${backgroundPos * 0.5}px)` 
            }}
          />
          
          {/* Background Hills */}
          <div 
            className="absolute bottom-12 w-[400%] h-32 z-1 bg-green-800/30 opacity-50 rounded-[50%]"
            style={{ transform: `translateX(${backgroundPos}px)` }}
          />

          {/* The Game World */}
          <Bird y={birdY} velocity={birdVelocity} />
          {pipes.map(pipe => (
            <Pipe key={pipe.id} data={pipe} />
          ))}

          {/* Ground */}
          <div 
            className="absolute bottom-0 w-full h-12 bg-[#ded895] border-t-4 border-black z-40 flex overflow-hidden"
          >
            <div 
              className="flex shrink-0"
              style={{ 
                width: '400%',
                background: `repeating-linear-gradient(45deg, #ded895, #ded895 20px, #d3c984 20px, #d3c984 40px)`,
                transform: `translateX(${backgroundPos * 2}px)`
              }} 
            />
          </div>

          {/* UI Layer */}
          <UI 
            gameState={gameState} 
            score={score} 
            level={level}
            highScore={highScore} 
            onStart={resetGame} 
          />
        </div>
      )}
      
      {/* Decorative Branding */}
      <div className="mt-8 text-center text-white/50 space-y-2">
        <div className="flex gap-4 justify-center">
            <i className="fa-solid fa-cloud animate-bounce delay-75"></i>
            <i className="fa-solid fa-bird animate-bounce delay-150"></i>
            <i className="fa-solid fa-mountain animate-bounce delay-300"></i>
        </div>
      </div>
    </div>
  );
};

export default App;
