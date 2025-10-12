import { createContext, use, useRef, type ReactNode } from 'react';
import { AnimationContext } from './animation';

// Define the shape of your context
type BookOpenContextProps = {
  show: ({ showIddle, duration }: { showIddle?: boolean; duration?: number }) => void;
  initialDuration: number;
};

// Create the context with a default value (can be null)
const BookOpenContext = createContext<BookOpenContextProps>({
  show: () => {},
  initialDuration: 0,
});

// Context Provider
const BookOpenContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const spine = animationContext.spines.open!;
  const initialDuration = spine.state.data.skeletonData.findAnimation('animation')!.duration;
  const tickerFnRef = useRef<() => void>(() => {});

  const show = ({ showIddle, duration = initialDuration }: { showIddle?: boolean; duration?: number }) => {
    animationContext.hideAllSpines();
    spine.visible = true;
    const entry =
      animationContext.currentAnimation === 'open' && spine.state.tracks[0]
        ? spine.state.tracks[0]
        : spine.state.setAnimation(0, 'animation', false);

    if (showIddle) {
      console.log('showIddle');
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
        console.log('complete');
      },
    };
  };
  return (
    <BookOpenContext.Provider
      value={{
        show,
        initialDuration,
      }}
    >
      {children}
    </BookOpenContext.Provider>
  );
};

export { BookOpenContext, BookOpenContextProvider };
