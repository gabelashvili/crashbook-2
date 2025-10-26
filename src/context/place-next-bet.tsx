import { createContext, use, useRef, type ReactNode, useState } from 'react';
import { AnimationContext } from './animation';
import { TurnContext } from './turn';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';

type PlaceNextBetContextProps = {
  show: (duration: number) => Promise<void>;
  isPlaying: boolean;
};

const PlaceNextBetContext = createContext<PlaceNextBetContextProps>({
  show: () => Promise.resolve(),
  isPlaying: false,
});

function createTypewriterAnimation(app: PIXI.Application) {
  // --- Text style ---
  const style = new PIXI.TextStyle({
    fontFamily: 'Lexend-VariableFont_wght, Arial, sans-serif',
    fontSize: 95,
    fontWeight: '600',
    letterSpacing: 1.5,
    fill: new PIXI.Color({
      r: 120,
      g: 67,
      b: 0,
      a: 1,
    }),
  });

  // --- Text object ---
  const text = new PIXI.Text({ text: 'Place your bet', style });
  const startX = -820;
  const endX = -70;
  const maxWidth = endX - startX;
  text.x = startX + (maxWidth - text.width) / 2;
  text.y = -350; // start above the screen
  text.alpha = 0;
  app.stage.addChild(text);

  // --- Drop animation using GSAP ---
  const gsapAnimation = gsap.to(text, {
    duration: 0.7,
    y: -100, // final position
    alpha: 1,
    ease: 'bounce.out', // nice drop bounce
  });

  // --- Optional: subtle breathing after it lands ---

  return { text, gsapAnimation };
}

const PlaceNextBetContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const turnContext = use(TurnContext);
  const currentAbort = useRef<AbortController | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const show = async (duration: number = 1.5): Promise<void> => {
    if (!animationContext.spines.turn?.visible) {
      throw new Error('Turn spine is not visible');
    }
    return new Promise((resolve) => {
      currentAbort.current = new AbortController();

      setIsPlaying(true);
      turnContext.show({
        duration: duration * 0.7,
        onFinish: () => {
          const { text, gsapAnimation } = createTypewriterAnimation(animationContext.application!);
          gsapAnimation.timeScale(duration * 0.3);
          gsapAnimation.eventCallback('onComplete', () => {
            resolve();
          });
          animationContext.spines.turn!.addChild(text);
        },
      });
    });
  };

  return <PlaceNextBetContext.Provider value={{ show, isPlaying }}>{children}</PlaceNextBetContext.Provider>;
};

export { PlaceNextBetContext, PlaceNextBetContextProvider };
