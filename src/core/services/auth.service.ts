import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User,
} from 'firebase/auth';
import type { AuthUser } from '../types';
import { auth } from '../firebase/firebase';

const toAuthUser = (user: User): AuthUser => {
  const authUser = {
    uid: user.uid,
    email: user.email ?? undefined,
    displayName: user.displayName ?? undefined,
    photoURL: user.photoURL ?? undefined,
  };

  return authUser;
};

export class AuthService {
  public async login(email: string, password: string): Promise<AuthUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    return toAuthUser(credential.user);
  }

  public async register(username: string, email: string, password: string): Promise<AuthUser> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: username });

    return toAuthUser(credential.user);
  }
}
