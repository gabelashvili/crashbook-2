/* eslint-disable @typescript-eslint/no-explicit-any */
import * as PIXI from 'pixi.js';
import * as spine from '@esotericsoftware/spine-pixi-v8';
import type { Spine } from '@esotericsoftware/spine-pixi-v8';
import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Assets } from 'pixi.js';
import { GifSprite, type GifSource } from 'pixi.js/gif';
import LoadingIcon from '../components/icons/loading';

type AnimationContextProps = {
  spines: {
    open: Spine | null;
    turn: Spine | null;
    win: Spine | null;
    burn: Spine | null;
    jackpotLeft: Spine | null;
    jackpotRight: Spine | null;
  };
  setContainer: (containerRef: HTMLDivElement) => void;
  loading: boolean;
  application: PIXI.Application | null;
  hideAllSpines: () => void;
};

const spinesList = ['open', 'turn', 'win', 'burn', 'jackpotLeft', 'jackpotRight'] as const;
const gifsList = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'divide',
  'close-bracket',
  'open-bracket',
  'minus',
  'plus',
  'multiply',
  'equal',
] as const;

const AnimationContext = createContext<AnimationContextProps>({
  spines: { open: null, turn: null, win: null, burn: null, jackpotLeft: null, jackpotRight: null },
  setContainer: () => {},
  loading: true,
  application: null,
  hideAllSpines: () => {},
});

// Get real container sizes
const getContainerSizes = (container: HTMLElement) => {
  const rootRect = container.getBoundingClientRect();
  const notificationContainer = document.getElementById('notification-container')!.getBoundingClientRect();
  const flipNextContainer = document.getElementById('flip-next')!.getBoundingClientRect();
  return { width: rootRect.width, height: rootRect.height - notificationContainer.height - flipNextContainer.height };
};

// Resize PIXI renderer
const resizeApplication = (app: PIXI.Application, container: HTMLElement) => {
  const { width, height } = getContainerSizes(container);
  app.renderer.resize(width, height, 2); // internal size
};

const updateSpineSizes = (spines: AnimationContextProps['spines'], container: HTMLElement) => {
  const spinesArray = Object.values(spines).filter((spine) => spine !== null);
  const { width, height } = getContainerSizes(container);
  const defaultSkeletonDataWidth = spines.open!.skeleton.data.width;
  const defaultSkeletonDataHeight = spines.open!.skeleton.data.height;
  const scaleX = (width / defaultSkeletonDataWidth) * 0.99;
  const scaleY = height / defaultSkeletonDataHeight;

  spinesArray.forEach((spine) => {
    if (spine === spines.jackpotRight) {
      spine.scale.set(scaleX * 1.57, scaleY);
      spine.x = width / 2 - width * 0.106;
      spine.y = height / 2;
    } else if (spine === spines.jackpotLeft) {
      spine.scale.set(scaleX, scaleY);
      spine.x = width / 2;
      spine.y = height / 2 + height * 0.012;
    } else if (spine === spines.burn) {
      spine.scale.set(scaleX, scaleY * 1.1);
      spine.x = 10;
      spine.y = height / 2 + height * 0.012 + 25;
    } else {
      spine.scale.set(scaleX, scaleY);
      spine.x = width / 2;
      spine.y = height / 2;
    }
  });

  return { scaleX, scaleY, width, height };
};

// Context Provider
const AnimationContextProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const spinesRef = useRef<AnimationContextProps['spines']>({
    open: null,
    turn: null,
    win: null,
    burn: null,
    jackpotLeft: null,
    jackpotRight: null,
  });
  const [applicationRef, setApplicationRef] = useState<PIXI.Application | null>(null);

  const loadSpinesAssets = useCallback(async () => {
    const loadedAssets = await PIXI.Assets.load(
      spinesList
        .map((spine) => [
          { alias: `${spine}-json`, src: `/spines/${spine}/skeleton.json` },
          { alias: `${spine}-atlas`, src: `/spines/${spine}/skeleton.atlas` },
        ])
        .flat(),
    );

    const loadedGifs = await Promise.all(
      gifsList.map((gif) =>
        Assets.load<GifSource>({
          src: `/gifs/${gif}.gif`,
          alias: `gif-${gif}`,
        }),
      ),
    );
    loadedGifs.forEach((gif) => {
      new GifSprite(gif);
    });

    // Load custom assets
    await Assets.load([{ alias: 'currentWinning', src: '/spines/shared/current-winning.png' }]);

    const font = new FontFace('Lexend-VariableFont_wght', 'url(/fonts/Lexend-VariableFont_wght.ttf)');
    await font.load();
    document.fonts.add(font);
    await document.fonts.ready;

    Object.values(loadedAssets).forEach((asset: any) => {
      if (asset?.pages?.[0]?.texture) {
        asset.pages[0].texture.setFilters(
          spine.TextureFilter.MipMapLinearLinear,
          spine.TextureFilter.MipMapLinearLinear,
        );
      }
    });

    spinesList.forEach((item) => {
      const animation = spine.Spine.from({
        atlas: `${item}-atlas`,
        skeleton: `${item}-json`,
        scale: 1,
      });
      animation.visible = false;
      spinesRef.current[item as keyof typeof spinesRef.current] = animation;
    });

    const application = new PIXI.Application();

    Object.values(spinesRef.current).forEach((spine) => {
      application.stage.addChild(spine!);
    });

    await application.init({
      resolution: window.devicePixelRatio || 1,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
    });

    setApplicationRef(application);
  }, []);

  const loadAssets = useCallback(async () => {
    await loadSpinesAssets();
    setLoading(false);
  }, [loadSpinesAssets]);

  const onResize = useCallback(() => {
    if (!applicationRef || !applicationRef.canvas.parentElement?.parentElement) return;
    resizeApplication(applicationRef, applicationRef.canvas.parentElement.parentElement);
    updateSpineSizes(spinesRef.current, applicationRef.canvas.parentElement.parentElement);
  }, [applicationRef]);

  const setContainer = useCallback(
    (container: HTMLDivElement | null) => {
      if (!container || !applicationRef) return;
      container.appendChild(applicationRef.canvas);
      onResize();
    },
    [applicationRef, onResize],
  );

  const hideAllSpines = useCallback(() => {
    Object.values(spinesRef.current).forEach((spine) => {
      spine!.visible = false;
    });
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  return (
    <AnimationContext.Provider
      value={{
        spines: spinesRef.current,
        setContainer,
        loading,
        application: applicationRef,
        hideAllSpines,
      }}
    >
      {loading ? (
        <div className="h-dvh flex items-center justify-center">
          <LoadingIcon className="size-12 text-[#C5A973]" />
        </div>
      ) : (
        children
      )}
    </AnimationContext.Provider>
  );
};

export { AnimationContext, AnimationContextProvider };
