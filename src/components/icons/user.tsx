const UserIcon = ({ className }: { className?: string }) => {
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
        d="M2.25 16.125L2.29047 15.8648C2.49905 14.5239 3.37303 13.3704 4.68047 13.007C5.83841 12.6852 7.37578 12.375 9 12.375C10.6242 12.375 12.1616 12.6852 13.3195 13.007C14.627 13.3704 15.5009 14.5239 15.7095 15.8648L15.75 16.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UserIcon;
