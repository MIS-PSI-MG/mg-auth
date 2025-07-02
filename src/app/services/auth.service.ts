import { inject, Injectable, signal, effect } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(Auth);
  private firestore = inject(Firestore);

  /** Firebase auth user$ */
  private user$ = user(this.firebaseAuth);

  /** Signal storing our app-level user with role */
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  constructor() {
    // ✅ React to Firebase user changes and fetch role
    this.user$.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(this.firestore, 'users', firebaseUser.uid);
        const snapshot = await getDoc(userRef);
        const data = snapshot.data();

        if (data) {
          const fullUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            username: firebaseUser.displayName ?? '',
            role: data['role'] ?? 'user',
          };

          console.log('[AuthService] User loaded from Firestore:', fullUser);
          this.currentUserSig.set(fullUser);
        } else {
          console.log('[AuthService] No user document found');
          this.currentUserSig.set(null);
        }
      } else {
        console.log('[AuthService] Firebase user is null');
        this.currentUserSig.set(null);
      }
    });
  }

  /** Register user and store role in Firestore */
  register(
    email: string,
    password: string,
    username: string,
    role: 'admin' | 'user' = 'user'
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(async (response) => {
      await updateProfile(response.user, { displayName: username });

      const userRef = doc(this.firestore, 'users', response.user.uid);
      await setDoc(userRef, {
        email,
        username,
        role,
      });
    });

    return from(promise);
  }

  /** Login (role will be loaded by user$ subscription) */
  login(email: string, password: string): Observable<void> {
    return from(
      signInWithEmailAndPassword(this.firebaseAuth, email, password).then(
        () => {}
      )
    );
  }

  logout(): Observable<void> {
    this.currentUserSig.set(null);
    return from(this.firebaseAuth.signOut());
  }

  /** Optional getter for role */
  get role(): 'admin' | 'user' | null {
    const user = this.currentUserSig();
    return user ? user.role : null;
  }
}
