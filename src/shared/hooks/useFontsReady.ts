import { useEffect, useState } from 'react';

export const useFontsReady = () => {
  const [ready, setReady] = useState<boolean>(() => {
    if (typeof document === 'undefined') return true;
    return document.fonts?.status === 'loaded';
  });

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
};
