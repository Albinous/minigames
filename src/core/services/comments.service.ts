import type { Store } from '../state';
import type { CommentsSortOption } from '../types';
import type { CommentsApi } from './api';

export class CommentsService {
  private readonly store: Store;
  private readonly api: CommentsApi;

  constructor(store: Store, commentsApi: CommentsApi) {
    this.store = store;
    this.api = commentsApi;
  }

  public async loadComments(slug: string, sort?: CommentsSortOption): Promise<void> {
    this.store.comments.isLoading = true;
    this.store.games.error = undefined;

    try {
      const response = await this.api.getComments(slug, sort);

      this.store.comments.data = response;
    } catch {
      this.store.comments.error = 'Failed to load comments';
    } finally {
      this.store.comments.isLoading = false;
    }
  }
}
