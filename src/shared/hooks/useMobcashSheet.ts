import { useEffect, useRef } from 'react';
import { useAppStore } from '@/shared/store';
import { parseSheetCsv } from '@/shared/lib/mobcash';
import { showWarning } from '@/shared/lib/toast';

const SHEET_URL = import.meta.env.VITE_MOBCASH_SHEET_CSV_URL as string | undefined;

let envWarnLogged = false;

export const useMobcashSheet = () => {
  const mobcashLoaded = useAppStore((s) => s.mobcashLoaded);
  const setMobcashEntries = useAppStore((s) => s.setMobcashEntries);
  const setMobcashLoaded = useAppStore((s) => s.setMobcashLoaded);
  const setMobcashError = useAppStore((s) => s.setMobcashError);

  const startedRef = useRef(false);

  useEffect(() => {
    if (mobcashLoaded || startedRef.current) return;

    if (!SHEET_URL) {
      if (!envWarnLogged) {
        console.warn(
          '[mobcash] VITE_MOBCASH_SHEET_CSV_URL is not set — CITY/STREET overlay will be disabled',
        );
        envWarnLogged = true;
      }
      setMobcashLoaded(true);
      return;
    }

    startedRef.current = true;

    fetch(SHEET_URL, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        setMobcashEntries(parseSheetCsv(text));
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : String(e);
        setMobcashError(msg);
        showWarning('Mobcash sheet недоступен — баннеры рендерятся без CITY/STREET');
      })
      .finally(() => {
        setMobcashLoaded(true);
      });
  }, [mobcashLoaded, setMobcashEntries, setMobcashLoaded, setMobcashError]);
};
