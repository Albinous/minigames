const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'always',
});

export function formatRelativeDate(date: string): string {
  const differenceInSeconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  const minutes = Math.floor(differenceInSeconds / 60);

  if (minutes < 60) {
    return relativeTimeFormatter.format(-minutes, 'minute');
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return relativeTimeFormatter.format(-hours, 'hour');
  }

  const days = Math.floor(differenceInSeconds / 86_400);

  if (days < 7) {
    return relativeTimeFormatter.format(-days, 'day');
  }

  const weeks = Math.floor(days / 7);

  if (days < 30) {
    return relativeTimeFormatter.format(-weeks, 'week');
  }

  const months = Math.floor(days / 30);

  return relativeTimeFormatter.format(-months, 'month');
}
