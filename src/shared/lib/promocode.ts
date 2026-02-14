export const parsePromocodes = (input: string): string[] =>
  input
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean);
