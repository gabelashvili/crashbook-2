import React from 'react';

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5.54712 5.80981L17.3572 18.179"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.54712 18.179L17.3572 5.8098"
        stroke="#C5A973"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CloseIcon;
