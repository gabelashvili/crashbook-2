import type { ReactNode } from 'react';
import CloseIcon from '../icons/close';

const Modal = ({ onClose, children }: { onClose?: () => void; children: ReactNode }) => {
  return (
    <div className="fixed w-full h-dvh bg-black/60 flex items-center justify-center z-50 ">
      <div className="bg-[#3B1252] border border-[#C5A973] rounded-sm max-w-md w-full aspect-[2/1.1] h-max relative  grid mx-4">
        {onClose && (
          <button
            className="absolute top-0 right-0 size-8 flex items-end justify-center cursor-pointer z-20"
            onClick={onClose}
          >
            <CloseIcon className="text-[#C6AA73] size-5 md:size-6" />
          </button>
        )}
        <div className="absolute w-full h-full left-0 px-2 pt-5 pb-2">
          <svg className="w-full h-full" viewBox="0 0 329 194" fill="none" preserveAspectRatio="none">
            <path
              d="M12.8412 13.4918L25.1379 1H302.496L315.703 13.9545L328 26.5042V193.783H1V26.9596L12.8412 13.4918Z"
              fill="#280A3A"
            />
            <path d="M192.737 1H25.7621C16.0932 10.6331 10.6689 16.0373 1.00005 25.6705V78.4234" fill="#280A3A" />
            <path
              d="M192.737 1H25.7621C16.0932 10.6331 10.669 16.0373 1.00005 25.6705V78.4234"
              stroke="url(#paint0_linear_102_4115)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M193.192 1H303.238C312.907 10.6331 318.331 16.0373 328 25.6705V78.4234" fill="#280A3A" />
            <path
              d="M193.192 1H303.238C312.907 10.6331 318.331 16.0373 328 25.6705V78.4234"
              stroke="url(#paint1_linear_102_4115)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <mask
              id="mask0_102_4115"
              style={{ maskType: 'alpha' }}
              maskUnits="userSpaceOnUse"
              x="26"
              y="2"
              width="278"
              height="69"
            >
              <rect width="278" height="69" transform="matrix(1 0 0 -1 26 71)" fill="#D9D9D9" />
            </mask>

            <g mask="url(#mask0_102_4115)">
              <g filter="url(#filter0_f_102_4115)">
                <ellipse
                  cx="90.8278"
                  cy="31.6585"
                  rx="90.8278"
                  ry="31.6585"
                  transform="matrix(1 0 0 -1 73.9736 13.5121)"
                  fill="#F47BFF"
                  fillOpacity="0.41"
                />
              </g>
            </g>

            <defs>
              <filter
                id="filter0_f_102_4115"
                x="28.9736"
                y="-94.8049"
                width="271.656"
                height="153.317"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="22.5" result="effect1_foregroundBlur_102_4115" />
              </filter>

              <linearGradient
                id="paint0_linear_102_4115"
                x1="96.8684"
                y1="1"
                x2="96.8684"
                y2="78.4234"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#C6AA73" />
                <stop offset="1" stopColor="#605238" stopOpacity="0.64" />
              </linearGradient>

              <linearGradient
                id="paint1_linear_102_4115"
                x1="260.596"
                y1="1"
                x2="260.596"
                y2="78.4234"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#C6AA73" />
                <stop offset="1" stopColor="#504228" stopOpacity="0.81" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative z-10 pt-8 pb-4 w-full h-full text-center flex flex-col items-center justify-center gap-4 lg:gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
