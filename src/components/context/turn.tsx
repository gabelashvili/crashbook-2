import { createContext, use, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimationContext } from './animation';

// Define the shape of your context
type TurnContextProps = {
  show: (data: { duration?: number; onFinish?: () => void }) => Promise<void>;
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

  const show = async ({ duration = initialDuration, onFinish }: { duration?: number; onFinish?: () => void }) => {
    spine.removeChildren();
    animationContext.hideAllSpines();
    spine.visible = true;
    setIsTurning(true);

    const previousEntry = spine.state.tracks[0];
    if (previousEntry) {
      previousEntry.timeScale = 5;
      return;
    }

    // Now start the new animation
    const entry = spine.state.setAnimation(0, 'animation', false);
    animationContext.application!.ticker.remove(tickerFnRef.current!);
    entry.timeScale = initialDuration / duration;
    entry.animationEnd = entry.animation!.duration - 1.2;
    entry.listener = {
      complete: () => {
        onFinish?.();
        spine.state.clearTracks();
      },
    };
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
