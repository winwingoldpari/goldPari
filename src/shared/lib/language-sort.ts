const PRIORITY = ['english', 'french'];

export function sortLanguageOptions<T extends { label: string }>(options: ReadonlyArray<T>): T[] {
  return [...options].sort((a, b) => {
    const aPriority = PRIORITY.indexOf(a.label.toLowerCase());
    const bPriority = PRIORITY.indexOf(b.label.toLowerCase());
    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    return a.label.localeCompare(b.label);
  });
}
