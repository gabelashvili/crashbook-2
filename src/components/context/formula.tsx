import { createContext, use, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { AnimationContext } from './animation';
import * as PIXI from 'pixi.js';

type FormulaKey =
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
  | 'multiply';

// Define the shape of your context
type FormulaContextProps = {
  show: (formula: FormulaKey[], options?: { durationSec?: number; onFinish?: () => void }) => void;
};

// Create the context with a default value (can be null)
const FormulaContext = createContext<FormulaContextProps>({
  show: () => Promise.resolve(),
});

const container = new PIXI.Container();

// Context Provider
const FormulaContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);

  const show: FormulaContextProps['show'] = (formula, options) => {
    if (!animationContext.application) return;
    const MAX_WIDTH = (animationContext.application.screen.width / 2) * 0.6;
    const SPACE_BETWEEN_SPRITES = 20;

    container.removeChildren();
    const animationSprites: PIXI.AnimatedSprite[] = [];
    formula.forEach((key) => {
      const gif = PIXI.Assets.get(`gif-${key}`);
      if (gif) {
        const sprite = new PIXI.AnimatedSprite(gif.textures);
        sprite.visible = false;
        animationSprites.push(sprite);
        sprite.gotoAndStop(0);
      }
    });
    const totalDurationSec = animationSprites.reduce((acc, sprite) => {
      return acc + sprite.totalFrames / (sprite.animationSpeed * 60);
    }, 0);
    const timeScale = totalDurationSec / (options?.durationSec ?? 1);

    const totalWidth = animationSprites.reduce((acc, sprite, spriteIndex) => {
      return (
        acc +
        sprite.width +
        (spriteIndex > 0 && spriteIndex !== animationSprites.length - 1 ? SPACE_BETWEEN_SPRITES : 0)
      );
    }, 0);
    const scale = Math.min(MAX_WIDTH / totalWidth, 0.4);
    const maxHeight = animationSprites.reduce((acc, sprite) => {
      return Math.max(acc, sprite.height * scale);
    }, 0);

    container.addChild(...animationSprites);

    let playIndex = 0;
    const startPoint =
      (animationContext.application!.screen.width + (animationContext.application!.screen.width / 2 - MAX_WIDTH) / 2) /
      2;
    const emptySpace = Math.max(MAX_WIDTH - totalWidth * scale, 0);
    let prevX = startPoint + emptySpace / 2 + 15;

    const playNext = () => {
      if (playIndex >= animationSprites.length) {
        options?.onFinish?.();
        return;
      }
      if (playIndex > 0 && playIndex < animationSprites.length) {
        prevX += SPACE_BETWEEN_SPRITES * scale + animationSprites[playIndex - 1].width;
      }

      console.log(timeScale);

      const sprite = animationSprites[playIndex];
      sprite.visible = true;
      sprite.loop = false;
      sprite.x = prevX;
      sprite.y = (animationContext.application!.screen.height - maxHeight) / 2;
      sprite.animationSpeed = timeScale;
      sprite.scale.set(scale);
      sprite.play();

      // When this sprite finishes, play the next one
      sprite.onComplete = () => {
        playIndex++;
        playNext();
      };
    };

    // Start the chain
    playNext();
  };

  useEffect(() => {
    animationContext.application!.stage.addChild(container);
    return () => {
      animationContext.application!.stage.removeChild(container);
    };
  }, [animationContext.application]);

  return (
    <FormulaContext.Provider
      value={{
        show,
      }}
    >
      {children}
    </FormulaContext.Provider>
  );
};

export { FormulaContext, FormulaContextProvider };
