import { useEffect, useRef } from 'react';
import { useAppStore } from '@/shared/store';
import { parseEventCopySheetCsv } from '@/shared/lib/event-i18n';
import { showWarning } from '@/shared/lib/toast';

const SHEET_URL = import.meta.env.VITE_EVENT_I18N_SHEET_CSV_URL as string | undefined;

let envWarnLogged = false;

export const useEventCopiesSheet = () => {
  const eventCopiesLoaded = useAppStore((s) => s.eventCopiesLoaded);
  const setEventCopies = useAppStore((s) => s.setEventCopies);
  const setEventCopiesLoaded = useAppStore((s) => s.setEventCopiesLoaded);
  const setEventCopiesError = useAppStore((s) => s.setEventCopiesError);

  const startedRef = useRef(false);

  useEffect(() => {
    if (eventCopiesLoaded || startedRef.current) return;

    if (!SHEET_URL) {
      if (!envWarnLogged) {
        console.warn(
          '[event-i18n] VITE_EVENT_I18N_SHEET_CSV_URL is not set — events overlay translations will be unavailable',
        );
        envWarnLogged = true;
      }
      setEventCopiesLoaded(true);
      return;
    }

    startedRef.current = true;

    fetch(SHEET_URL, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        setEventCopies(parseEventCopySheetCsv(text));
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : String(e);
        setEventCopiesError(msg);
        showWarning('Events sheet недоступен — баннеры рендерятся без перевода');
      })
      .finally(() => {
        setEventCopiesLoaded(true);
      });
  }, [eventCopiesLoaded, setEventCopies, setEventCopiesLoaded, setEventCopiesError]);
};
