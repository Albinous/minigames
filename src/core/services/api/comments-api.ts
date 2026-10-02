import { GAMES_BASE_URL } from '../../constants';
import type { CommentsResponse, CommentsSortOption } from '../../types';
import { Api } from './api';

const LIMIT_COMMENTS = 3;
const COMMENTS_BASE_URL = '/comments';

export class CommentsApi extends Api {
  public async getComments(
    gameSlug: string,
    sort: CommentsSortOption = 'newest',
  ): Promise<CommentsResponse> {
    const parameters = new URLSearchParams({
      limit: String(LIMIT_COMMENTS),
      sort,
    });

    return this.get(`${GAMES_BASE_URL}/${gameSlug}/${COMMENTS_BASE_URL}?${parameters.toString()}`);
  }
}
