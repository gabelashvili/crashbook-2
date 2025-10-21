import React, { createContext, useState, type FC, type ReactNode, type SVGProps } from 'react';
import Modal from '../components/ui/modal';

export interface ModalContextType {
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

const ModalContext = createContext<ModalContextType>({
  open: null,
  setOpen: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<null | {
    title: string;
    icon?: FC;
    button?: ReactNode;
    closable?: boolean;
  }>(null);

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {open && (
        <Modal
          icon={open.icon}
          title={open.title}
          button={open.button}
          closable={open.closable ?? true}
          onClose={() => setOpen(null)}
        />
      )}
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
