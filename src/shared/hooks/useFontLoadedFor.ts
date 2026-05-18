import { useEffect, useState } from 'react';

export const useFontLoadedFor = (family: string, sample: string) => {
  const [loaded, setLoaded] = useState<boolean>(() => {
    if (typeof document === 'undefined' || !document.fonts) return true;
    return document.fonts.check(`16px "${family}"`, sample);
  });

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) {
      setLoaded(true);
      return;
    }
    if (document.fonts.check(`16px "${family}"`, sample)) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    let cancelled = false;
    document.fonts.load(`16px "${family}"`, sample).then(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [family, sample]);

  return loaded;
};
