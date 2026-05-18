import { useEffect, useState, type RefObject } from 'react';

export const useStageWidth = (containerRef: RefObject<HTMLElement | null>, initial = 400) => {
  const [stageWidth, setStageWidth] = useState(initial);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const setIfChanged = (next: number) => {
      setStageWidth((prev) => (prev !== next ? next : prev));
    };

    setIfChanged(el.offsetWidth);

    let raf = 0;
    const schedule = (next: number) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIfChanged(next));
    };

    let ro: ResizeObserver | null = null;
    const hasWindow = typeof window !== 'undefined';
    if (hasWindow && 'ResizeObserver' in window) {
      ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        const width = Math.round(entry.contentRect.width);
        schedule(width);
      });
      ro.observe(el);
    } else if (hasWindow) {
      const onResize = () => setIfChanged(el.offsetWidth);
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
      };
    } else {
      return;
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [containerRef]);

  return stageWidth;
};
