import { createContext, use, useRef, type ReactNode } from 'react';
import { AnimationContext } from './animation';
import { FormulaContext, type FormulaKey } from './formula';

// Define the shape of your context
type WinContextProps = {
  show: (duration: number, formula: FormulaKey[]) => void;
};

// Create the context with a default value (can be null)
const WinContext = createContext<WinContextProps>({
  show: () => Promise.resolve(),
});

// Context Provider
const WinContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const formulaContext = use(FormulaContext);
  const spine = animationContext.spines.win!;
  const currentShowId = useRef<number>(0);

  const show = (duration: number, formula: FormulaKey[]) => {
    window.stopBurnAnimation?.();

    currentShowId.current += 1;
    const showId = currentShowId.current;

    const formulaDuration = duration * 0.2;
    const spineDuration = duration - formulaDuration;
    spine.removeChildren();
    spine.visible = true;
    const entry = spine.state.setAnimation(0, 'animation', false);
    spine.update(6.6);
    entry.timeScale = 0;
    entry.animationEnd = entry.animation!.duration - 3.2;

    entry.listener = {
      complete: () => {
        spine.state.clearTracks();
        spine.update(0);
      },
    };

    formulaContext.show(spine, formula, {
      durationSec: formulaDuration,
      onFinish: () => {
        if (showId !== currentShowId.current) return;

        entry.timeScale = (entry.animation!.duration - 3.2 - 6.6) / spineDuration;
      },
    });
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
