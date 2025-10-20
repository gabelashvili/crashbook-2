/* eslint-disable @typescript-eslint/no-explicit-any */
import * as PIXI from 'pixi.js';
import * as spine from '@esotericsoftware/spine-pixi-v8';
import type { Spine } from '@esotericsoftware/spine-pixi-v8';
import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Assets } from 'pixi.js';
import { GifSprite, type GifSource } from 'pixi.js/gif';

type AnimationContextProps = {
  spines: { open: Spine | null; turn: Spine | null; win: Spine | null; burn: Spine | null };
  setContainer: (containerRef: HTMLDivElement) => void;
  loading: boolean;
  application: PIXI.Application | null;
  hideAllSpines: () => void;
  currentAnimation: (typeof spinesList)[number] | null;
  setCurrentAnimation: (animation: (typeof spinesList)[number]) => void;
};

const spinesList = ['open', 'turn', 'win', 'burn'] as const;
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
  spines: { open: null, turn: null, win: null, burn: null },
  setContainer: () => {},
  loading: true,
  application: null,
  hideAllSpines: () => {},
  currentAnimation: null,
  setCurrentAnimation: () => {},
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

const updateSpineSizes = (spines: Spine[], container: HTMLElement) => {
  const { width, height } = getContainerSizes(container);
  const defaultSkeletonDataWidth = spines[0].skeleton.data.width;
  const defaultSkeletonDataHeight = spines[0].skeleton.data.height;
  const scaleX = (width / defaultSkeletonDataWidth) * 0.99;
  const scaleY = height / defaultSkeletonDataHeight;
  spines.forEach((spine) => {
    spine.scale.set(scaleX, scaleY);
    spine.x = width / 2;
    spine.y = height / 2;
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
  });
  const [applicationRef, setApplicationRef] = useState<PIXI.Application | null>(null);
  const currentAnimation = useRef<(typeof spinesList)[number] | null>('open');

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
    updateSpineSizes(
      Object.values(spinesRef.current).filter((spine) => spine !== null),
      applicationRef.canvas.parentElement.parentElement,
    );
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

  const setCurrentAnimation = useCallback((animation: (typeof spinesList)[number]) => {
    currentAnimation.current = animation;
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
        currentAnimation: currentAnimation.current,
        setCurrentAnimation,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AnimationContext.Provider>
  );
};

export { AnimationContext, AnimationContextProvider };
