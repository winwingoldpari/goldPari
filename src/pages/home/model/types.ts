export type Mode = 'casino' | 'sport' | 'universal';

export const MODES: readonly Mode[] = ['universal', 'casino', 'sport'] as const;

export const MODE_LABELS: Record<Mode, string> = {
  universal: 'Universal',
  casino: 'Casino',
  sport: 'Sport',
};

export const isMode = (value: unknown): value is Mode =>
  typeof value === 'string' && (MODES as readonly string[]).includes(value);
