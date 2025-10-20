import { createContext, use, type ReactNode } from 'react';
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

type FormulaContextProps = {
  show: (
    parentSpine: PIXI.Container,
    formula: FormulaKey[],
    options?: { durationSec?: number; onFinish?: () => void },
  ) => void;
};

const FormulaContext = createContext<FormulaContextProps>({
  show: () => Promise.resolve(),
});

// Rectangle where GIFs are displayed
const rect = new PIXI.Graphics();
rect.rect(90, -50, 700, 150);
const leftSideRectGrapgicsRgba = new PIXI.Color({ r: 255, g: 0, b: 0, a: 0 });
rect.fill(leftSideRectGrapgicsRgba);
rect.visible = true;

const FormulaContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);

  const show: FormulaContextProps['show'] = (parentSpine, formula, options) => {
    if (!animationContext.application) return;

    parentSpine!.addChild(rect);

    const SPACE_BETWEEN_SPRITES = 50;
    rect.removeChildren();

    const animationSprites: PIXI.AnimatedSprite[] = [];
    formula.forEach((key) => {
      const gif = PIXI.Assets.get(`gif-${key}`);
      if (gif) {
        const sprite = new PIXI.AnimatedSprite(gif.textures);
        sprite.visible = false;
        sprite.gotoAndStop(0);
        animationSprites.push(sprite);
      }
    });

    rect.addChild(...animationSprites);

    const totalDuration = animationSprites.reduce((acc, sprite) => {
      return acc + sprite.totalFrames * (sprite.animationSpeed / 60);
    }, 0);
    // Calculate total width of sprites including spacing
    const totalWidthRaw = animationSprites.reduce((acc, sprite) => {
      return acc + sprite.width + SPACE_BETWEEN_SPRITES;
    }, 0);

    // Determine horizontal scale to fit rect width
    const scale = Math.min(rect.width / totalWidthRaw, 0.6);

    // Starting X position
    let prevX = 100 - (totalWidthRaw * scale <= rect.width ? (totalWidthRaw * scale - rect.width) / 2 : 0);
    let playIndex = 0;

    const maxSpriteHeight = Math.max(...animationSprites.map((sprite) => sprite.height));

    const playNext = () => {
      if (playIndex >= animationSprites.length) {
        options?.onFinish?.();
        return;
      }

      const sprite = animationSprites[playIndex];

      // Apply horizontal scale
      sprite.scale.set(scale); // scale X only, keep Y

      // Horizontal position
      if (playIndex > 0) {
        const prevSprite = animationSprites[playIndex - 1];
        prevX += prevSprite.width + SPACE_BETWEEN_SPRITES * scale;
      }
      sprite.x = prevX;

      // Vertical centering

      let yPosition = -rect.height / 2 + (maxSpriteHeight * scale) / 2 + 20;
      if (formula[playIndex] === 'equal') {
        yPosition += 25;
      }
      sprite.y = yPosition;

      const animationSpeed = totalDuration / (options?.durationSec ?? 1);
      sprite.animationSpeed = animationSpeed;
      if (animationSpeed > 5) {
        sprite.gotoAndStop(sprite.totalFrames - 1);
      }
      sprite.loop = false;
      sprite.visible = true;
      sprite.play();

      sprite.onComplete = () => {
        sprite.currentFrame = sprite.totalFrames - 1;
        playIndex++;
        playNext();
      };
    };

    playNext();
  };

  return <FormulaContext.Provider value={{ show }}>{children}</FormulaContext.Provider>;
};

export { FormulaContext, FormulaContextProvider };
