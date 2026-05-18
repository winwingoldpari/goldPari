export const EVENTS_CATEGORY_NAME = 'events';

export const isEventsCategory = (categoryTitle?: string | null): boolean =>
  (categoryTitle?.trim().toLowerCase() ?? '') === EVENTS_CATEGORY_NAME;
