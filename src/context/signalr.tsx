import React, { createContext, use, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { TypedHubConnection } from '../types/hub';
import { createGameHubConnection } from '../utils/signalr';
import { InfoModalContext } from './info-modal';
import InfoIcon from '../components/icons/info';
import { GameContext } from './game';
import { OpenContext } from './open';
import { TurnContext } from './turn';
import { WinContext } from './win';
import { formatFormula } from '../utils/formula';
import type { MultiplierUpdate } from '../types/game';
import { BurnContext } from './burn';

export interface SignalRContextType {
  connection: TypedHubConnection | null;
  status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

interface SignalRProviderProps {
  children: ReactNode;
}

const SignalRProvider: React.FC<SignalRProviderProps> = ({ children }) => {
  const gameContext = use(GameContext)!;
  const openContext = use(OpenContext);
  const turnContext = use(TurnContext);
  const winContext = use(WinContext);
  const burnContext = use(BurnContext);
  const infoModalContext = use(InfoModalContext);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'reconnecting' | 'disconnected'>('connecting');
  const connection = useRef<TypedHubConnection | null>(null);

  // Temp solution when user not found error is thrown, we don't want to show the modal again on disconnect
  const userNotFoundError = useRef(false);

  const searchParams = new URLSearchParams(window.location.search);
  const providerId = searchParams.get('providerId');
  const playerId = searchParams.get('playerId');

  const createConnection = useCallback(async () => {
    if (!playerId || !providerId) {
      console.error('Missing playerId or providerId');
      setStatus('disconnected');
      return;
    }

    try {
      connection.current = createGameHubConnection(playerId, providerId);

      connection.current.onreconnecting(() => {
        setStatus('reconnecting');
      });

      connection.current.onreconnected(() => {
        setStatus('connected');
      });

      connection.current.onclose(() => {
        setStatus('disconnected');
        if (!userNotFoundError.current) {
          infoModalContext.setOpen({
            title: 'Something went wrong',
            icon: InfoIcon,
            closable: false,
          });
        }
      });

      connection.current.on('UserNotFound', async () => {
        userNotFoundError.current = true;
        infoModalContext.setOpen({
          title: 'User or provider id not found',
          icon: InfoIcon,
          closable: false,
        });
      });

      connection.current.on('UserConnected', () => {
        setStatus('connected');
      });

      connection.current.on('NewSession', () => {
        infoModalContext.setOpen({
          title: 'New session detected',
          icon: InfoIcon,
          closable: false,
        });
      });

      connection.current.on('GameData', (data) => {
        gameContext.dispatch({ type: 'SET_USER', payload: data.user });
        if (!data.gameData) {
          openContext.show({ showIddle: true });
        }

        if (data.gameData) {
          gameContext.dispatch({ type: 'SET_GAME', payload: data.gameData });
          turnContext.show({
            duration: 0.01,
            onFinish: () => {
              winContext.show(2, formatFormula(data.gameData.formula), data.gameData.potentialWin.toString());
              turnContext.setOnFlipCallback(() => turnContext.show({ duration: 2 }));
            },
          });
        }
      });

      connection.current.on('UpdateBalance', (data: { balance: number }) => {
        gameContext.dispatch({ type: 'UPDATE_USER', payload: { balance: data.balance } });
      });

      connection.current.on('Leaderboard', (data) => {
        gameContext.dispatch({ type: 'SET_LEADERBOARD', payload: data.leaderboard });
      });

      connection.current.on('MultiplierUpdate', (data: MultiplierUpdate) => {
        gameContext.dispatch({ type: 'UPDATE_MULTIPLIER', payload: data });
        winContext.setIsPlaying(true);
        turnContext.show({
          duration: gameContext.state.defaultWinTime * 0.3,
          onFinish: () => {
            winContext.show(
              gameContext.state.defaultWinTime * 0.7,
              formatFormula(data.formula),
              data.potentialWin.toString(),
            );
            turnContext.setOnFlipCallback(() => turnContext.show({ duration: gameContext.state.defaultWinTime * 0.3 }));
          },
        });
      });

      connection.current.on('Burn', (data) => {
        gameContext.dispatch({ type: 'SET_GAME', payload: null });
        burnContext.show(gameContext.state.defaultBurnTime, formatFormula(data.formula || '1/2'), '0,00');
      });

      connection.current.on('NewGame', (data) => {
        gameContext.dispatch({ type: 'SET_GAME', payload: data });

        turnContext.show({
          duration: gameContext.state.defaultWinTime * 0.3,
          onFinish: () => {
            winContext.show(
              gameContext.state.defaultWinTime * 0.7,
              formatFormula(data.formula),
              data.potentialWin.toString(),
            );
            turnContext.setOnFlipCallback(() => turnContext.show({ duration: 2 }));
          },
        });
      });

      await connection.current.start();
      connection.current.invoke('GetLeaderboard');
    } catch (error) {
      console.error('Failed to connect to SignalR:', error);
      setStatus('disconnected');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, providerId]);

  useEffect(() => {
    createConnection();

    return () => {
      if (connection.current) {
        connection.current.stop().catch(console.error);
      }
    };
  }, [createConnection]);

  const value: SignalRContextType = {
    connection: connection.current,
    status,
  };

  return <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>;
};

export { SignalRContext, SignalRProvider };
