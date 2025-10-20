import { createContext, use, type ReactNode } from 'react';
import { AnimationContext } from './animation';

// Define the shape of your context
type WinContextProps = {
  show: (duration?: number) => void;
};

// Create the context with a default value (can be null)
const WinContext = createContext<WinContextProps>({
  show: () => Promise.resolve(),
});

// Context Provider
const WinContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const spine = animationContext.spines.win!;
  const initialDuration = spine.state.data.skeletonData.findAnimation('animation')!.duration;

  const show = (duration = initialDuration) => {
    spine.removeChildren();
    spine.visible = true;
    const entry = spine.state.setAnimation(0, 'animation', false);
    entry.timeScale = initialDuration / duration;
    entry.animationEnd = entry.animation!.duration - 1.3;

    entry.listener = {
      complete: () => {
        spine.state.clearTracks();
        spine.update(0);
      },
    };
  };

  return (
    <WinContext.Provider
      value={{
        show,
      }}
    >
      {children}
    </WinContext.Provider>
  );
};

export { WinContext, WinContextProvider };
