import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isMode, type Mode } from './types';

const PARAM = 'mode';
const DEFAULT_MODES: Mode[] = ['casino'];

export const useHomeModes = (): { modes: Mode[]; setModes: (next: Mode[]) => void } => {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.getAll(PARAM);
  const filtered = raw.filter(isMode) as Mode[];
  const hasModeKey = raw.length > 0;
  const modes: Mode[] = filtered.length > 0 ? filtered : hasModeKey ? [] : DEFAULT_MODES;

  const setModes = useCallback(
    (next: Mode[]) => {
      const params = new URLSearchParams(searchParams);
      params.delete(PARAM);
      if (next.length === 0) {
        params.set(PARAM, '');
      } else {
        next.forEach((m) => params.append(PARAM, m));
      }
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  return { modes, setModes };
};
