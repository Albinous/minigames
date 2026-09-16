export function formatLikesCount(likes: number): number {
  return (Math.trunc(likes / 100)) / 10;
}