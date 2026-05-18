import type { EventCopiesMap, EventCopy } from './types';

export const getEventCopy = (
  language: string | null | undefined,
  entries: EventCopiesMap,
): EventCopy | null => {
  if (!language) return null;
  const key = language.trim().toLowerCase();
  return entries[key] ?? null;
};
