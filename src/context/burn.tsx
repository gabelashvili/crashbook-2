import { createContext, use, useCallback, type ReactNode } from 'react';
import { AnimationContext } from './animation';

// Define the shape of your context
type BurnContextProps = {
  show: (duration: number) => Promise<void>;
};

// Create the context with a default value (can be null)
const BurnContext = createContext<BurnContextProps>({
  show: () => Promise.resolve(),
});

// Context Provider
const BurnContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const spine = animationContext.spines.burn!;
  const initialDuration = spine.state.data.skeletonData.findAnimation('animation')!.duration - 4.5;

  const clearAnimation = useCallback(() => {
    spine.visible = false;
    spine.update(0.1);
    spine.state.clearTracks();
  }, [spine]);

  const show = (duration = initialDuration): Promise<void> => {
    if (!animationContext.spines.turn?.visible) {
      throw new Error('Turn spine is not visible');
    }
    clearAnimation();

    return new Promise((resolve) => {
      const entry = spine.state.setAnimation(0, 'animation', false);

      entry.timeScale = initialDuration / duration;

      entry.trackTime = 3;
      spine.update(0.1);

      entry.animationEnd = entry.animation!.duration - 1.5;

      spine.visible = true;

      entry.listener = {
        complete: () => {
          resolve();
        },
      };
    });
  };

  return <BurnContext.Provider value={{ show }}>{children}</BurnContext.Provider>;
};

export { BurnContext, BurnContextProvider };
