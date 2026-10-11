import { GAMES_BASE_URL } from '../../constants';
import type { CommentsResponse, CommentsSortOption } from '../../types';
import { Api } from './api';

const LIMIT_COMMENTS = 3;
const COMMENTS_BASE_URL = '/comments';

export interface NewComment {
  userEmail: string;
  authorName: string;
  text: string;
}

export interface LikeResponse {
  data: { isLikedByCurrentUser: boolean; likesCount: number };
}

export class CommentsApi extends Api {
  public async getComments(
    gameSlug: string,
    sort: CommentsSortOption = 'newest',
    userEmail?: string,
  ): Promise<CommentsResponse> {
    const parameters = new URLSearchParams({
      limit: String(LIMIT_COMMENTS),
      sort,
    });

    if (userEmail !== undefined) {
      parameters.set('userEmail', userEmail);
    }

    return this.get(`${GAMES_BASE_URL}/${gameSlug}${COMMENTS_BASE_URL}?${parameters.toString()}`);
  }

  public async postComment(gameSlug: string, comment: NewComment): Promise<unknown> {
    return this.post(`${GAMES_BASE_URL}/${gameSlug}${COMMENTS_BASE_URL}`, comment);
  }

  public async toggleLike(commentId: string, userEmail: string): Promise<LikeResponse> {
    return this.post(`${COMMENTS_BASE_URL}/${encodeURIComponent(commentId)}/like`, { userEmail });
  }
}
