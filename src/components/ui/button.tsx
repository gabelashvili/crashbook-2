import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import clsx from 'clsx';

// Define button variants
const buttonVariants = cva(
  'shadow-[0_4px_4px_0_#00000040] rounded-[10px] relative overflow-hidden border border-[#372D6F] cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-[linear-gradient(110.14deg,#8350FF_9.94%,#502AAC_89.84%)]',
        secondary: 'bg-[linear-gradient(110.14deg,#F1AB41_9.94%,#BD7111_89.84%)]',
        tertiary: 'bg-[linear-gradient(110.14deg,#A13678_10%,#850654_90%)]',
      },
      size: {
        md: '',
        lg: 'py-3 px-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
);

// Props type for Button
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

// Component
const Button: React.FC<ButtonProps> = ({ variant, size, className, children, ...props }) => {
  return (
    <button className={clsx(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
