import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
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
    private router: Router,
    private ngZone: NgZone,
    private toastController: ToastController
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

  public signIn(user: { email: string, password: string }) {
    return this.ngFireAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  public registerUser(user: { email: string, password: string }) {
    return this.ngFireAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  public async passwordRecover(passwordResetEmail: string) {
    try {
      await this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail);
      const toast = await this.toastController.create({
        message: 'Credentials are invalid',
        duration: 3000,
        position: 'top',
        color: 'success'
      });
      toast.present();
    }
    catch (error) {
      this.errorToast(error.message || error);
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null);
  }

  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false);
  }

  get user(): UserBackendModel {
    return this.userData;
  }

  public userDataAsObservable(): Observable<UserBackendModel> {
    if (!this.$userDataAsObservable.value) {
      console.warn('event.$userDataAsObservable is not defined');
    }

    return this.$userDataAsObservable.asObservable();
  }

  public googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  public async authLogin(provider: auth.AuthProvider) {
    try {
      const result = await this.ngFireAuth.signInWithPopup(provider);
      this.ngZone.run(() => {
        this.router.navigate(['tabs']);
      });
      this.setUserData(result.user);
    }
    catch (error) {
      this.errorToast(error.message || error);
    }
  }

  public setUserData(userData: UserBackendModel) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${userData.uid}`);

    return userRef.set(userData, {
      merge: true
    });
  }

  public async signOut() {
    this.$userDataAsObservable.next(null);
    await this.ngFireAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  private async errorToast(message: string) {
    const toast = await this.toastController.create({
      message: 'Credentials are invalid',
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    toast.present();
  }

}
