const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'always',
});

export function formatRelativeDate(date: string): string {
  const differenceInSeconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000,
  );

  const days = Math.floor(differenceInSeconds / 86_400);

  if (days >= 1) {
    return relativeTimeFormatter.format(-days, 'day');
  }

  const hours = Math.floor(differenceInSeconds / 3600);

  if (hours >= 1) {
    return relativeTimeFormatter.format(-hours, 'hour');
  }

  const minutes = Math.floor(differenceInSeconds / 60);

  return relativeTimeFormatter.format(-minutes, 'minute');
}