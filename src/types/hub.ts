import type { HubConnection } from '@microsoft/signalr';
import type { User } from './user';
import type { Leaderboard } from './leaderboard';
import type { Burn, Game, MultiplierUpdate } from './game';

export interface HubEvents {
  UserNotFound: (test: number) => void;
  UserConnected: () => void;
  NewSession: (message: string) => void;
  GameData: (data: { user: User; gameData: Game }) => void;
  UpdateBalance: (data: { balance: number }) => void;
  Leaderboard: (data: { leaderboard: Leaderboard }) => void;
  MultiplierUpdate: (data: MultiplierUpdate) => void;
  Burn: (data: Burn) => void;
  NewGame: (data: Game) => void;
  JackpotWin: (data: { jackpot: number; totalWin: number }) => void;
  Win: (data: { multiplier: number; winAmount: number; gameHash: string; resultToken: string }) => void;
  AutoPlayInfoUpdate: (data: { gameNumber: number; totalGames: number }) => void;
  AutoplayStopInfo: () => void;
  AutoplayFinished: () => void;
  AutoplayStartInfo: (data: { totalGames: number; autoCashout: number | null; gameNumber: number }) => void;
}

export interface HubServerMethods {
  UpdateBalance: void;
  GetLeaderboard: void;
  CreateGame: {
    betAmount: number;
    autoCashout?: number;
    totalGames?: number;
  };
  TurnThePage: {
    gameId: number;
  };
  Cashout: {
    gameId: number;
  };
  CancelAutoplay: void;
}

export type TypedHubConnection = Omit<HubConnection, 'on' | 'off' | 'invoke'> & {
  on<K extends keyof HubEvents>(eventName: K, newMethod: HubEvents[K]): void;
  off<K extends keyof HubEvents>(eventName: K, method?: HubEvents[K]): void;

  invoke<K extends keyof HubServerMethods>(
    eventName: K,
    ...args: HubServerMethods[K] extends undefined | void ? [] : [HubServerMethods[K]]
  ): Promise<void>;
};
