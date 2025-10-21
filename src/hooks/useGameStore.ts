import { useReducer } from 'react';

// Define the state
type State = {
  animationPending: boolean;
  hubPending: boolean;
  providerId: number;
  playerId: number;
};

// Action types as discriminated union
type Action =
  | { type: 'SET_ANIMATION_PENDING'; payload: State['animationPending'] }
  | { type: 'SET_HUB_PENDING'; payload: State['hubPending'] }
  | { type: 'SET_PROVIDER_ID'; payload: State['providerId'] }
  | { type: 'SET_PLAYER_ID'; payload: State['playerId'] }
  | { type: 'SET_MULTIPLE_FIELDS'; payload: Partial<State> };

// Reducer using switch
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ANIMATION_PENDING':
      return { ...state, animationPending: action.payload };
    case 'SET_HUB_PENDING':
      return { ...state, hubPending: action.payload };
    case 'SET_PROVIDER_ID':
      return { ...state, providerId: action.payload };
    case 'SET_PLAYER_ID':
      return { ...state, playerId: action.payload };
    case 'SET_MULTIPLE_FIELDS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Initial state
const initialState: State = {
  animationPending: true,
  hubPending: true,
  providerId: 0,
  playerId: 0,
};

// Hook
function useGameStore() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}

export default useGameStore;
