import type { SVGProps } from 'react';

export function MeaCoreLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.25 10.25.75 12l6.5 1.75L9 21.25l1.75-6.5L17.25 13l-6.5-1.75L9 3.75 7.25 10.25Z" fill="hsl(var(--primary))" stroke="hsl(var(--primary))"></path>
      <path d="m16.5 2.5-3 3" stroke="hsl(var(--ring))"></path>
      <path d="M21.5 7.5_3-3" stroke="hsl(var(--ring))"></path>
      <path d="m14 10 3 3" stroke="hsl(var(--ring))"></path>
    </svg>
  );
}
