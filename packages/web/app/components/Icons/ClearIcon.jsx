import React from 'react';

export const ClearIcon = React.memo(({ ...props }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.8125 0.1875C9.5625 -0.0624999 9.1875 -0.0624999 8.9375 0.1875L5 4.125L1.0625 0.1875C0.8125 -0.0624999 0.4375 -0.0624999 0.1875 0.1875C-0.0624999 0.4375 -0.0624999 0.8125 0.1875 1.0625L4.125 5L0.1875 8.9375C-0.0624999 9.1875 -0.0624999 9.5625 0.1875 9.8125C0.3125 9.9375 0.4375 10 0.625 10C0.8125 10 0.9375 9.9375 1.0625 9.8125L5 5.875L8.9375 9.8125C9.0625 9.9375 9.25 10 9.375 10C9.5 10 9.6875 9.9375 9.8125 9.8125C10.0625 9.5625 10.0625 9.1875 9.8125 8.9375L5.875 5L9.8125 1.0625C10.0625 0.8125 10.0625 0.4375 9.8125 0.1875Z"
      fill="#666666"
    />
  </svg>
));
