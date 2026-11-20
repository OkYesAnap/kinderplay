'use client';

import { useEffect, useRef } from 'react';
import { preloadAllSprites } from '../utils/spriteCache';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      preloadAllSprites();
    }
  }, []);

  return <>{children}</>;
}
