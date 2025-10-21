import GameLayout from './components/layout/game-layout';

function App() {
  return (
    <>
      <div className="w-full grid grid-rows-[minmax(0,_min-content)_1fr] h-dvh">
        <div className="bg-amber-500 h-[50px]">Header</div>
        <GameLayout />
      </div>
    </>
  );
}

export default App;
