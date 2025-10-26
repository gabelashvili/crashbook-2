import { NumericFormat } from 'react-number-format';
import { GameContext } from '../context/game';
import { use, useEffect, useState } from 'react';
import { formatCurrency } from '../utils/currency';
import Button from './ui/button';
import cn from '../utils/cn';
import { SignalRContext } from '../context/signalr';
import LoadingIcon from './icons/loading';
import AutoPlay from './auto-play';

const PlaceBet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const gameContext = use(GameContext)!;
  const signalRContext = use(SignalRContext);

  const createGame = async () => {
    setIsLoading(true);

    let autoPlaySettings: Record<string, unknown> = {
      ...(gameContext.state.autoPlayOptions?.autoPlay && { totalGames: gameContext.state.autoPlayOptions.autoPlay }),
      ...(gameContext.state.autoPlayOptions?.autoCashout && {
        autoCashout: gameContext.state.autoPlayOptions.autoCashout,
      }),
    };

    if (Object.keys(autoPlaySettings).length > 0) {
      autoPlaySettings = {
        ...autoPlaySettings,
        ...gameContext.state.autoPlayEventsTimes,
      };
    }
    console.log('autoPlaySettings', autoPlaySettings, {
      betAmount: gameContext.state.betAmount * 100,
      ...(Object.keys(autoPlaySettings).length > 0 && {
        autoPlaySettings,
      }),
    });

    signalRContext?.connection?.invoke('CreateGame', {
      betAmount: gameContext.state.betAmount * 100,
      ...(Object.keys(autoPlaySettings).length > 0 && {
        autoPlaySettings,
      }),
    });
  };

  const cashout = async () => {
    signalRContext?.connection?.invoke('Cashout', {
      gameId: gameContext.state.game!.id,
    });
  };

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [gameContext.state.gamePlayed, isLoading]);

  return (
    <div className="bg-[linear-gradient(180deg,#7B5624_0%,#9C6D2E_32.69%,#B47E35_56.25%,#E19D42_100%)] rounded-sm p-[1px] h-fit">
      <div className="bg-[#200A2A] rounded-sm p-1">
        <div className="border border-[#F9CD7A] rounded-sm bg-[#541C73]">
          <AutoPlay />

          <div className="bg-[linear-gradient(1.27deg,rgba(91,86,113,0)_22.64%,rgba(172,164,215,0.26)_101.7%)] rounded-sm p-0.5">
            <div className="bg-[#3B1252] rounded-md px-1.5 py-3 grid grid-cols-[1.3fr_130px] sm:grid-cols-[2.5fr_1fr] gap-2">
              <div className="space-y-2">
                <div className=" bg-[#291243] border border-[#582FB6] shadow-[inset_0_4px_4px_0_#0000004D] rounded-sm px-1.5 grid grid-cols-[auto_3fr_auto] gap-2">
                  <div className="border border-[#582FB6] rounded-sm bg-[linear-gradient(110.14deg,#8350FF_9.94%,#502AAC_89.84%)] p-2 size-7 my-2 flex items-center justify-center text-white text-lg font-semibold">
                    <svg className="w-[28px] min-w-[28px]" viewBox="0 0 28 28" fill="none">
                      <rect
                        x="0.5"
                        y="0.5"
                        width="27"
                        height="27"
                        rx="3.5"
                        fill="url(#paint0_linear_90_4520)"
                        stroke="#582FB6"
                      />
                      <path
                        d="M7 14H20.5491"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_90_4520"
                          x1="3.80247"
                          y1="4.47724e-07"
                          x2="30.7574"
                          y2="9.88759"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#8350FF" />
                          <stop offset="1" stop-color="#502AAC" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <NumericFormat
                    className="w-full h-full text-[#ACACAC] text-center font-semibold !border-0 !outline-0"
                    defaultValue={gameContext!.state.betAmount}
                    allowLeadingZeros
                    thousandSeparator=","
                    decimalScale={2}
                    onValueChange={(value) => {
                      gameContext.dispatch({ type: 'SET_BET_AMOUNT', payload: value.floatValue ?? 0 });
                    }}
                  />
                  <div className="border border-[#582FB6] rounded-sm bg-[linear-gradient(110.14deg,#8350FF_9.94%,#502AAC_89.84%)] p-2 size-7 my-2 flex items-center justify-center text-white text-lg font-semibold">
                    <svg className="w-[16px] min-w-[16px]" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M7.77454 1V14.5491"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M1 7.7749H14.5491"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex gap-1 md:gap-2">
                  {gameContext.state.betAmounts.map((amount) => (
                    <div
                      key={amount}
                      className={cn(
                        'user-select-none shadow-[inset_0_4px_4px_0_#0000004D] cursor-pointer bg-[#2A1244] border border-[#582FB6] rounded-sm p-1.5 w-full flex items-center justify-center text-sm text-[#ACACAC] md:text-base font-semibold',
                        {
                          'bg-[#814FFC] text-white': gameContext.state.betAmount === amount,
                        },
                      )}
                      onClick={() => {
                        gameContext.dispatch({ type: 'SET_BET_AMOUNT', payload: amount });
                      }}
                    >
                      {amount}
                    </div>
                  ))}
                </div>
              </div>
              {!gameContext.state.game && (
                <Button
                  className={cn(' relative', {
                    'opacity-60 pointer-events-none': isLoading,
                  })}
                  onClick={createGame}
                >
                  {isLoading && (
                    <LoadingIcon className="size-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-[#ACACAC]" />
                  )}
                  <p
                    className={cn('text-white text-xs md:text-sm font-semibold', {
                      'opacity-0': isLoading,
                    })}
                  >
                    BET
                  </p>
                  <p
                    className={cn('text-white  font-semibold', {
                      'text-base sm:text-xl': gameContext.state.betAmount.toString().length <= 6,
                      'text-sm sm:text-lg': gameContext.state.betAmount.toString().length > 6,
                      'opacity-0': isLoading,
                    })}
                  >
                    {formatCurrency(gameContext!.state.betAmount)} GEL
                  </p>
                </Button>
              )}
              {gameContext.state.game && (
                <Button
                  className={cn(' relative', {
                    'opacity-60 pointer-events-none': isLoading,
                  })}
                  variant={'secondary'}
                  onClick={cashout}
                >
                  {isLoading && (
                    <LoadingIcon className="size-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-[#ACACAC]" />
                  )}
                  <p
                    className={cn('text-white text-xs md:text-sm font-semibold', {
                      'opacity-0': isLoading,
                    })}
                  >
                    CASHOUT
                  </p>
                  <p
                    className={cn('text-white  font-semibold', {
                      'text-base sm:text-xl': gameContext.state.betAmount.toString().length <= 6,
                      'text-sm sm:text-lg': gameContext.state.betAmount.toString().length > 6,
                      'opacity-0': isLoading,
                    })}
                  >
                    {formatCurrency(gameContext!.state.game.betAmount * gameContext!.state.game.multiplier)} GEL
                  </p>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceBet;
