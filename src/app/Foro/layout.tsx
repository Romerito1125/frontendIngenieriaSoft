//Zuluaga

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function ForoLayout({ children }: LayoutProps) {
  return (
    <div>
      {children}
    </div>
  );
}
