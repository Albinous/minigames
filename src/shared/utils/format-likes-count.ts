export function formatLikesCount(likes: number): string {
  return `${Math.trunc(likes / 100) / 10}K`;
}
