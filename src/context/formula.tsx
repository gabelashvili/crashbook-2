import { createContext, use, useRef, type ReactNode } from 'react';
import { AnimationContext } from './animation';
import * as PIXI from 'pixi.js';

export type FormulaKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'divide'
  | 'close-bracket'
  | 'open-bracket'
  | 'minus'
  | 'plus'
  | 'multiply'
  | 'equal';

type ShowOptions = {
  durationSec?: number;
  onFinish?: () => void;
};

type FormulaContextProps = {
  show: (parentSpine: PIXI.Container, formula: FormulaKey[], options?: ShowOptions) => Promise<void>;
  finish: () => void;
};

const FormulaContext = createContext<FormulaContextProps>({
  show: async () => {},
  finish: () => {},
});

// Rectangle where GIFs are displayed
const rect = new PIXI.Graphics();
rect.rect(90, -50, 700, 150);
rect.fill(new PIXI.Color({ r: 255, g: 0, b: 0, a: 0 }));
rect.visible = true;

const FormulaContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const sprites = useRef<PIXI.AnimatedSprite[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPlayingRef = useRef(false);
  const resolveRef = useRef<(() => void) | null>(null);
  const onFinishRef = useRef<(() => void) | null>(null);

  const finish = () => {
    // Cancel ongoing animation if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      onFinishRef.current?.();
    }

    sprites.current.forEach((sprite) => {
      sprite.visible = true;
      sprite.gotoAndStop(sprite.totalFrames - 1);
      sprite.onComplete = null!;
    });

    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      resolveRef.current?.();
      resolveRef.current = null;
    }
  };

  const show: FormulaContextProps['show'] = (parentSpine, formula, options) => {
    if (!animationContext.application) return Promise.resolve();

    if (options?.onFinish) {
      onFinishRef.current = options.onFinish;
    }

    sprites.current = [];
    rect.removeChildren();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    return new Promise<void>((resolve, reject) => {
      resolveRef.current = resolve;
      isPlayingRef.current = true;

      const SPACE_BETWEEN_SPRITES = 50;
      rect.removeChildren();
      sprites.current = [];

      parentSpine.addChild(rect);

      // Create new sprites
      formula.forEach((key) => {
        const gif = PIXI.Assets.get(`gif-${key}`);
        if (gif) {
          const sprite = new PIXI.AnimatedSprite(gif.textures);
          sprite.visible = false;
          sprite.gotoAndStop(0);
          sprites.current.push(sprite);
        }
      });

      rect.addChild(...sprites.current);

      const totalDuration = sprites.current.reduce(
        (acc, sprite) => acc + sprite.totalFrames * (sprite.animationSpeed / 60),
        0,
      );

      const totalWidthRaw = sprites.current.reduce((acc, sprite) => acc + sprite.width + SPACE_BETWEEN_SPRITES, 0);

      const scale = Math.min(rect.width / totalWidthRaw, 0.6);
      let prevX = 100 - (totalWidthRaw * scale <= rect.width ? (totalWidthRaw * scale - rect.width) / 2 : 0);
      let playIndex = 0;

      sprites.current.forEach((sprite, spriteIndex) => {
        sprite.scale.set(scale);

        if (spriteIndex > 0) {
          const prevSprite = sprites.current[spriteIndex - 1];
          prevX += prevSprite.width + SPACE_BETWEEN_SPRITES * scale;
        }
        sprite.x = prevX;

        let yPosition = -rect.height / 2 + 20;
        if (formula[playIndex] === 'equal') yPosition += 25;
        sprite.y = yPosition;
      });

      const playNext = () => {
        if (controller.signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          stop();
          return;
        }

        if (playIndex >= sprites.current.length) {
          resolve(onFinishRef.current?.());
          return;
        }

        const sprite = sprites.current[playIndex];

        const animationSpeed = totalDuration / (options?.durationSec ?? 1);
        sprite.animationSpeed = animationSpeed;
        if (animationSpeed > 5) {
          sprite.gotoAndStop(sprite.totalFrames - 1);
        }

        sprite.loop = false;
        sprite.visible = true;
        sprite.play();

        sprite.onComplete = () => {
          if (controller.signal.aborted) {
            reject(new DOMException('Aborted', 'AbortError'));
            finish();
            return;
          }

          sprite.currentFrame = sprite.totalFrames - 1;
          playIndex++;
          playNext();
        };
      };

      // Listen for external abort
      controller.signal.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'));
        finish();
      });

      playNext();
    });
  };

  return <FormulaContext.Provider value={{ show, finish }}>{children}</FormulaContext.Provider>;
};

export { FormulaContext, FormulaContextProvider };
