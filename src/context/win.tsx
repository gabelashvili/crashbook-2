import { createContext, use, useRef, useCallback, type ReactNode, useEffect, useState } from 'react';
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
  finish: () => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
};

const WinContext = createContext<WinContextProps>({
  show: () => Promise.resolve(),
  finish: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
});

const WinContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const formulaContext = use(FormulaContext);
  const spine = animationContext.spines.win!;
  const currentAbort = useRef<AbortController | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const lasttDataRef = useRef<{ formula: FormulaKey[]; winAmount: string } | null>(null);

  const stopAnimation = useCallback(() => {
    currentAbort.current?.abort();
    setIsPlaying(false);
    spine.removeChildren();
    spine.visible = false;
    spine.state.clearTracks();
  }, [spine]);

  const show = (duration: number, formula: FormulaKey[], winAmount: string) => {
    // Cancel any previous animation

    currentAbort.current?.abort();
    window.stopBurnAnimation?.();
    setIsPlaying(true);
    lasttDataRef.current = { formula, winAmount };

    if (!animationContext.spines.turn?.visible) {
      throw new Error('Turn spine is not visible');
    }

    const abortController = new AbortController();
    const { signal } = abortController;
    currentAbort.current = abortController;

    spine.visible = true;
    const entry = spine.state.setAnimation(0, 'animation', false);
    spine.update(6.6);
    entry.timeScale = 0;
    entry.animationEnd = entry.animation!.duration - 3.2;

    const formulaDuration = duration * 0.3;
    const spineDuration = duration - formulaDuration;

    ////

    const slot = spine.skeleton.findSlot('text 01');
    slot!.bone.worldX = slot!.bone.x;
    const titleTexture = PIXI.Assets.get('currentWinning');
    const titleSprite = new PIXI.Sprite(titleTexture);
    titleSprite.visible = false;

    const bone = slot?.bone;

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
      const isSlotVisible = !!slot?.attachment?.name;

      if (isSlotVisible) {
        titleSprite.visible = true;
        titleSprite.x = -740;
        titleSprite.y = bone!.worldY - 385;
        //
        amountLabel.visible = true;

        amountLabel.x = amountLabelStartX + (amountLabelMaxWidth - amountLabel.width) / 2 + 15;
        amountLabel.y = amountLabelStartY + (amountLabelMaxHeight - amountLabel.height) / 2 + bone!.worldY + 15;
      }
    };

    animationContext.application!.ticker.add(tickerFn);

    // spine.addChild(label);
    spine.addChild(titleSprite);
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
          setIsPlaying(false);
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
          entry.timeScale = (entry.animation?.duration ?? 0 - 3.2 - 6.6) / spineDuration;
        },
      });
    });
  };

  const finish = () => {
    const turnSpine = animationContext.spines.turn;
    const turnSpineEntry = turnSpine?.state.tracks[0];
    if (turnSpineEntry) {
      turnSpineEntry.timeScale = 10;
    }

    setTimeout(() => {
      formulaContext.finish();
      setIsPlaying(false);
      const lastEntry = spine.state.tracks[0];
      if (lastEntry) {
        lastEntry.timeScale = 15;
      }
    }, 200);
  };

  useEffect(() => {
    window.stopWinAnimation = stopAnimation;
  }, [stopAnimation]);

  return <WinContext.Provider value={{ show, finish, isPlaying, setIsPlaying }}>{children}</WinContext.Provider>;
};

export { WinContext, WinContextProvider };
