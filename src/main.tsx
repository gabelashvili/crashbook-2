import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { SignalRProvider } from './context/signalr.tsx';
import { AnimationContextProvider } from './context/animation.tsx';
import { OpenContextProvider } from './context/open.tsx';
import { TurnContextProvider } from './context/turn.tsx';
import { FormulaContextProvider } from './context/formula.tsx';
import { WinContextProvider } from './context/win.tsx';
import { BurnContextProvider } from './context/burn.tsx';
import { GameProvider } from './context/game.tsx';
import { ModalProvider } from './context/modal.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalProvider>
      <GameProvider>
        <SignalRProvider>
          <AnimationContextProvider>
            <OpenContextProvider>
              <TurnContextProvider>
                <FormulaContextProvider>
                  <WinContextProvider>
                    <BurnContextProvider>
                      <App />
                    </BurnContextProvider>
                  </WinContextProvider>
                </FormulaContextProvider>
              </TurnContextProvider>
            </OpenContextProvider>
          </AnimationContextProvider>
        </SignalRProvider>
      </GameProvider>
    </ModalProvider>
  </StrictMode>,
);
