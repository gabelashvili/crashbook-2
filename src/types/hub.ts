import type { HubConnection } from '@microsoft/signalr';
import type { User } from './user';
import type { Leaderboard } from './leaderboard';

export interface HubEvents {
  UserNotFound: (test: number) => void;
  UserConnected: () => void;
  NewSession: (message: string) => void;
  GameData: (data: { user: User }) => void;
  UpdateBalance: (data: { balance: number }) => void;
  Leaderboard: (data: { leaderboard: Leaderboard }) => void;
}

export interface HubServerMethods {
  UpdateBalance: void;
  GetLeaderboard: void;
}

export type TypedHubConnection = Omit<HubConnection, 'on' | 'off' | 'invoke'> & {
  on<K extends keyof HubEvents>(eventName: K, newMethod: HubEvents[K]): void;
  off<K extends keyof HubEvents>(eventName: K, method?: HubEvents[K]): void;

  invoke<K extends keyof HubServerMethods>(
    eventName: K,
    ...args: HubServerMethods[K] extends undefined | void ? [] : [HubServerMethods[K]]
  ): Promise<void>;
};
