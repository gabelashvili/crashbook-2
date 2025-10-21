import { useReducer } from 'react';
import type { User } from '../types/user';
import type { Leaderboard } from '../types/leaderboard';

// Define the state
type State = {
  providerId: number;
  playerId: number;
  user: User | null;
  leaderboard: Leaderboard | null;
};

// Action types as discriminated union
type Action =
  | { type: 'SET_PROVIDER_ID'; payload: State['providerId'] }
  | { type: 'SET_PLAYER_ID'; payload: State['playerId'] }
  | { type: 'SET_USER'; payload: State['user'] }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LEADERBOARD'; payload: Leaderboard }
  | { type: 'SET_MULTIPLE_FIELDS'; payload: Partial<State> };

// Reducer using switch
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PROVIDER_ID':
      return { ...state, providerId: action.payload };
    case 'SET_PLAYER_ID':
      return { ...state, playerId: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_USER':
      return state.user ? { ...state, user: { ...state.user, ...action.payload } } : state;
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'SET_MULTIPLE_FIELDS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Initial state
const initialState: State = {
  providerId: 0,
  playerId: 0,
  user: null,
  leaderboard: null,
};

// Hook
function useGameStore() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}

export default useGameStore;
