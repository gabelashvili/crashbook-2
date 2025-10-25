import { createContext, use, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimationContext } from './animation';
import { GameContext } from './game';

// Define the shape of your context
type TurnContextProps = {
  show: (data: { duration?: number; onFinish?: () => void }) => Promise<void>;
  initialDuration: number;
  isTurning: boolean;
};

// Create the context with a default value (can be null)
const TurnContext = createContext<TurnContextProps>({
  show: () => Promise.resolve(),
  initialDuration: 0,
  isTurning: false,
});

const THRESHOLD_SPEED = 0.5;
const THRESHOLD_DISTANCE = 10;

// Context Provider
const TurnContextProvider = ({ children }: { children: ReactNode }) => {
  const gameContext = use(GameContext);
  const gameIdRef = useRef<number | null>(null);
  const animationContext = use(AnimationContext);
  const spine = animationContext.spines.turn!;
  const initialDuration = spine.state.data.skeletonData.findAnimation('animation')!.duration;
  const tickerFnRef = useRef<() => void>(() => {});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTurning, setIsTurning] = useState(false);
  const isPointerDown = useRef(false);
  const lastX = useRef(0);
  const lastTime = useRef(0);

  const show = async ({ duration = initialDuration, onFinish }: { duration?: number; onFinish?: () => void }) => {
    spine.removeChildren();
    animationContext.hideAllSpines();
    spine.visible = true;
    setIsTurning(true);

    const previousEntry = spine.state.tracks[0];
    if (previousEntry) {
      previousEntry.timeScale = 5;
      return;
    }

    // Now start the new animation
    const entry = spine.state.setAnimation(0, 'animation', false);
    animationContext.application!.ticker.remove(tickerFnRef.current!);
    entry.timeScale = initialDuration / duration;
    entry.animationEnd = entry.animation!.duration - 1.2;
    entry.listener = {
      complete: () => {
        onFinish?.();
        spine.state.clearTracks();
        // setIsTurning(false);
      },
    };
  };

  const handleFlip = useCallback(() => {
    if (!animationContext.application) return;
    animationContext.application.canvas.addEventListener('pointerdown', (e) => {
      const canvasWidth = (e.target as HTMLCanvasElement).clientWidth;
      if (canvasWidth - e.offsetX < canvasWidth / 4) {
        if (window.isWinPlaying) {
          window.finsihWinAnimation();
          return;
        }
        isPointerDown.current = true;
      }
    });

    animationContext.application.canvas.addEventListener('pointerup', () => {
      isPointerDown.current = false;
    });

    animationContext.application.canvas.addEventListener('mousemove', (e) => {
      const currentX = e.x;
      const currentTime = performance.now();

      const deltaX = currentX - lastX.current;
      const deltaTime = currentTime - lastTime.current;

      const speed = Math.abs(deltaX / deltaTime); // pixels/ms

      if (Math.abs(deltaX) >= THRESHOLD_DISTANCE && speed >= THRESHOLD_SPEED && isPointerDown.current) {
        isPointerDown.current = false;
        // onFlip?.current?.();
        if (window.signalRConnection && spine.state.tracks.length === 0 && !window.isWinPlaying && gameIdRef.current) {
          window.signalRConnection?.invoke('TurnThePage', { gameId: gameIdRef.current });
        }
      }

      lastX.current = currentX;
      lastTime.current = currentTime;
    });
  }, [animationContext.application, spine.state.tracks.length]);

  useEffect(() => {
    handleFlip();
  }, [handleFlip, gameContext?.state]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    gameIdRef.current = gameContext?.state.game?.id ?? null;
  }, [gameContext?.state.game?.id]);

  return (
    <TurnContext.Provider
      value={{
        show,
        initialDuration,
        isTurning,
      }}
    >
      {children}
    </TurnContext.Provider>
  );
};

export { TurnContext, TurnContextProvider };
