import { createContext, use, useCallback, type ReactNode, useEffect, useRef } from 'react';
import { AnimationContext } from './animation';

declare global {
  interface Window {
    removeBurnAnimation: () => void;
  }
}

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
  const abortController = useRef<AbortController | null>(null);

  const removeBurnAnimation = useCallback(() => {
    abortController.current?.abort();
    abortController.current = null;
    spine.visible = false;
    spine.update(0.1);

    if (spine.state.tracks.length > 0) {
      spine.state.tracks[0]!.timeScale = 5;
    }
    spine.state.clearTracks();
  }, [spine]);

  const show = (duration = initialDuration): Promise<void> => {
    if (!animationContext.spines.turn?.visible) {
      throw new Error('Turn spine is not visible');
    }
    removeBurnAnimation();
    abortController.current = new AbortController();

    return new Promise((resolve, reject) => {
      if (abortController.current?.signal.aborted) {
        reject(new DOMException('Burn animation aborted', 'AbortError'));
        removeBurnAnimation();
        return;
      }
      const entry = spine.state.setAnimation(0, 'animation', false);

      entry.timeScale = initialDuration / duration;

      entry.trackTime = 3;
      spine.update(0.1);

      entry.animationEnd = entry.animation!.duration - 1.5;

      spine.visible = true;

      entry.listener = {
        complete: () => {
          abortController.current = null;
          resolve();
        },
      };
    });
  };

  useEffect(() => {
    window.removeBurnAnimation = removeBurnAnimation;
  }, [removeBurnAnimation]);

  return <BurnContext.Provider value={{ show }}>{children}</BurnContext.Provider>;
};

export { BurnContext, BurnContextProvider };
