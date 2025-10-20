import { createContext, use, useRef, useCallback, type ReactNode, useEffect } from 'react';
import { AnimationContext } from './animation';
import { FormulaContext, type FormulaKey } from './formula';
import * as PIXI from 'pixi.js';

declare global {
  // Note the capital "W"
  interface Window {
    stopWinAnimation: () => void;
  }
}

type WinContextProps = {
  show: (duration: number, formula: FormulaKey[], winAmount: string) => Promise<void>;
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

  const show = (duration: number, formula: FormulaKey[], winAmount: string) => {
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

    ////

    const slot = spine.skeleton.findSlot('text 01');
    slot!.bone.worldX = slot!.bone.x;

    const bone = slot?.bone;

    const labelColor = new PIXI.Color({ r: 120, g: 67, b: 0, a: 0.9 });

    const label = new PIXI.Text({
      text: 'Current Winning',
      style: {
        fontSize: 70,
        fill: labelColor,
        fontWeight: 'bold',
        letterSpacing: 5,
        fontFamily: 'Lexend-VariableFont_wght',
      },
    });

    label.visible = false;

    const amountLabel = new PIXI.Text({
      text: winAmount,
      style: {
        fontSize: 130,
        fontWeight: 'bold',
        fill: new PIXI.Color({ r: 120, g: 67, b: 0, a: 1 }),
      },
    });

    amountLabel.visible = false;
    const amountLabelStartX = bone!.worldX + 260;
    const amountLabelEndX = bone!.worldX + 680;
    const amountLabelMaxWidth = amountLabelEndX - amountLabelStartX;
    const amountLabelScale = Math.min(amountLabelMaxWidth / amountLabel.width, 1);
    const amountLabelStartY = bone!.worldY + 15;
    const amountLabelEndY = bone!.worldY + 210;
    const amountLabelMaxHeight = amountLabelEndY - amountLabelStartY;
    amountLabel.scale.set(amountLabelScale);

    const tickerFn = () => {
      const isSlotVisible = slot?.getAttachment() !== null;
      if (isSlotVisible) {
        label.visible = true;
        const labelStartX = bone!.worldX - 350 + 50;
        const labelEndX = bone!.worldX + 350;
        const labelMaxWidth = labelEndX - labelStartX;
        label.x = labelStartX + (labelMaxWidth - label.width) / 2;
        label.y = bone!.worldY - 250;
        //
        amountLabel.visible = true;

        amountLabel.x = amountLabelStartX + (amountLabelMaxWidth - amountLabel.width) / 2 + 15;
        amountLabel.y = amountLabelStartY + (amountLabelMaxHeight - amountLabel.height) / 2;
      }
    };

    animationContext.application!.ticker.add(tickerFn);

    spine.addChild(label);
    spine.addChild(amountLabel);

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
          animationContext.application!.ticker.remove(tickerFn);
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
