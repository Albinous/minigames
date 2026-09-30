import type { IComment } from "../../services";

export interface CommentsResponse {
  items: IComment[],
  meta: CommentsMeta
}

export interface CommentsMeta {
  totalComments: number,
  returnedCount: number
}

export type CommentsSortOption = 'newest' | 'oldest';