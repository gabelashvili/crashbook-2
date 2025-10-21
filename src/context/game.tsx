import React, { createContext, use, useEffect, type ReactNode } from 'react';
import useGameStore from '../hooks/useGameStore';
import { InfoModalContext } from './info-modal';
import InfoIcon from '../components/icons/info';

export interface GameContextType {
  providerId: string | null;
  playerId: string | null;
  state: ReturnType<typeof useGameStore>['state'];
  dispatch: ReturnType<typeof useGameStore>['dispatch'];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const infoModalContext = use(InfoModalContext);

  const { dispatch, state } = useGameStore();
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
      infoModalContext.setOpen({
        title: 'No player or provider id found',
        icon: InfoIcon,
        closable: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId, playerId, dispatch]);

  return (
    <GameContext.Provider value={{ providerId, playerId, state, dispatch }}>
      {playerId && providerId ? children : null}
    </GameContext.Provider>
  );
};

export { GameProvider, GameContext };
