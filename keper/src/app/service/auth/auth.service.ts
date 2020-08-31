import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import {UserDbModel, UserModel} from '../../_model';
import {User as FirebaseUser} from 'firebase';
import {environment} from '../../../environments/environment';

const API_URL = `${environment.api}users`;

// https://www.positronx.io/ionic-firebase-authentication-tutorial-with-examples/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public $user: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(null);
  public $firebaseUser: BehaviorSubject<FirebaseUser> = new BehaviorSubject<FirebaseUser>(null);
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private afStore: AngularFirestore,
    private ngFireAuth: AngularFireAuth,
    private router: Router,
    private http: HttpClient
  ) {
    this.ngFireAuth.authState.subscribe(async (firebaseUser: FirebaseUser) => {
      if (firebaseUser) {
        const userToken = await firebaseUser.getIdToken();
        const userDb = await this.getUserDb(userToken).toPromise();
        const user = new UserModel(firebaseUser, userToken, userDb.uid);
        this.$user.next(user);
        this.$firebaseUser.next(firebaseUser);
        localStorage.setItem('user', JSON.stringify(user));
        await this.router.navigateByUrl('today');
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  get userValue(): UserModel {
    return this.$user.value;
  }

  get firebaseUserValue(): FirebaseUser {
    return this.$firebaseUser.value;
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null);
  }

  public signIn(user: { email: string, password: string }): Promise<any>  {
    return this.ngFireAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  public registerUser(user: { email: string, password: string }): Observable<any>  {
    return this.http.post(API_URL, user, {headers: this.headers});
  }

  public updateUserProfile(user: FirebaseUser, name: string): Promise<any>  {
    return user.updateProfile({
      displayName: name
    });
  }

  public changeUserEmail(user: FirebaseUser, email: string): Promise<any>  {
    return user.updateEmail(email);
  }

  public changeUserPassword(user: FirebaseUser, password: string): Promise<any>  {
    return user.updatePassword(password);
  }

  public passwordRecover(passwordResetEmail: string): Promise<any> {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  public userDataAsObservable(): Observable<UserModel> {
    if (!this.$user.value && !this.isLoggedIn) {
      this.signOut();
    }

    return this.$user.asObservable();
  }

  public async signOut(): Promise<void> {
    this.$user.next(null);
    await this.ngFireAuth.signOut();
    localStorage.removeItem('user');
    await this.router.navigate(['']);
  }

  public getUserDb(token = null): Observable<UserDbModel> {
    return this.http.get<UserDbModel>(
      API_URL,
      {
        headers: this.getBasicAuthHeaders(token)
      });
  }

  public getBasicAuthHeaders(userToken = null): HttpHeaders {
    const user: UserModel = this.userValue || null;

    if (!userToken && !user) {
      throwError('No token was provided. At `authService.getBasicAuthHeaders`');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken || user.token}`
    });
  }
}
