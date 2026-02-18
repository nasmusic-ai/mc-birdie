
import React from 'react';
import { SETTINGS } from '../constants';

interface WelcomeScreenProps {
  onStart: () => void;
  highScore: number;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, highScore }) => {
  return (
    <div 
      className="relative flex flex-col items-center justify-between p-8 bg-[#70c5ce] border-8 border-black text-white"
      style={{ width: SETTINGS.width, height: SETTINGS.height }}
    >
      {/* Tartan Border Decoration */}
      <div className="absolute inset-0 border-[12px] border-double border-red-800/20 pointer-events-none" />

      {/* Header Section */}
      <div className="mt-8 text-center z-10">
        <h1 className="text-4xl font-bold leading-tight drop-shadow-[0_6px_0_rgba(0,0,0,0.5)] text-yellow-400 mb-2">
          MC BIRDIE
        </h1>
        <p className="text-[10px] tracking-widest text-black/60 uppercase">The Highland Flyer</p>
      </div>

      {/* Hero Animation */}
      <div className="relative group py-4">
        <div className="w-24 h-24 bg-yellow-400 rounded-full border-4 border-black shadow-2xl animate-bounce relative">
           {/* Eyes */}
           <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full border-4 border-black flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full" />
           </div>
           {/* Beak */}
           <div className="absolute top-1/2 -right-4 w-8 h-6 bg-orange-500 rounded-sm border-4 border-black transform -translate-y-1/2" />
           {/* Hat */}
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-8">
              <div className="w-full h-4 bg-red-600 rounded-t-xl border-4 border-black" />
              <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-black absolute -top-2 left-1/2 -translate-x-1/2" />
           </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/10 rounded-full blur-sm" />
      </div>

      {/* Instructions */}
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-4 border-black w-full text-center space-y-4 shadow-xl">
        <h2 className="text-xs font-bold text-black border-b-2 border-black/20 pb-2">HOW TO PLAY</h2>
        <div className="grid grid-cols-1 gap-3 text-[9px] text-slate-800 font-bold">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg">
              <i className="fa-solid fa-arrow-up"></i>
            </div>
            <span>SPACE OR CLICK TO FLY</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg">
              <i className="fa-solid fa-ghost"></i>
            </div>
            <span>AVOID THE GREEN PIPES</span>
          </div>
        </div>
        {highScore > 0 && (
          <div className="pt-2 border-t-2 border-black/10">
            <p className="text-[8px] text-red-800">BEST SCORE: {highScore}</p>
          </div>
        )}
      </div>

      {/* Footer / Start Action */}
      <div className="mb-8 w-full">
        <button 
          onClick={onStart}
          className="w-full bg-green-500 hover:bg-green-400 border-b-[10px] border-green-700 active:border-b-0 active:translate-y-2 text-white px-8 py-5 text-xl rounded-xl transition-all font-bold shadow-lg"
        >
          START GAME
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
