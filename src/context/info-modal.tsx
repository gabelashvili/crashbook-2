import React, { createContext, useState, type FC, type ReactNode, type SVGProps } from 'react';
import InfoModal from '../components/info-modal';

export interface InfoModalContextType {
  open: null | {
    title: string;
    icon?: FC<SVGProps<SVGSVGElement>>;
    button?: ReactNode;
    closable?: boolean;
  };
  setOpen: (
    open: null | {
      title: string;
      icon?: FC<SVGProps<SVGSVGElement>>;
      button?: ReactNode;
      closable?: boolean;
    },
  ) => void;
}

const InfoModalContext = createContext<InfoModalContextType>({
  open: null,
  setOpen: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

const InfoModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<null | {
    title: string;
    icon?: FC;
    button?: ReactNode;
    closable?: boolean;
  }>(null);

  return (
    <InfoModalContext.Provider value={{ open, setOpen }}>
      {open && (
        <InfoModal
          icon={open.icon}
          title={open.title}
          button={open.button}
          onClose={open.closable ? () => setOpen(null) : undefined}
        />
      )}
      {children}
    </InfoModalContext.Provider>
  );
};

export { InfoModalContext, InfoModalProvider };
