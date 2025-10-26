import React, { useEffect, useRef, useState } from 'react';
import cn from '../../utils/cn';

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  labelClassName?: string;
  className?: string;
  trackClassName?: string;
  knobClassName?: string;
};
export const Switch = ({ label, labelClassName, className, trackClassName, knobClassName, ...rest }: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsChecked(!!rest.checked);
  }, [rest.checked]);
  return (
    <label className={cn('inline-flex items-center cursor-pointer', className)}>
      <input type="checkbox" className="sr-only peer" {...rest} />

      {label && <span className={cn('font-semibold text-white  mr-2 text-xs', labelClassName)}>{label}</span>}

      <div className="p-[2px] bg-[#9D79F7] rounded-full relative">
        <div
          className={cn(
            'shadow-[inset_0px_4px_4px_0px_#00000040]  bg-[#291243] rounded-full w-8 h-4',
            isChecked && 'bg-[#814FFC]',
            trackClassName,
          )}
        />
        <div
          ref={knobRef}
          className={cn(
            'mark transition-all size-2.5 rounded-full bg-[linear-gradient(180deg,#FFFFFF_0%,#A6A6A6_100%)] absolute top-[50%] translate-y-[-50%] left-2',
            knobClassName,
          )}
          style={{
            left: isChecked ? `calc(100% - ${(knobRef.current?.offsetWidth || 0) + 4}px)` : '4px',
          }}
        />
      </div>
    </label>
  );
};
