import { use, useCallback, useEffect, useRef, useState } from 'react';
import LeaderBoardImg from '../assets/images/leaderboard.png';
import { GameContext } from '../context/game';
import { SignalRContext } from '../context/signalr';
import BurgerIcon from './icons/burger';
import SoundIcon from './icons/sound';
import ShieldIcon from './icons/shield';
import QuestionMarkIcon from './icons/question-mark';
import UserIcon from './icons/user';
import cn from '../utils/cn';
import LeaderBoardModal from './leaderboard-modal';
import { formatCurrency } from '../utils/currency';

const Header = () => {
  const signalRContext = use(SignalRContext)!;
  const user = use(GameContext)!.state.user!;
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuButtonToggleButtonRef = useRef<HTMLButtonElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openLeaderboard, setOpenLeaderboard] = useState(false);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonToggleButtonRef.current?.contains(event.target as Node)
      ) {
        console.log('clicked outside');
        setOpenMenu(false);
      }
    },
    [setOpenMenu],
  );

  useEffect(() => {
    if (openMenu) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [handleClickOutside, openMenu]);

  const updatePlayerBalanceInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      signalRContext.connection?.invoke('UpdateBalance');
    }, 5000);
  }, [signalRContext.connection]);

  useEffect(() => {
    updatePlayerBalanceInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updatePlayerBalanceInterval]);

  return (
    <>
      <LeaderBoardModal
        isOpen={openLeaderboard}
        close={() => {
          setOpenLeaderboard(false);
        }}
      />
      <div className="bg-[rgba(84,45,178,0.46)] flex justify-between items-center py-1 px-6 w-full">
        <h1 className="text-base md:text-lg lg:text-xl font-semibold text-white">Crashbook</h1>
        <div className="flex items-center gap-4">
          <img
            onClick={() => {
              setOpenLeaderboard(true);
            }}
            src={LeaderBoardImg}
            alt="header-img"
            className="size-10 sm:size-12 md:size-14 cursor-pointer translate-y-0.5"
            id="leaderboard-toggle-button"
          />
          <p className="font-semibold text-base md:text-lg lg:text-xl text-[#48B098]">
            {formatCurrency(user.balance / 100)} <span className="text-[#21866E]">GEL</span>
          </p>
          <div className="h-full relative z-10">
            <button
              onClick={() => {
                setOpenMenu(!openMenu);
              }}
              className="h-full flex items-center justify-center p-2 cursor-pointer"
              ref={menuButtonToggleButtonRef}
            >
              <BurgerIcon className="text-[#C9B2FF]" />
            </button>
            <ul
              ref={menuRef}
              className={cn(
                'transition-all duration-75 divide-y divide-[rgba(217,217,217,0.2)] bg-[#2F1967] rounded-sm min-w-[220px] absolute top-full right-0 translate-y-2 md:translate-y-3.5 opacity-0 invisible',
                openMenu && 'opacity-100 visible',
              )}
            >
              <div className="text-white bg-[#5930BA] p-4 rounded-t-sm flex items-center gap-2.5">
                <UserIcon className="size-[18px] md:size-5" />
                <p className=" font-semibold text-sm md:text-base">{user.userName}</p>
              </div>
              <li className="flex items-center gap-2.5 p-4 cursor-pointer">
                <SoundIcon className="min-w-[18px] md:min-w-5 min-h-[18px] md:min-h-5 text-[#C0946B]" />
                {/* <Switch
                    label="Sound"
                    onChange={() => {
                      setSound(!sound);
                    }}
                    labelClassName="sm:text-sm md:text-base"
                    trackClassName="md:w-10 md:h-5"
                    knobClassName="md:size-3.5"
                    className="w-full justify-between"
                    checked={sound}
                  /> */}
              </li>
              <li className="flex items-center gap-2.5 p-4 cursor-pointer">
                <ShieldIcon className="min-w-[18px] md:min-w-5 min-h-[18px] md:min-h-5 text-[#C0946B]" />
                <p className="text-xs sm:text-sm md:text-base font-semibold text-white">Game Rules</p>
              </li>
              <li className="flex items-center gap-2.5 p-4 cursor-pointer">
                <QuestionMarkIcon className="min-w-[18px] md:min-w-5 min-h-[18px] md:min-h-5 text-[#C0946B]" />
                <p className="text-xs sm:text-sm md:text-base font-semibold text-white">How To Play</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
