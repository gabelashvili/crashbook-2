import React from 'react';

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="25.0002" cy="25" r="22.9167" stroke="currentColor" strokeWidth="2" />
      <path d="M25 14.5834V25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 33.3334V34.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default InfoIcon;
