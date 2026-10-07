import type { AuthMode } from '../../components/dialogs/auth/auth-dialog.types';

export function updateUrl(updates: Record<string, string | number | undefined>): void {
  const parameters = new URLSearchParams(globalThis.location.search);

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) {
      parameters.delete(key);
    } else {
      parameters.set(key, String(value));
    }
  }

  if (parameters.get('page') === '1') {
    parameters.delete('page');
  }

  const search = parameters.toString();

  const url = search ? `/library?${search}` : '/library';

  globalThis.history.pushState({}, '', url);
}

export function updateUrlAuth(pathname: string, auth: AuthMode | undefined) {
  const parameters = new URLSearchParams(globalThis.location.search);

  if (auth === undefined) {
    parameters.delete('auth');
  } else {
    parameters.set('auth', auth);
  }

  const search = parameters.toString();

  const url = search ? `${pathname}?${search}` : `${pathname}`;

  globalThis.history.pushState({}, '', url);
}
