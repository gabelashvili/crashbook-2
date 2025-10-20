import { createContext, use, useRef, useCallback, type ReactNode, useEffect } from 'react';
import { AnimationContext } from './animation';
import { FormulaContext, type FormulaKey } from './formula';

declare global {
  // Note the capital "W"
  interface Window {
    stopWinAnimation: () => void;
  }
}

type WinContextProps = {
  show: (duration: number, formula: FormulaKey[]) => Promise<void>;
};

const WinContext = createContext<WinContextProps>({
  show: () => Promise.resolve(),
});

const WinContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const formulaContext = use(FormulaContext);
  const spine = animationContext.spines.win!;
  const currentAbort = useRef<AbortController | null>(null);

  const stopAnimation = useCallback(() => {
    currentAbort.current?.abort();
    spine.removeChildren();
    spine.visible = false;
    spine.state.clearTracks();
  }, [spine]);

  const show = (duration: number, formula: FormulaKey[]) => {
    // Cancel any previous animation
    currentAbort.current?.abort();
    window.stopBurnAnimation?.();

    const abortController = new AbortController();
    const { signal } = abortController;
    currentAbort.current = abortController;

    spine.visible = true;
    const entry = spine.state.setAnimation(0, 'animation', false);
    spine.update(6.6);
    entry.timeScale = 0;
    entry.animationEnd = entry.animation!.duration - 3.2;

    const formulaDuration = duration * 0.5;
    const spineDuration = duration - formulaDuration;

    return new Promise<void>((resolve, reject) => {
      // Listen for abort
      signal.addEventListener('abort', () => {
        spine.visible = false;
        spine.removeChildren();
        spine.state.clearTracks();
        reject(new DOMException('Animation aborted', 'AbortError'));
      });

      entry.listener = {
        complete: () => {
          if (signal.aborted) return;
          spine.state.clearTracks();
          spine.update(0);
          resolve();
        },
      };

      formulaContext.show(spine, formula, {
        durationSec: formulaDuration,
        onFinish: () => {
          if (signal.aborted) return;
          entry.timeScale = (entry.animation!.duration - 3.2 - 6.6) / spineDuration;
        },
      });
    });
  };

  useEffect(() => {
    window.stopWinAnimation = stopAnimation;
  }, [stopAnimation]);

  return <WinContext.Provider value={{ show }}>{children}</WinContext.Provider>;
};

export { WinContext, WinContextProvider };
