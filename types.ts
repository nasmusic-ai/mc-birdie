
export interface PipeData {
  id: number;
  x: number;
  gapY: number;
  scored: boolean;
}

export enum GameState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface GameSettings {
  width: number;
  height: number;
  gravity: number;
  jumpStrength: number;
  pipeSpeed: number;
  pipeWidth: number;
  pipeGap: number;
  birdX: number;
  birdSize: number;
}
