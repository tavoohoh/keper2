import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserBackendModel } from '../../_model/user.model';
import { User } from 'firebase';

// https://www.positronx.io/ionic-firebase-authentication-tutorial-with-examples/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: User;
  private $userDataAsObservable: BehaviorSubject<UserBackendModel> = new BehaviorSubject<UserBackendModel>(null);

  constructor(
    private afStore: AngularFirestore,
    private ngFireAuth: AngularFireAuth,
    private router: Router
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        this.$userDataAsObservable.next(user as UserBackendModel);
        localStorage.setItem('user', JSON.stringify(user as UserBackendModel));
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

  get user(): User {
    return this.userData;
  }

  public signIn(user: { email: string, password: string }): Promise<any>  {
    return this.ngFireAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  public registerUser(user: { email: string, password: string }): Promise<any>  {
    return this.ngFireAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  public updateUserProfile(user: User, name: string): Promise<any>  {
    return user.updateProfile({
      displayName: name
    });
  }

  public changeUserEmail(user: User, email: string): Promise<any>  {
    return user.updateEmail(email);
  }

  public changeUserPassword(user: User, password: string): Promise<any>  {
    return user.updatePassword(password);
  }

  public passwordRecover(passwordResetEmail: string): Promise<any> {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  public userDataAsObservable(): Observable<UserBackendModel> {
    if (!this.$userDataAsObservable.value) {
      console.warn('event.$userDataAsObservable is not defined');
    }

    return this.$userDataAsObservable.asObservable();
  }

  public async signOut(): Promise<void> {
    this.$userDataAsObservable.next(null);
    await this.ngFireAuth.signOut();
    localStorage.removeItem('user');
    await this.router.navigate(['']);
  }
}
