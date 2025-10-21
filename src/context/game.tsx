import React, { createContext, use, useEffect, type ReactNode } from 'react';
import useGameStore from '../hooks/useGameStore';
import { ModalContext } from './modal';
import InfoIcon from '../components/icons/info';

export interface GameContextType {
  providerId: string | null;
  playerId: string | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const modalContext = use(ModalContext);

  const { dispatch } = useGameStore();
  const searchParams = new URLSearchParams(window.location.search);
  const providerId = searchParams.get('providerId');
  const playerId = searchParams.get('playerId');

  useEffect(() => {
    if (Number(playerId) && Number(providerId)) {
      dispatch({
        type: 'SET_MULTIPLE_FIELDS',
        payload: { playerId: Number(playerId), providerId: Number(providerId) },
      });
    }

    if (!playerId || !providerId) {
      modalContext.setOpen({
        title: 'No player or provider id found',
        icon: InfoIcon,
        closable: false,
      });
    }
  }, [providerId, playerId, dispatch, modalContext]);

  return (
    <GameContext.Provider value={{ providerId, playerId }}>
      {playerId && providerId ? children : null}
    </GameContext.Provider>
  );
};
