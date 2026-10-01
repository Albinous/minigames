import type { IComment } from '../../services';

export interface CommentsResponse {
  data: IComment[];
  meta: CommentsMeta | undefined;
}

export interface CommentsMeta {
  totalComments: number;
  returnedCount: number;
}

export type CommentsSortOption = 'newest' | 'oldest';
