import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AnimationContextProvider } from './components/context/animation.tsx';
import { OpenContextProvider } from './components/context/open.tsx';
import { TurnContextProvider } from './components/context/turn.tsx';
import { FormulaContextProvider } from './components/context/formula.tsx';
import { WinContextProvider } from './components/context/win.tsx';
import { BurnContextProvider } from './components/context/burn.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
);
