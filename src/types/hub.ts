import type { HubConnection } from '@microsoft/signalr';

// hubEvents.ts
export interface HubEvents {
  UserNotFound: (test: number) => void;
  UserConnected: () => void;
  NewSession: (message: string) => void;
}

export interface HubServerMethods {
  GetUser: {
    playerId: string;
    providerId: string;
  };
}

export type TypedHubConnection = Omit<HubConnection, 'on' | 'off' | 'invoke'> & {
  on<K extends keyof HubEvents>(eventName: K, newMethod: HubEvents[K]): void;
  off<K extends keyof HubEvents>(eventName: K, method?: HubEvents[K]): void;
  invoke<K extends keyof HubServerMethods>(eventName: K, args: HubServerMethods[K]): Promise<void>;
};
