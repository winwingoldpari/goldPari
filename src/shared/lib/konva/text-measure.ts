export const measureTextWidth = (
  text: string,
  fontSize: number,
  fontWeight: string = '800',
  fontFamily: string = 'Montserrat',
): number => {
  if (typeof document === 'undefined' || !text) return 0;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
};
