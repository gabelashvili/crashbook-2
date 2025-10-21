const SoundIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
    >
      <path
        d="M0.75 6.87549H3.75L7.5 3.87549V14.3755L3.75 11.3755H0.75V6.87549Z"
        strokeLinecap="round"
      />
      <path
        d="M14.7765 3C15.5426 3.76608 16.1503 4.67556 16.5649 5.67649C16.9795 6.67743 17.1929 7.75023 17.1929 8.83363C17.1929 9.91704 16.9795 10.9898 16.5649 11.9908C16.1503 12.9917 15.5426 13.9012 14.7765 14.6673"
        strokeLinecap="round"
      />
      <path
        d="M11.5763 5.85242C11.9941 6.27028 12.3256 6.76636 12.5517 7.31232C12.7779 7.85829 12.8943 8.44345 12.8943 9.0344C12.8943 9.62535 12.7779 10.2105 12.5517 10.7565C12.3256 11.3024 11.9941 11.7985 11.5763 12.2164"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SoundIcon;
