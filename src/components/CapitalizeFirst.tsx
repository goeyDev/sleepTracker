// components/CapitalizeFirst.tsx
'use client';

import { ReactNode } from 'react';

type CapitalizeFirstProps = {
  children: ReactNode;
  className?: string;
  eachWord?: boolean;
};

export default function CapitalizeFirst({
  children,
  className,
  eachWord = true
}: CapitalizeFirstProps) {
  const capitalize = (str: string) => {
    if (eachWord) {
      return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (typeof children !== 'string') {
    return <span className={className}>{children}</span>;
  }

  return <span className={className}>{capitalize(children)}</span>;
}