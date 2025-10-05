import type { SVGProps } from 'react';

export function MeaCodeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#64B5F6" />
          <stop offset="100%" stopColor="#9575CD" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L4 6.5V15.5L12 20L20 15.5V6.5L12 2Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M9.5 8.5L6.5 11.5L9.5 14.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 8.5L17.5 11.5L14.5 14.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
