import type { ILeaderboard } from "../../services";
import type { ListMeta } from "../meta";

export interface LeaderboardResponse {
  items: ILeaderboard[];
  meta: ListMeta
}
