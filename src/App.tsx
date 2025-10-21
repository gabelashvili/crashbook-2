import { use } from 'react';
import Header from './components/header';
import GameLayout from './components/layout/game-layout';
import { GameContext } from './context/game';
import LoadingIcon from './components/icons/loading';

function App() {
  const user = use(GameContext)?.state.user;

  if (!user) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <LoadingIcon className="size-12 text-[#C5A973]" />
      </div>
    );
  }
  return (
    <>
      <div className="w-full grid grid-rows-[minmax(0,_min-content)_1fr] h-dvh">
        <Header />
        <GameLayout />
      </div>
    </>
  );
}

export default App;
