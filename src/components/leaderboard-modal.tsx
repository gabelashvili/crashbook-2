import { use, useCallback, useEffect, useRef } from 'react';
import cn from '../utils/cn';
import Cup from '../assets/images/cup.png';
import WinnerMedal1 from '../assets/images/1.png';
import WinnerMedal2 from '../assets/images/2.png';
import WinnerMedal3 from '../assets/images/3.png';
import { formatCurrency } from '../utils/currency';
import CloseIcon from './icons/close';
import LoadingIcon from './icons/loading';
import { GameContext } from '../context/game';

interface ModalProps {
  close: () => void;
  isOpen: boolean;
  onClickOutside?: () => void;
  wrapperClassName?: string;
  className?: string;
}

const LeaderBoardModal = (props: ModalProps) => {
  const { close, isOpen, className } = props;
  const gameContext = use(GameContext);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        !modalRef.current?.contains(event.target as Node) &&
        !document.getElementById('leaderboard-toggle-button')?.contains(event.target as Node)
      ) {
        close();
      }
    },
    [close],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [handleClickOutside, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="w-full h-full fixed top-0 left-0 z-30 px-4">
      <div className="w-screen h-screen absolute top-0 left-0 bg-[rgba(59,18,82,0.8)]" />

      <div
        ref={modalRef}
        className={cn(
          'rounded-sm border max-w-[90%] md:max-w-xl w-full border-[#C5A973] bg-[#3B1252] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col p-2 shadow-2xl absolute z-10',
          className,
        )}
      >
        {/* close button */}
        <button className="cursor-pointer ml-auto mb-1" onClick={close}>
          <CloseIcon className="size-6 text-[#C5A973]" />
        </button>

        {/* title decoration */}
        <div className="w-[90%] mx-auto mb-4 relative">
          <img
            src={Cup}
            alt="leaderboard-line"
            className="h-16 absolute top-0 left-1/2 -translate-x-1/2 z-10 translate-y-[-30%]"
          />
          {/* svg line */}
          <svg className="w-full" viewBox="0 0 303 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M175.669 8.07985H295.286L300.668 1.00024H168.571"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M296.286 8.0796L301.668 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M288.597 8.0796L293.978 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M280.901 8.0796L286.283 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M273.206 8.0796L278.593 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M265.516 8.0796L270.898 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M257.821 8.0796L263.203 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M250.131 8.0796L255.513 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M242.436 8.0796L247.817 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M234.746 8.0796L240.128 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M227.051 8.0796L232.432 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M219.355 8.0796L224.743 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M211.666 8.0796L217.047 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M203.97 8.0796L209.352 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M196.281 8.0796L201.662 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M188.586 8.0796L193.967 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M180.896 8.0796L186.277 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M174.899 5.84356L178.582 1.00024"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.38146 8.07985L1 1.00024"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.0709 8.0796L8.68945 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.7663 8.0796L16.3849 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M29.4619 8.0796L24.0804 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M37.1514 8.0796L31.7699 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M44.8469 8.0796L39.4655 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M52.5364 8.0796L47.1549 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M60.2319 8.0796L54.8505 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M67.9214 8.0796L62.5399 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M75.6168 8.0796L70.2354 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              stroke-linecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M83.3124 8.0796L77.9249 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M91.0018 8.0796L85.6204 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M98.6974 8.0796L93.3159 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M106.387 8.0796L101.005 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M114.082 8.0796L108.701 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M121.772 8.0796L116.39 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M127.769 5.84331L124.086 1"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M125.999 8.07985H6.38146L1 1.00024H133.097"
              stroke="#C6AA73"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* content container */}
        <div className="min-h-[180px] w-full h-auto rounded-t-4xl relative">
          {/* TODAY badge */}
          <div className="absolute z-10 top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 border border-[#C5A973] rounded-sm bg-[#280A3A] text-[#C5A973] py-1 px-6 text-sm md:text-base font-semibold">
            TODAY
          </div>

          {/* table wrapper */}
          <div className={cn('w-full flex items-start justify-center pt-6 relative z-10')}>
            {!gameContext?.state.leaderboard ? (
              <LoadingIcon className="size-10 my-16 text-[#C5A973]" />
            ) : (
              <table className="w-[98%] border-separate border-spacing-y-1 border-spacing-x-0">
                <thead>
                  <tr>
                    <th className="py-2 text-[#BBBBBB] text-xs sm:text-sm font-semibold"></th>
                    <th align="left" className="py-2 text-[#BBBBBB] text-xs sm:text-sm font-semibold">
                      User
                    </th>
                    <th align="center" className="py-2 text-[#BBBBBB] text-xs sm:text-sm font-semibold">
                      Multiplier
                    </th>
                    <th align="center" className="py-2 text-[#BBBBBB] text-xs sm:text-sm font-semibold">
                      Winning
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gameContext?.state.leaderboard.map((item, itemIndex) => (
                    <tr
                      key={item.id}
                      className="group overflow-hidden outline outline-[#372D6F] hover:outline-[#48B098] rounded-sm"
                    >
                      <td
                        align="center"
                        className="bg-[rgba(121,72,238,0.66)] group-hover:bg-[#461F95] rounded-tl-sm rounded-bl-sm cursor-pointer"
                      >
                        <div className="h-full flex items-center justify-center py-2">
                          {itemIndex < 3 ? (
                            <>
                              {itemIndex === 0 && <img src={WinnerMedal1} alt="user" className="size-8 md:size-10" />}
                              {itemIndex === 1 && <img src={WinnerMedal2} alt="user" className="size-8 md:size-10" />}
                              {itemIndex === 2 && <img src={WinnerMedal3} alt="user" className="size-8 md:size-10" />}
                            </>
                          ) : (
                            <div className="size-6 md:size-8 text-sm rounded-full bg-[rgba(40,_10,_58,_0.32)] text-white font-semibold flex items-center justify-center">
                              {itemIndex + 1}
                            </div>
                          )}
                        </div>
                      </td>

                      <td
                        align="left"
                        className="overflow-hidden text-ellipsis whitespace-nowrap max-w-0 text-white font-semibold text-sm md:text-base bg-[rgba(121,72,238,0.66)] group-hover:bg-[#461F95] cursor-pointer"
                      >
                        {/* <div className="h-full items-center px-2  max-w-[60px] overflow-hidden text-ellipsis whitespace-nowrap block"> */}
                        {item.username}
                        {/* </div> */}
                      </td>

                      <td
                        align="center"
                        className="text-white font-semibold text-sm md:text-base bg-[rgba(121,72,238,0.66)] group-hover:bg-[#461F95] cursor-pointer"
                      >
                        <div className="h-full flex items-center justify-center">{item.multiplier} x</div>
                      </td>

                      <td
                        align="center"
                        className="bg-[rgba(121,72,238,0.66)] group-hover:bg-[#461F95] rounded-tr-sm rounded-br-sm cursor-pointer w-[20%] px-4"
                      >
                        <div className="rounded-sm min-w-max w-full h-full flex items-center justify-center text-white font-semibold text-sm md:text-base border border-[#372D6F] bg-[#7948EE] py-1.5 t px-2 md:px-4">
                          {formatCurrency(item.win / 100)} GEL
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* top gradient border overlay */}
          <div
            className="absolute top-0 left-0 right-0 h-[85px] rounded-t-4xl pointer-events-none"
            style={{
              border: '2px solid transparent',
              borderBottom: 0,
              background: 'linear-gradient(180deg, #C6AA73 0%, rgba(96, 82, 56, 0.64) 100%) border-box',
              WebkitMask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'destination-out',
              mask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)',
              maskComposite: 'exclude',
            }}
          />

          {/* dark overlay background */}
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-t-4xl bg-[rgba(27,9,36,0.41)] m-[2px] pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardModal;
