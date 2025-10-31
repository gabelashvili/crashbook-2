import { use, useCallback, useEffect, useRef, useState } from 'react';
import { Switch } from './ui/switch';
import { GameContext } from '../context/game';
import cn from '../utils/cn';

const AUTO_PLAY_VALUES = [2, 20, 50, 100];

const AutoPlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameContext = use(GameContext);

  const onClickOutside = useCallback((event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node) &&
      !document.getElementById('auto-play-switch')?.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', onClickOutside);
    return () => {
      document.removeEventListener('click', onClickOutside);
    };
  }, [onClickOutside]);

  return (
    <div className="flex items-center gap-1 sm:gap-2  rounded-sm py-1.5 px-2">
      <div className="relative" id="auto-play-switch">
        <Switch
          labelClassName="w-max sm:text-sm xl:text-base"
          trackClassName="sm:w-9 sm:h-5 xl:w-10 xl:h-5"
          knobClassName="sm:size-3.5 xl:size-4"
          label="Auto Play"
          onClick={() => {
            setIsOpen(!isOpen);
            if (gameContext?.state.autoPlayOptions?.autoPlay) {
              gameContext?.dispatch({
                type: 'SET_AUTO_PLAY_OPTIONS',
                payload: null,
              });
            }
          }}
          checked={!!gameContext?.state.autoPlayOptions?.autoPlay}
        />
        <div
          ref={containerRef}
          className="border border-[#F9CD7A] bg-[#541C73] py-3 px-6 rounded-lg absolute -top-2 translate-y-[-100%] z-10"
          style={{
            display: isOpen ? 'block' : 'none',
          }}
        >
          <ul className="space-y-3.5">
            {[2, 20, 50, 100].map((value) => (
              <li
                onClick={() => {
                  if (gameContext?.state.autoPlayOptions?.autoPlay === value) {
                    gameContext?.dispatch({
                      type: 'SET_AUTO_PLAY_OPTIONS',
                      payload: null,
                    });
                  } else {
                    gameContext?.dispatch({
                      type: 'SET_AUTO_PLAY_OPTIONS',
                      payload: { autoPlay: value, autoCashout: null, currentGame: 0 },
                    });
                  }
                }}
                className={cn(
                  'cursor-pointer min-w-8 w-full min-h-6 font-semibold border border-[#582FB6] bg-[#291243] shadow-[inset_0px_4px_4px_0px_#0000004D] p-1 text-xs sm:text-sm xl:text-base text-[#ACACAC] text-center rounded-lg',
                  gameContext?.state.autoPlayOptions?.autoPlay === value &&
                    'bg-[#814FFC] text-white [&_span]:text-[#FFD8BB]',
                )}
              >
                {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={cn('flex items-center gap-2 bg-[#1E0D487A] px-1 py-2 sm:p-2 rounded-sm ml-auto', {
          'pointer-events-none opacity-60': !gameContext?.state.autoPlayOptions?.autoPlay,
        })}
      >
        <Switch
          labelClassName={cn('w-max sm:text-sm xl:text-base')}
          trackClassName="sm:w-9 sm:h-5 xl:w-10 xl:h-5"
          knobClassName="sm:size-3.5 xl:size-4"
          label="Auto Cashout"
          checked={!!gameContext?.state.autoPlayOptions?.autoCashout}
          onClick={() => {
            if (gameContext?.state.autoPlayOptions?.autoCashout) {
              gameContext?.dispatch({
                type: 'UPDATE_AUTO_CASHOUT',
                payload: null,
              });
            } else {
              gameContext?.dispatch({
                type: 'UPDATE_AUTO_CASHOUT',
                payload: AUTO_PLAY_VALUES[0],
              });
            }
          }}
        />
        <div className="flex gap-1 sm:gap-2">
          {[1.5, 2, 3].map((value) => (
            <div
              key={value}
              className={cn(
                'w-7 h-7 min-w-7 min-h-7 sm:w-8 sm:h-8 sm:min-w-8 sm:min-h-8 user-select-none shadow-[inset_0_4px_4px_0_#0000004D] cursor-pointer bg-[#2A1244] border border-[#582FB6] rounded-sm p-1.5 flex items-center justify-center text-xs sm:text-sm text-[#ACACAC] md:text-base font-semibold',
                {
                  'bg-[#814FFC] text-white': gameContext?.state.autoPlayOptions?.autoCashout === value,
                },
              )}
              onClick={() => {
                gameContext?.dispatch({ type: 'UPDATE_AUTO_CASHOUT', payload: value });
              }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoPlay;
