import type { FC, ReactNode, SVGProps } from 'react';
import Modal from './ui/modal';

const InfoModal = ({
  icon: IconComponent,
  title,
  button,
  onClose,
}: {
  icon?: FC<SVGProps<SVGSVGElement>>;
  title: string;
  button: ReactNode | null;
  onClose?: () => void;
}) => {
  return (
    <Modal onClose={onClose}>
      {IconComponent && <IconComponent className={'text-[#C6AA73] size-12 sm:size-16'} />}
      <h1 className="sm:text-lg font-semibold text-white max-w-[80%]">{title}</h1>
      {button && button}
    </Modal>
  );
};

export default InfoModal;
