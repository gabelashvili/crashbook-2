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
