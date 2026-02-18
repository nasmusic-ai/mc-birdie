
import React from 'react';
import { SETTINGS, COLORS } from '../constants';
import { PipeData } from '../types';

interface PipeProps {
  data: PipeData;
}

const Pipe: React.FC<PipeProps> = ({ data }) => {
  return (
    <div className="absolute h-full z-20" style={{ left: data.x, width: SETTINGS.pipeWidth }}>
      {/* Top Pipe */}
      <div 
        className="absolute top-0 w-full border-x-4 border-black" 
        style={{ 
          height: data.gapY, 
          backgroundColor: COLORS.pipe,
          borderBottom: '4px solid black'
        }}
      >
        <div className="absolute bottom-0 left-[-4px] right-[-4px] h-6 border-4 border-black" style={{ backgroundColor: COLORS.pipe }} />
      </div>

      {/* Bottom Pipe */}
      <div 
        className="absolute w-full border-x-4 border-black" 
        style={{ 
          top: data.gapY + SETTINGS.pipeGap, 
          height: SETTINGS.height - (data.gapY + SETTINGS.pipeGap),
          backgroundColor: COLORS.pipe,
          borderTop: '4px solid black'
        }}
      >
        <div className="absolute top-0 left-[-4px] right-[-4px] h-6 border-4 border-black" style={{ backgroundColor: COLORS.pipe }} />
      </div>
    </div>
  );
};

export default Pipe;
