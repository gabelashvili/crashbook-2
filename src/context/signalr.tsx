import React, { createContext, use, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { TypedHubConnection } from '../types/hub';
import { createGameHubConnection } from '../utils/signalr';
import { ModalContext } from './modal';
import InfoIcon from '../components/icons/info';

export interface SignalRContextType {
  connection: TypedHubConnection | null;
  status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

interface SignalRProviderProps {
  children: ReactNode;
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({ children }) => {
  const modalContext = use(ModalContext);
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
          modalContext.setOpen({
            title: 'Something went wrong',
            icon: InfoIcon,
            closable: false,
          });
        }
      });

      connection.current.on('UserNotFound', async () => {
        userNotFoundError.current = true;
        modalContext.setOpen({
          title: 'User or provider id not found',
          icon: InfoIcon,
          closable: false,
        });
      });

      connection.current.on('UserConnected', () => {
        setStatus('connected');
      });

      connection.current.on('NewSession', () => {
        modalContext.setOpen({
          title: 'New session detected',
          icon: InfoIcon,
          closable: false,
        });
      });

      await connection.current.start();
    } catch (error) {
      console.error('Failed to connect to SignalR:', error);
      setStatus('disconnected');
    }
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
