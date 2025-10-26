import { createContext, use, useRef, type ReactNode } from 'react';
import { AnimationContext } from './animation';
import { useState } from 'react';

// Define the shape of your context
type OpenContextProps = {
  show: ({ showIddle, duration }: { showIddle?: boolean; duration?: number }) => void;
  initialDuration: number;
  isPlaying: boolean;
};

// Create the context with a default value (can be null)
const OpenContext = createContext<OpenContextProps>({
  show: () => {},
  initialDuration: 0,
  isPlaying: false,
});

// Context Provider
const OpenContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const spine = animationContext.spines.open!;
  const initialDuration = spine.state.data.skeletonData.findAnimation('animation')!.duration;
  const tickerFnRef = useRef<() => void>(() => {});
  const [isPlaying, setIsPlaying] = useState(false);

  const show = ({ showIddle, duration = initialDuration }: { showIddle?: boolean; duration?: number }) => {
    window.removeBurnAnimation?.();
    window.removeWinAnimation?.();
    animationContext.hideAllSpines();
    spine.visible = true;
    const entry = spine.state.tracks[0] ? spine.state.tracks[0] : spine.state.setAnimation(0, 'animation', false);
    setIsPlaying(true);
    if (showIddle) {
      entry.trackTime = 0;
      tickerFnRef.current = () => {
        if (entry.trackTime >= 0.3) {
          entry.trackTime = 0.3;
          entry.timeScale = -0.25; // reverse
        } else if (entry.trackTime <= 0.01) {
          spine.update(0);

          entry.trackTime = 0.01;
          entry.timeScale = 0.25; // forward
        }
      };
      animationContext.application!.ticker.add(tickerFnRef.current!);
    } else {
      animationContext.application!.ticker.remove(tickerFnRef.current!);
      entry.timeScale = initialDuration / duration;
    }

    entry.listener = {
      complete: () => {
        spine.state.clearTracks();
        setIsPlaying(false);
      },
    };
  };
  return (
    <OpenContext.Provider
      value={{
        show,
        initialDuration,
        isPlaying,
      }}
    >
      {children}
    </OpenContext.Provider>
  );
};

export { OpenContext, OpenContextProvider };
