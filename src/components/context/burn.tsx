import { createContext, use, type ReactNode } from 'react';
import { AnimationContext } from './animation';

// Define the shape of your context
type BurnContextProps = {
  show: (duration?: number) => void;
};

// Create the context with a default value (can be null)
const BurnContext = createContext<BurnContextProps>({
  show: () => Promise.resolve(),
});

// Context Provider
const BurnContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const spine = animationContext.spines.burn!;
  const initialDuration = spine.state.data.skeletonData.findAnimation('animation')!.duration;

  const show = (duration = initialDuration) => {
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
    <BurnContext.Provider
      value={{
        show,
      }}
    >
      {children}
    </BurnContext.Provider>
  );
};

export { BurnContext, BurnContextProvider };
