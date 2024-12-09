import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private initialAuthCheckDone = false;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      console.log('Auth state changed:', user ? user.uid : 'No user');
      this.userSubject.next(user);
      if (!this.initialAuthCheckDone) {
        this.initialAuthCheckDone = true;
        if (user) {
          console.log('Initial auth check: User is logged in, navigating to /welcome');
          this.router.navigate(['/welcome']);
        } else {
          console.log('Initial auth check: No user, navigating to /auth');
          this.router.navigate(['/auth']);
        }
      }
    });
  }

  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  async register(email: string, password: string, nombre: string, apellidos: string, telefono: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      await this.setUserData(user, { nombre, apellidos, telefono });
      this.userSubject.next(user);
      console.log('User registered successfully');
      return user;
    } catch (e) {
      console.error('Registration error:', e);
      throw e;
    }
  }

  private async setUserData(user: User, additionalData: { nombre: string, apellidos: string, telefono: string }) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      ...additionalData
    };
    await setDoc(userRef, userData, { merge: true });
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.userSubject.next(userCredential.user);
      console.log('User logged in successfully');
      return userCredential.user;
    } catch (e) {
      console.error('Login error:', e);
      throw e;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.userSubject.next(null);
      console.log('User logged out successfully');
      this.router.navigate(['/auth'], { queryParams: { mode: 'login' } });
    } catch (e) {
      console.error('Logout error:', e);
    }
  }
}
