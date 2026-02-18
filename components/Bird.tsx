
import React from 'react';
import { SETTINGS } from '../constants';

interface BirdProps {
  y: number;
  velocity: number;
}

const Bird: React.FC<BirdProps> = ({ y, velocity }) => {
  // Rotate bird based on velocity
  const rotation = Math.min(Math.max(velocity * 8, -25), 90);

  return (
    <div
      className="absolute z-30 transition-transform duration-75"
      style={{
        left: SETTINGS.birdX,
        top: y,
        width: SETTINGS.birdSize,
        height: SETTINGS.birdSize,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Sprite: A cute round bird with a hat */}
      <div className="relative w-full h-full">
        {/* Main Body */}
        <div className="absolute inset-0 bg-yellow-400 rounded-full border-[3px] border-black shadow-inner" />
        
        {/* Eye */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-1 h-1 bg-black rounded-full" />
        </div>

        {/* Beak */}
        <div className="absolute top-1/2 -right-1 w-4 h-3 bg-orange-500 rounded-sm border-2 border-black transform -translate-y-1/2" />

        {/* Wing */}
        <div className="absolute top-1/2 left-1 w-5 h-4 bg-yellow-200 rounded-full border-2 border-black transform -translate-y-1/2 animate-bounce" />

        {/* Tam o' Shanter Hat (Scottish theme) */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-4">
           <div className="w-full h-2 bg-red-600 rounded-t-lg border-2 border-black" />
           <div className="w-2 h-2 bg-blue-600 rounded-full border-2 border-black absolute -top-1 left-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Bird;
