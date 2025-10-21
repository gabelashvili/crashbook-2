import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import type { TypedHubConnection } from '../types/hub-events';

export const createGameHubConnection = (playerId: string, providerId: string): TypedHubConnection =>
  new HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_API_URL}/gameHub?playerId=${playerId}&providerId=${providerId}`)
    .withAutomaticReconnect([0, 2000, 5000, 10000]) // retry schedule
    .configureLogging(LogLevel.Information)
    .build() as TypedHubConnection;
