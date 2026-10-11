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

  public async submitComment(slug: string, text: string): Promise<void> {
    const session = this.store.session;

    if (!session) throw new Error('Authentication is required');

    await this.api.postComment(slug, {
      userEmail: session.email,
      authorName: toAuthorName(session.displayName),
      text,
    });
    await this.loadComments(slug);
  }

  public async toggleLike(commentId: string): Promise<void> {
    const email = this.store.session?.email;

    if (!email) throw new Error('Authentication is required');

    const response = await this.api.toggleLike(commentId, email);
    const comment = this.store.comments.data?.data.find((item) => item.commentId === commentId);

    if (comment) {
      comment.isLikedByCurrentUser = response.data.isLikedByCurrentUser;
      comment.likesCount = response.data.likesCount;
    }
  }
}
