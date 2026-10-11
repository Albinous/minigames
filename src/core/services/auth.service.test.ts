import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { auth } from '../firebase/firebase';
import { AuthService } from './auth.service';

vi.mock('../firebase/firebase', () => ({ auth: { name: 'test-auth' } }));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  GoogleAuthProvider: class GoogleAuthProvider {},
}));

const firebaseUser = {
  uid: 'u1',
  email: 'alex@mail.com',
  displayName: 'Alex',
  photoURL: undefined,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthService.login', () => {
  it('signs in with email and password and maps the user', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({ user: firebaseUser } as never);

    const user = await new AuthService().login('alex@mail.com', 'Abc123!');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'alex@mail.com', 'Abc123!');
    expect(user).toEqual({
      uid: 'u1',
      email: 'alex@mail.com',
      displayName: 'Alex',
      photoURL: undefined,
    });
  });

  it('passes firebase errors to the caller', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(new Error('bad credentials'));

    await expect(new AuthService().login('a@b.com', 'x')).rejects.toThrow('bad credentials');
  });
});

describe('AuthService.register', () => {
  it('creates the account and then saves the username', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: firebaseUser } as never);
    vi.mocked(updateProfile).mockResolvedValue();

    const user = await new AuthService().register('Alex', 'alex@mail.com', 'Abc123!');

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'alex@mail.com', 'Abc123!');
    expect(updateProfile).toHaveBeenCalledWith(firebaseUser, { displayName: 'Alex' });
    expect(vi.mocked(createUserWithEmailAndPassword).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(updateProfile).mock.invocationCallOrder[0],
    );
    expect(user.uid).toBe('u1');
  });

  it('does not touch the profile when account creation fails', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(new Error('email in use'));

    await expect(new AuthService().register('Alex', 'a@b.com', 'x')).rejects.toThrow(
      'email in use',
    );
    expect(updateProfile).not.toHaveBeenCalled();
  });
});

describe('AuthService.loginWithGoogle', () => {
  it('opens the google popup and maps the user with the photo', async () => {
    vi.mocked(signInWithPopup).mockResolvedValue({
      user: { ...firebaseUser, photoURL: 'https://example.com/a.png' },
    } as never);

    const user = await new AuthService().loginWithGoogle();

    expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
    expect(user.photoURL).toBe('https://example.com/a.png');
  });

  it('passes popup errors to the caller', async () => {
    vi.mocked(signInWithPopup).mockRejectedValue(new Error('popup closed'));

    await expect(new AuthService().loginWithGoogle()).rejects.toThrow('popup closed');
  });
});

describe('AuthService.signOut', () => {
  it('signs out from firebase', async () => {
    vi.mocked(signOut).mockResolvedValue();

    await new AuthService().signOut();

    expect(signOut).toHaveBeenCalledWith(auth);
  });

  it('passes sign out errors to the caller', async () => {
    vi.mocked(signOut).mockRejectedValue(new Error('offline'));

    await expect(new AuthService().signOut()).rejects.toThrow('offline');
  });
});