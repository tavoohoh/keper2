import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {
  MemberModel,
  SimpleResponseModel,
  UserDbModel
} from '../../_model';
import {AuthService} from '../auth/auth.service';
import {CoreGroupService} from './group.service';
import {environment} from '../../../environments/environment';

const API_URL = `${environment.api}users`;
const API_MEMBERS_URL = `${environment.api}members`;

@Injectable({
  providedIn: 'root'
})
export class CoreUserService {

  constructor(
    private groupService: CoreGroupService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  public listMembers(): Observable<Array<MemberModel>> {
    const groupUid = this.groupService.group.uid;

    return this.http.get<Array<MemberModel>>(API_MEMBERS_URL, {
      headers: this.authService.getBasicAuthHeaders(),
      params: new HttpParams().set('groupId', groupUid)
    });
  }

  public addMember(userId: string): Observable<SimpleResponseModel> {
    const groupId = this.groupService.group.uid;

    return this.http.put<SimpleResponseModel>(API_MEMBERS_URL, {
      groupId, userId
    }, {
      headers: this.authService.getBasicAuthHeaders()
    });
  }

  public removeMember(userId: string): Observable<SimpleResponseModel> {
    const groupId = this.groupService.group.uid;

    return this.http.post<SimpleResponseModel>(API_MEMBERS_URL, {
      groupId, userId
    }, {
      headers: this.authService.getBasicAuthHeaders()
    });
  }

  public create(user: UserDbModel): Observable<SimpleResponseModel> {
    return this.http.post<SimpleResponseModel>(API_URL, user, {
      headers: this.authService.getBasicAuthHeaders()
    });
  }

  public update(user: UserDbModel): Observable<SimpleResponseModel> {
    return this.http.put<SimpleResponseModel>(API_URL, user, {
      headers: this.authService.getBasicAuthHeaders()
    });
  }

  public delete(userId: string): Observable<SimpleResponseModel> {
    return this.http.delete<SimpleResponseModel>(API_URL, {
      headers: this.authService.getBasicAuthHeaders(),
      params: new HttpParams().set('uid', userId)
    });
  }

  public get(userId: string): Observable<SimpleResponseModel> {
    return this.http.get<SimpleResponseModel>(API_URL, {
      headers: this.authService.getBasicAuthHeaders(),
      params: new HttpParams().set('uid', userId)
    });
  }

  public getByEmail(email: string): Observable<UserDbModel> {
    return this.http.get<UserDbModel>(API_URL, {
      headers: this.authService.getBasicAuthHeaders(),
      params: new HttpParams().set('email', email)
    });
  }

}
