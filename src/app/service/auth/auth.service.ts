import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserBackendModel } from '../../_model/user.model';

// https://www.positronx.io/ionic-firebase-authentication-tutorial-with-examples/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: UserBackendModel;
  private $userDataAsObservable: BehaviorSubject<UserBackendModel> = new BehaviorSubject<UserBackendModel>(null);

  constructor(
    private afStore: AngularFirestore,
    private ngFireAuth: AngularFireAuth,
    private router: Router
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        this.$userDataAsObservable.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user'));
        this.router.navigateByUrl('today');
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null);
  }

  get user(): UserBackendModel {
    return this.userData;
  }

  public signIn(user: { email: string, password: string }) {
    return this.ngFireAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  public registerUser(user: { email: string, password: string }) {
    return this.ngFireAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  public passwordRecover(passwordResetEmail: string) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  public userDataAsObservable(): Observable<UserBackendModel> {
    if (!this.$userDataAsObservable.value) {
      console.warn('event.$userDataAsObservable is not defined');
    }

    return this.$userDataAsObservable.asObservable();
  }

  public async signOut() {
    this.$userDataAsObservable.next(null);
    await this.ngFireAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['sign/in']);
  }
}
