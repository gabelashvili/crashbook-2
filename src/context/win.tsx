import { createContext, use, useRef, useCallback, type ReactNode, useEffect, useState } from 'react';
import { AnimationContext } from './animation';
import { FormulaContext, type FormulaKey } from './formula';
import * as PIXI from 'pixi.js';

declare global {
  // Note the capital "W"
  interface Window {
    stopWinAnimation: () => void;
    finsihWinAnimation: () => void;
    isWinPlaying: boolean;
  }
}

type WinContextProps = {
  show: (duration: number, formula: FormulaKey[], winAmount: string) => Promise<void>;
  finish: () => Promise<void>;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
};

const WinContext = createContext<WinContextProps>({
  show: () => Promise.resolve(),
  finish: () => Promise.resolve(),
  isPlaying: false,
  setIsPlaying: () => {},
});

const WinContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const formulaContext = use(FormulaContext);
  const spine = animationContext.spines.win!;
  const currentAbort = useRef<AbortController | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stopAnimation = useCallback(() => {
    formulaContext.finish();
    animationContext.spines.burn!.visible = false;
    currentAbort.current?.abort();
    setIsPlaying(false);
    spine.removeChildren();
    spine.visible = false;
    spine.state.clearTracks();
  }, [animationContext.spines.burn, formulaContext, spine]);

  const show = (duration: number, formula: FormulaKey[], winAmount: string) => {
    // Cancel any previous animation

    currentAbort.current?.abort();
    // stopAnimation();
    setIsPlaying(true);

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
    entry.animationEnd = entry.animation!.duration - 1.7;

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
    const amountLabelStartY = bone!.worldY + 90;
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

  const finish = useCallback(async () => {
    const turnSpine = animationContext.spines.turn;
    const turnSpineEntry = turnSpine?.state.tracks[0];
    if (turnSpineEntry) {
      turnSpineEntry.timeScale = 7;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));

    formulaContext.finish();

    const lastEntry = spine.state.tracks[0];
    if (lastEntry) {
      lastEntry.timeScale = 7;
    }
    setIsPlaying(false);
  }, [animationContext.spines.turn, formulaContext, spine]);

  useEffect(() => {
    window.stopWinAnimation = stopAnimation;
  }, [stopAnimation]);

  useEffect(() => {
    window.finsihWinAnimation = finish;
  }, [finish]);

  useEffect(() => {
    window.isWinPlaying = isPlaying;
  }, [isPlaying]);

  return <WinContext.Provider value={{ show, finish, isPlaying, setIsPlaying }}>{children}</WinContext.Provider>;
};

export { WinContext, WinContextProvider };
