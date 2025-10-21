export interface Game {
  gameState: number;
  stepStyle: number;
  nextMultiplier: number;
  turn: number;
  betAmount: number;
  id: number;
  multiplier: number;
  gameHash: string;
  formula: string;
  potentialWin: number;
}

export interface MultiplierUpdate {
  multiplier: number;
  nextMultiplier: number;
  turn: number;
  formula: string;
  potentialWin: number;
}

export interface Burn {
  formula: string;
  gameHash: string;
  resultToken: string;
  winAmount: number;
}
