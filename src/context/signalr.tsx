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
import { JackpotContext } from './jackpot';
import { PlaceNextBetContext } from './place-next-bet';

export interface SignalRContextType {
  connection: TypedHubConnection | null;
  status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

interface SignalRProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    signalRConnection?: TypedHubConnection;
  }
}

const SignalRProvider: React.FC<SignalRProviderProps> = ({ children }) => {
  const gameContext = use(GameContext)!;
  const openContext = use(OpenContext);
  const turnContext = use(TurnContext);
  const winContext = use(WinContext);
  const burnContext = use(BurnContext);
  const jackpotContext = use(JackpotContext);
  const infoModalContext = use(InfoModalContext);
  const placeNextBetContext = use(PlaceNextBetContext);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'reconnecting' | 'disconnected'>('connecting');
  const connection = useRef<TypedHubConnection | null>(null);
  const lastPageTurnTime = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gamePlayedRef = useRef<number>(0);

  /// TODO: if hackpot happen hide loader

  // Temp solution when user not found error is thrown, we don't want to show the modal again on disconnect
  const userNotFoundError = useRef(false);

  const searchParams = new URLSearchParams(window.location.search);
  const providerId = searchParams.get('providerId');
  const playerId = searchParams.get('playerId');
  const isAutoPlay = false;

  const hideLoader = () => {
    if (lastPageTurnTime.current) {
      console.log('hide loader');
      clearTimeout(lastPageTurnTime.current);
      lastPageTurnTime.current = null;
    }
  };

  const createConnection = useCallback(async () => {
    if (!playerId || !providerId) {
      console.error('Missing playerId or providerId');
      setStatus('disconnected');
      return;
    }

    try {
      connection.current = createGameHubConnection(playerId, providerId);

      const originalInvoke: typeof connection.current.invoke = connection.current.invoke.bind(connection.current);

      connection.current.invoke = async (
        ...args: Parameters<typeof originalInvoke>
      ): ReturnType<typeof originalInvoke> => {
        const [methodName, ...rest] = args;
        console.log(`[SignalR Invoke] → ${methodName}`, ...rest);

        if (methodName === 'TurnThePage') {
          lastPageTurnTime.current = setTimeout(() => {
            console.log('show loader');
          }, 700);
        }

        if (methodName === 'CreateGame') {
          lastPageTurnTime.current = setTimeout(
            () => {
              console.log('show loader');
            },
            isAutoPlay ? 700 : gameContext.state.defaultOpenTime + 700,
          );
        }

        return originalInvoke(...args);
      };

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
            },
          });
          gameContext.dispatch({ type: 'UPDATE_GAME_PLAYED' });
        }
      });

      connection.current.on('UpdateBalance', (data: { balance: number }) => {
        gameContext.dispatch({ type: 'UPDATE_USER', payload: { balance: data.balance } });
      });

      connection.current.on('Leaderboard', (data) => {
        gameContext.dispatch({ type: 'SET_LEADERBOARD', payload: data.leaderboard });
      });

      connection.current.on('MultiplierUpdate', (data: MultiplierUpdate) => {
        winContext.setIsPlaying(true);
        hideLoader();
        gameContext.dispatch({ type: 'UPDATE_MULTIPLIER', payload: data });
        turnContext.show({
          duration: gameContext.state.defaultWinTime * 0.3,
          onFinish: () => {
            winContext.show(
              gameContext.state.defaultWinTime * 0.7,
              formatFormula(data.formula),
              data.potentialWin.toString(),
            );
          },
        });
      });

      connection.current.on('Burn', async (data) => {
        gameContext.dispatch({ type: 'SET_GAME', payload: null });
        winContext.setIsPlaying(true);
        turnContext.show({
          duration: gameContext.state.defaultWinTime * 0.3,
          onFinish: async () => {
            console.log('burn daiwyoo');
            await winContext.show(gameContext.state.defaultWinTime * 0.5, formatFormula(data.formula || '1/2'), '0.00');
            await burnContext.show(gameContext.state.defaultBurnTime * 0.5);
            await placeNextBetContext.show(2.5);
          },
        });

        hideLoader();
      });

      connection.current.on('Win', async () => {
        window.removeWinAnimation?.();
        window.removeBurnAnimation?.();
        window.removePlaceNextBetAnimation?.();
        window.removeJackpotAnimation?.();
        gameContext.dispatch({ type: 'SET_GAME', payload: null });
        await placeNextBetContext.show(2.5);

        hideLoader();
      });

      connection.current.on('NewGame', async (data) => {
        hideLoader();
        window.removeWinAnimation?.();
        window.removeBurnAnimation?.();
        window.removePlaceNextBetAnimation?.();
        window.removeJackpotAnimation?.();

        gameContext.dispatch({ type: 'SET_GAME', payload: data });
        gameContext.dispatch({ type: 'UPDATE_GAME_PLAYED' });

        if (gamePlayedRef.current > 0) {
          turnContext.show({
            duration: 1,
            onFinish: () => {
              winContext.show(
                gameContext.state.defaultWinTime * 0.7,
                formatFormula(data.formula),
                data.potentialWin.toString(),
              );
            },
          });
        } else {
          openContext.show({ duration: 2.5 });
          await new Promise((resolve) => setTimeout(resolve, 2500));
          turnContext.show({
            duration: 0.001,
            onFinish: () => {
              winContext.show(4, formatFormula(data.formula), data.potentialWin.toString());
            },
          });
        }
      });

      connection.current.on('JackpotWin', async (data) => {
        hideLoader();
        gameContext.dispatch({ type: 'SET_GAME', payload: null });
        await jackpotContext.show(10, data.jackpot.toString());
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await placeNextBetContext.show(2.5);
      });

      await connection.current.start();
      window.signalRConnection = connection.current;
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

  useEffect(() => {
    gamePlayedRef.current = gameContext.state.gamePlayed;
  }, [gameContext.state.gamePlayed]);

  const value: SignalRContextType = {
    connection: connection.current,
    status,
  };

  return <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>;
};

export { SignalRContext, SignalRProvider };
