export const capitalizeWords = (str: string) =>
  str.replaceAll(/\b\w/g, (char: string) => char.toUpperCase());

export const capitalizeFirst = (str: string): string => {
  if (!str) return '';
  const [first, ...rest] = str.trim();
  return first.toLocaleUpperCase() + rest.join('');
};

export const fmtArabic = new Intl.NumberFormat('ar-EG', {
  useGrouping: true,
  maximumFractionDigits: 2
});
