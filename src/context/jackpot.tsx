import { createContext, use, useRef, type ReactNode } from 'react';
import { AnimationContext } from './animation';
import * as PIXI from 'pixi.js';

// Define the shape of your context
type JackpotContextProps = {
  show: (duration: number, amount: string) => void;
  initialDuration: number;
};

// Create the context with a default value (can be null)
const JackpotContext = createContext<JackpotContextProps>({
  show: () => {},
  initialDuration: 0,
});

const generateAmountText = (amount: string) => {
  const jackpotAmount = new PIXI.Text({
    text: amount,
    style: {
      fontSize: 180,
      fontWeight: '600',
      fill: new PIXI.Color('#fff6a3'),
    },
  });
  const startX = -650;
  const endX = -260;
  const maxWidth = endX - startX;
  const startY = -30;
  const endY = 150;
  const maxHeight = endY - startY;
  const scale = Math.min(maxWidth / jackpotAmount.width, 1);
  jackpotAmount.scale.set(scale);
  jackpotAmount.x = startX + (maxWidth - jackpotAmount.width) / 2 + 18;
  jackpotAmount.y = startY + (maxHeight - jackpotAmount.height) / 2 + 40;
  jackpotAmount.visible = false;

  return jackpotAmount;
};

// Context Provider
const JackpotContextProvider = ({ children }: { children: ReactNode }) => {
  const tickerFnRef = useRef<() => void>(() => {});

  const animationContext = use(AnimationContext);
  const jackpotLeft = animationContext.spines.jackpotLeft!;
  const jackpotRight = animationContext.spines.jackpotRight!;
  const jackpotLeftInitialDuration = jackpotLeft.state.data.skeletonData.findAnimation('animation')!.duration;
  const jackpotRightInitialDuration = 2.5;
  const textSlot = jackpotLeft.skeleton.findSlot('120');
  textSlot!.color.a = 0;

  //

  const show = (duration: number, amount: string) => {
    const start = performance.now();
    jackpotLeft.removeChildren();
    const rightAnimationDuration = duration * 0.1;
    const leftAnimationDuration = duration - rightAnimationDuration;

    const amountText = generateAmountText(amount);
    jackpotLeft.addChild(amountText);

    const winTextBoxSlot = animationContext.spines.win?.skeleton.findSlot('text 01');
    winTextBoxSlot!.color.a = 0;

    jackpotLeft.visible = true;
    jackpotRight.visible = true;
    const jackpotLeftEntry = jackpotLeft.state.setAnimation(0, 'animation', false);
    const jackpotRightEntry = jackpotRight.state.setAnimation(0, 'animation', false);
    jackpotLeftEntry.timeScale = 0;

    jackpotRightEntry.timeScale = jackpotRightInitialDuration / rightAnimationDuration;

    jackpotRightEntry.animationStart = 3.5;
    jackpotRightEntry.animationEnd = 6;
    jackpotRightEntry.listener = {
      complete: () => {
        jackpotRight.state.clearTracks();
        jackpotLeft.visible = true;
        jackpotLeftEntry.timeScale = jackpotLeftInitialDuration / leftAnimationDuration;

        tickerFnRef.current = () => {
          const isSlotVisible = !!textSlot?.attachment?.name;
          if (isSlotVisible) {
            amountText.visible = true;
          }
        };

        animationContext.application!.ticker.add(tickerFnRef.current);
      },
    };

    jackpotLeftEntry.listener = {
      complete: () => {
        console.log(performance.now() - start);
        jackpotLeft.state.clearTracks();
        animationContext.application?.ticker.remove(tickerFnRef.current);
      },
    };
  };
  return (
    <JackpotContext.Provider
      value={{
        show,
        initialDuration: 1,
      }}
    >
      {children}
    </JackpotContext.Provider>
  );
};

export { JackpotContext, JackpotContextProvider };
