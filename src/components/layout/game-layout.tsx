import { useContext } from 'react';
import { AnimationContext } from '../../context/animation';
import { OpenContext } from '../../context/open';
import { WinContext } from '../../context/win';
import { SignalRContext } from '../../context/signalr';
import { GameContext } from '../../context/game';
import cn from '../../utils/cn';
import { JackpotContext } from '../../context/jackpot';
import { BurnContext } from '../../context/burn';

const GameLayout = () => {
  const animationContext = useContext(AnimationContext);
  const signalRContext = useContext(SignalRContext);
  const winContext = useContext(WinContext);
  const gameContext = useContext(GameContext);
  const openContext = useContext(OpenContext);
  const jackpotContext = useContext(JackpotContext);
  const burnContext = useContext(BurnContext);

  return (
    <div className="grid grid-rows-[1fr_minmax(0,_min-content)]  py-6 max-w-2xl aspect-[1/1.7] max-h-[850px] w-full m-auto px-2">
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
        <div className=" w-full h-[64px] min-h-[64px] sm:h-[78px] sm:min-h-[78px]" id="notification-container"></div>
        <div ref={animationContext.setContainer} className="h-full w-full flex z-10" />
        <div
          id="flip-next"
          className={cn(
            'w-full h-[50px] min-h-[50px] md:min-h-[70px] flex items-center justify-center',
            !gameContext?.state.game ? 'opacity-60 pointer-events-none' : ' opacity-100',
          )}
          onClick={() => {
            setTimeout(() => {
              if (!gameContext?.state.game?.id) {
                return;
              }
              if (winContext.isPlaying) {
                winContext.finish();
                return;
              }
              signalRContext?.connection?.invoke('TurnThePage', { gameId: gameContext?.state.game?.id });
            }, 0);
          }}
        >
          <img src="/src/assets/images/next.png" alt="flip-next" className="w-[80%] h-[30px] md:h-[40px]" />
        </div>
      </div>
      <div className="bg-blue-500 h-fit min-h-[150px] space-x-6">
        <button
          onClick={async () => {
            if (!gameContext?.state.prevGameDetails) {
              openContext.show({ duration: gameContext!.state.defaultOpenTime! });
              await new Promise((resolve) => setTimeout(resolve, gameContext!.state.defaultOpenTime! * 1000));
            }

            signalRContext?.connection?.invoke('CreateGame', { betAmount: 100 });
          }}
        >
          Create Game
        </button>
        <button onClick={() => jackpotContext.show(10, '1699.26')}>jackpot</button>
        <button
          onClick={async () => {
            await winContext.show(gameContext!.state.defaultBurnTime * 0.5, ['1', '2', '3'], '0.00');
            burnContext.show(gameContext!.state.defaultBurnTime * 0.5);
          }}
        >
          burn
        </button>
        <button onClick={() => gameContext?.dispatch({ type: 'SET_GAME', payload: null })}>Reset game</button>
      </div>
    </div>
  );
};

export default GameLayout;
