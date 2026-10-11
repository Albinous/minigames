import type { Store } from '../state';
import type { CommentsSortOption } from '../types';
import type { CommentsApi } from './api';

const MIN_AUTHOR_LENGTH = 2;
const MAX_AUTHOR_LENGTH = 30;
const FALLBACK_AUTHOR = 'Player';

const toAuthorName = (displayName: string): string => {
  const name = displayName.trim().slice(0, MAX_AUTHOR_LENGTH);

  return name.length >= MIN_AUTHOR_LENGTH ? name : FALLBACK_AUTHOR;
};

export class CommentsService {
  private readonly store: Store;
  private readonly api: CommentsApi;

  constructor(store: Store, commentsApi: CommentsApi) {
    this.store = store;
    this.api = commentsApi;
  }

  public async loadComments(slug: string, sort?: CommentsSortOption): Promise<void> {
    this.store.comments.isLoading = true;
    this.store.comments.error = undefined;

    try {
      const response = await this.api.getComments(slug, sort, this.store.session?.email);
      
      this.store.comments.data = response;
    } catch {
      this.store.comments.error = 'Failed to load comments';
    } finally {
      this.store.comments.isLoading = false;
    }
  }
}
