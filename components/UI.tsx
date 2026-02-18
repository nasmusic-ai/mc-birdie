
import React, { useEffect, useState } from 'react';
import { GameState } from '../types';

interface UIProps {
  gameState: GameState;
  score: number;
  level: number;
  highScore: number;
  onStart: () => void;
}

const UI: React.FC<UIProps> = ({ gameState, score, level, highScore, onStart }) => {
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (level > 1 && gameState === GameState.PLAYING) {
      setShowLevelUp(true);
      const timer = setTimeout(() => setShowLevelUp(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [level, gameState]);

  if (gameState === GameState.IDLE) return null;

  if (gameState === GameState.PLAYING) {
    return (
      <div className="absolute inset-x-0 top-10 flex flex-col items-center z-50 pointer-events-none">
        <span className="text-4xl text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] select-none">
          {score}
        </span>
        <span className="text-[10px] text-yellow-300 mt-2 font-bold drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
          LEVEL {level}
        </span>
        
        {showLevelUp && (
          <div className="mt-20 animate-bounce">
            <span className="text-2xl text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,1)] font-bold italic">
              LEVEL UP!
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-300">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-red-500 animate-bounce">GAME OVER</h2>
        <div className="bg-amber-100/20 p-6 rounded-xl border-4 border-white inline-block">
          <p className="text-lg mb-2">SCORE: <span className="text-yellow-400">{score}</span></p>
          <p className="text-sm mb-2">LEVEL: <span className="text-blue-400">{level}</span></p>
          <p className="text-xs">BEST: <span className="text-white">{highScore}</span></p>
        </div>
        <button 
          onClick={onStart}
          className="block w-full bg-blue-500 hover:bg-blue-400 border-b-8 border-blue-700 active:border-b-0 active:translate-y-2 text-white px-8 py-4 text-xl rounded-lg transition-all font-bold"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  );
};

export default UI;
