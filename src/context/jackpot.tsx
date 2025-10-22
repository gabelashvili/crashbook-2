import { createContext, use, type ReactNode } from 'react';
import { AnimationContext } from './animation';

// Define the shape of your context
type JackpotContextProps = {
  show: ({ duration }: { duration: number }) => void;
  initialDuration: number;
};

// Create the context with a default value (can be null)
const JackpotContext = createContext<JackpotContextProps>({
  show: () => {},
  initialDuration: 0,
});

// Context Provider
const JackpotContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const jackpotLeft = animationContext.spines.jackpotLeft!;
  const jackpotRight = animationContext.spines.jackpotRight!;
  const jackpotLeftInitialDuration = jackpotLeft.state.data.skeletonData.findAnimation('animation')!.duration;
  const jackpotRightInitialDuration = jackpotRight.state.data.skeletonData.findAnimation('animation')!.duration;

  const show = ({ duration = 1 }: { duration: number }) => {
    // animationContext.hideAllSpines();
    // animationContext.spines.win?.removeChildren();
    jackpotLeft.visible = true;
    jackpotRight.visible = true;
    const jackpotLeftEntry = jackpotLeft.state.setAnimation(0, 'animation', false);
    const jackpotRightEntry = jackpotRight.state.setAnimation(0, 'animation', false);
    jackpotLeftEntry.timeScale = 0;
    jackpotLeftEntry.trackTime = 0;
    jackpotRightEntry.timeScale = 0.3;

    jackpotLeftEntry.listener = {
      complete: () => {
        jackpotLeft.state.clearTracks();
      },
    };
    jackpotRightEntry.listener = {
      complete: () => {
        jackpotRight.state.clearTracks();
        jackpotLeft.visible = true;
        jackpotLeftEntry.timeScale = 50;
      },
    };
  };
  return (
    <JackpotContext.Provider
      value={{
        show,
        initialDuration: 1,
      }}
    >
      {children}
    </JackpotContext.Provider>
  );
};

export { JackpotContext, JackpotContextProvider };
