import GameLayout from './components/layout/game-layout';

function App() {
  return (
    <div className="w-full grid grid-rows-[minmax(0,_min-content)_1fr] h-dvh bg-[url('/src/assets/images/body-bg-mobile.png')] md:bg-[url('/src/assets/images/body-bg.png')] bg-size-[100%_100%] bg-center">
      <div className="bg-amber-500 h-[50px]">Header</div>
      <GameLayout />
    </div>
  );
}

export default App;
