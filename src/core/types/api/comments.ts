import type { IComment } from "../../services";

export interface CommentsResponse {
  items: IComment[],
  meta: CommentsMeta
}

export interface CommentsMeta {
  totalItems: number,
  returnedCount: number
}

export type CommentsSortOption = 'newest' | 'oldest';