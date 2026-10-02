import type { ILeaderboard } from '../../services';
import type { ListMeta } from '../meta';

export interface LeaderboardResponse {
  data: ILeaderboard[];
  meta: ListMeta | undefined;
}
