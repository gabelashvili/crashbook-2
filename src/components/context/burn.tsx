import { createContext, use, type ReactNode } from 'react';
import { AnimationContext } from './animation';
import { FormulaContext, type FormulaKey } from './formula';
import * as PIXI from 'pixi.js';

// Define the shape of your context
type BurnContextProps = {
  show: (duration: number, formula: FormulaKey[], potentialWinAmount: string) => void;
};

// Create the context with a default value (can be null)
const BurnContext = createContext<BurnContextProps>({
  show: () => Promise.resolve(),
});

const showBurnTitle = (spine: PIXI.Container) => {
  const labelColor = new PIXI.Color({ r: 120, g: 67, b: 0, a: 0.9 });

  const label = new PIXI.Text({
    text: 'Potential',
    style: {
      fontSize: 100,
      fill: labelColor,
      fontWeight: 'bold',
      letterSpacing: 5,
      fontFamily: 'Lexend-VariableFont_wght',
    },
  });
  const label2 = new PIXI.Text({
    text: 'Winning',
    style: {
      fontSize: 95,
      fill: labelColor,
      fontWeight: 'bold',
      letterSpacing: 5,
      fontFamily: 'Lexend-VariableFont_wght',
    },
  });

  // -820
  const startX = -808 + 40;
  const endX = -90;
  const distance = endX - startX;

  const labelScale = Math.min(distance / label.width, 1);
  label.scale.set(labelScale);

  label.x = startX + (distance - label.width) / 2;
  label.y = -350;

  label2.x = startX + (distance - label2.width) / 2;
  label2.y = label.y + label2.height;

  spine.addChild(label);
  spine.addChild(label2);
};

const showPotentialWinAmount = (spine: PIXI.Container, amount: string) => {
  const amountLabel = new PIXI.Text({
    text: amount.toString(),
    style: {
      fontSize: 130,
      fontWeight: 'bold',
      fill: new PIXI.Color({ r: 120, g: 67, b: 0, a: 1 }),
    },
  });

  const startX = -650 + 50;
  const endX = -270;
  const distanceX = endX - startX;
  const amountLabelScale = Math.min(distanceX / amountLabel.width, 1);

  amountLabel.scale.set(amountLabelScale);
  amountLabel.x = startX + (distanceX - amountLabel.width) / 2;

  const startY = 20;
  const endY = 210;
  const distanceY = endY - startY;
  const amountLabelY = startY + (distanceY - amountLabel.height) / 2 + 30;

  amountLabel.y = amountLabelY;

  spine.addChild(amountLabel);
};

// Context Provider
const BurnContextProvider = ({ children }: { children: ReactNode }) => {
  const animationContext = use(AnimationContext);
  const formulaContext = use(FormulaContext);
  const spine = animationContext.spines.burn!;
  const initialDuration = spine.state.data.skeletonData.findAnimation('animation')!.duration;

  const show = (duration = initialDuration, formula: FormulaKey[], potentialWinAmount: string) => {
    spine.removeChildren();
    spine.visible = false;
    const formulaDuration = duration * 0.2;
    const burnDuration = duration - formulaDuration;
    formulaContext.show(animationContext.spines.turn!, formula, {
      durationSec: formulaDuration,
      onFinish: () => {
        showBurnTitle(spine);

        showPotentialWinAmount(animationContext.spines.turn!, potentialWinAmount);
        spine.visible = true;

        const entry = spine.state.setAnimation(0, 'animation', false);

        entry.timeScale = initialDuration / burnDuration;
        entry.animationEnd = entry.animation!.duration - 1.3;

        entry.listener = {
          complete: () => {
            spine.state.clearTracks();
            spine.update(0);
          },
        };
      },
    });
  };

  return (
    <BurnContext.Provider
      value={{
        show,
      }}
    >
      {children}
    </BurnContext.Provider>
  );
};

export { BurnContext, BurnContextProvider };
