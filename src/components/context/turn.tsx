import { createContext, use, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimationContext } from './animation';

// Define the shape of your context
type TurnContextProps = {
  show: (duration?: number) => Promise<void>;
  initialDuration: number;
  isTurning: boolean;
};

// Create the context with a default value (can be null)
const TurnContext = createContext<TurnContextProps>({
  show: () => Promise.resolve(),
  initialDuration: 0,
  isTurning: false,
});

// Context Provider
const TurnContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const spine = animationContext.spines.turn!;
  const initialDuration = spine.state.data.skeletonData.findAnimation('animation')!.duration;
  const tickerFnRef = useRef<() => void>(() => {});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTurning, setIsTurning] = useState(false);

  const show = (duration = initialDuration): Promise<void> => {
    return new Promise((resolve) => {
      spine.removeChildren();
      animationContext.hideAllSpines();
      spine.visible = true;
      setIsTurning(true);

      const proceed = async () => {
        const entry = spine.state.setAnimation(0, 'animation', false);

        animationContext.application!.ticker.remove(tickerFnRef.current!);
        entry.timeScale = initialDuration / duration;
        console.log(entry.animation?.duration);
        entry.animationEnd = entry.animation!.duration - 1.3;

        entry.listener = {
          complete: () => {
            spine.state.clearTracks();
            spine.update(0);
            setIsTurning(false);
            resolve();
          },
        };
      };

      if (spine.state.tracks[0]) {
        spine.state.tracks[0].trackTime = 100;
        spine.update(0);
        timerRef.current = setTimeout(proceed, 0); // wait 0ms, then continue
      } else {
        proceed();
      }
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  return (
    <TurnContext.Provider
      value={{
        show,
        initialDuration,
        isTurning,
      }}
    >
      {children}
    </TurnContext.Provider>
  );
};

export { TurnContext, TurnContextProvider };
