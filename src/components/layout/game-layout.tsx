import { useContext } from 'react';
import { AnimationContext } from '../../context/animation';
import { OpenContext } from '../../context/open';
import { TurnContext } from '../../context/turn';
import { FormulaContext } from '../../context/formula';
import { WinContext } from '../../context/win';
import { BurnContext } from '../../context/burn';
import { SignalRContext } from '../../context/signalr';
import { GameContext } from '../../context/game';
import cn from '../../utils/cn';

const GameLayout = () => {
  const animationContext = useContext(AnimationContext);
  const signalRContext = useContext(SignalRContext);
  const bookOpenContext = useContext(OpenContext);
  const turnContext = useContext(TurnContext);
  const formulaContext = useContext(FormulaContext);
  const winContext = useContext(WinContext);
  const burnContext = useContext(BurnContext);
  const gameContext = useContext(GameContext);
  console.log(gameContext?.state.game);
  return (
    <div className="grid grid-rows-[1fr_minmax(0,_min-content)]  py-6 max-w-2xl aspect-[1/1.5] max-h-[780px] w-full m-auto px-2">
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#1B092469]/60">
        <img
          src="/src/assets/images/game-container-hood.png"
          alt="game-container-hood"
          className="w-full absolute top-0 left-0 aspect-[1/0.24]"
        />
        <div className="absolute px-2 left-[8.2%] top-[2px] w-16 text-[11px] sm:text-sm sm:w-20 flex items-center justify-center aspect-[1/0.9] bg-[url('/src/assets/images/score-bg.png')] bg-size-[100%_100%]">
          <p className="pb-3 sm:px-2 font-semibold flex gap-0.5 text-white">
            <span className="text-[#48B098]">100</span> <span>/</span>
            <span>100</span>
          </p>
        </div>
        <div
          className="bg-red-500 w-full h-[64px] min-h-[64px] sm:h-[78px] sm:min-h-[78px]"
          id="notification-container"
        >
          Header
        </div>
        <div ref={animationContext.setContainer} className="h-full w-full flex z-10" />
        <div
          id="flip-next"
          className={cn(
            'w-full h-[50px] min-h-[70px] flex items-center justify-center',
            !gameContext?.state.game ? 'opacity-60 pointer-events-none' : ' opacity-100',
          )}
          onClick={() => {
            console.log(winContext.isPlaying);
            if (winContext.isPlaying) {
              winContext.finish();
              return;
            }
            if (!gameContext?.state.game?.id) {
              return;
            }
            signalRContext?.connection?.invoke('TurnThePage', { gameId: gameContext?.state.game?.id });
          }}
        >
          <img src="/src/assets/images/next.png" alt="flip-next" className="w-[80%] h-[40px]" />
        </div>
      </div>
      <div className="bg-blue-500 h-fit min-h-[150px] space-x-6">
        <button
          onClick={() => {
            signalRContext?.connection?.invoke('CreateGame', { betAmount: 100 });
          }}
        >
          Create Game
        </button>
        <button
          onClick={() => {
            if (winContext.isPlaying) {
              winContext.finish();
            } else {
              console.log('win is not playing');
            }
          }}
        >
          Stop win
        </button>
        <button onClick={() => gameContext?.dispatch({ type: 'SET_GAME', payload: null })}>Reset game</button>
        {/* <button
          onClick={() => {
            bookOpenContext.show({ showIddle: true });
          }}
        >
          show idle
        </button>
        <button
          onClick={() => {
            bookOpenContext.show({ duration: 1 });
          }}
        >
          show open
        </button>
        <button
          onClick={async () => {
            await turnContext.show({
              duration: 1,
              onFinish: () => console.log('fin'),
            });
          }}
        >
          show turn
        </button>
        <button
          onClick={() => {
            formulaContext.show(
              animationContext.spines.win!,
              [
                'open-bracket',
                '1',
                '3',
                'plus',
                '2',
                'close-bracket',
                'multiply',
                '4',
                'minus',
                '5',
                'divide',
                '2',
                'equal',
                '1',
                '4',
              ],
              {
                durationSec: 2,
                onFinish: () => {
                  console.log('formula complete');
                },
              },
            );
          }}
        >
          show formula
        </button>
        <button
          onClick={() => {
            turnContext.setOnFlipCallback(() => turnContext.show({ duration: 1 }));
          }}
        >
          set on flip callback
        </button>
        <button
          onClick={() => {
            winContext.show(
              5,
              ['1', '3', 'plus', '2', 'close-bracket', 'multiply', '4', 'minus', '5', 'divide', '2', 'equal', '1', '4'],
              '100.00',
            );
          }}
        >
          show win
        </button>
        <button
          onClick={() => {
            burnContext.show(
              8,
              ['1', '3', 'plus', '2', 'close-bracket', 'multiply', '4', 'minus', '5', 'divide', '2', 'equal', '1', '4'],
              '356.25',
            );
          }}
        >
          show burn
        </button> */}
      </div>
    </div>
  );
};

export default GameLayout;
