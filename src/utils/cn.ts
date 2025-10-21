import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Define the custom cn function
const cn = (...inputs: Parameters<typeof clsx>) => {
  return twMerge(clsx(inputs));
};

export default cn;
