import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_BASE_URL, GAMES_BASE_URL } from '../../constants';
import type { CommentsSortOption } from '../../types';
import { CommentsApi } from './comments-api';

const stubFetch = () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

// Достаёт адрес первого запроса
const getRequestedUrl = (fetchMock: ReturnType<typeof stubFetch>): URL =>
  new URL(String(fetchMock.mock.calls[0][0]));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('CommentsApi.getComments', () => {
  it('requests comments of the given game with the default sort and a limit', async () => {
    const fetchMock = stubFetch();

    await new CommentsApi().getComments('tiny-glade');

    const url = getRequestedUrl(fetchMock);

    expect(url.href.startsWith(`${API_BASE_URL}${GAMES_BASE_URL}/tiny-glade/`)).toBe(true);
    expect(url.pathname.endsWith('comments')).toBe(true);
    expect(url.searchParams.get('limit')).toBe('3');
    expect(url.searchParams.get('sort')).toBe('newest');
  });

  it('uses the requested sort option', async () => {
    const fetchMock = stubFetch();
    const sort = 'oldest' as unknown as CommentsSortOption;

    await new CommentsApi().getComments('tiny-glade', sort);

    expect(getRequestedUrl(fetchMock).searchParams.get('sort')).toBe('oldest');
  });
});
