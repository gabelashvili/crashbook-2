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
import { InfoModalProvider } from './context/info-modal.tsx';
import { JackpotContextProvider } from './context/jackpot.tsx';
import { PlaceNextBetContextProvider } from './context/place-next-bet.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InfoModalProvider>
      <GameProvider>
        <AnimationContextProvider>
          <JackpotContextProvider>
            <OpenContextProvider>
              <TurnContextProvider>
                <PlaceNextBetContextProvider>
                  <FormulaContextProvider>
                    <WinContextProvider>
                      <BurnContextProvider>
                        <SignalRProvider>
                          <App />
                        </SignalRProvider>
                      </BurnContextProvider>
                    </WinContextProvider>
                  </FormulaContextProvider>
                </PlaceNextBetContextProvider>
              </TurnContextProvider>
            </OpenContextProvider>
          </JackpotContextProvider>
        </AnimationContextProvider>
      </GameProvider>
    </InfoModalProvider>
  </StrictMode>,
);
