import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {TaskFormResponse, MemberModel} from '../../_model';
import {AuthService} from '../auth/auth.service';
import {CoreGroupService} from './group.service';
import {environment} from '../../../environments/environment';

const API_URL = `${environment.api}members`;

@Injectable({
  providedIn: 'root'
})
export class CoreMemberService {

  constructor(
    private authService: AuthService,
    private groupService: CoreGroupService,
    private http: HttpClient
  ) {}

  public add(userId: string): Observable<TaskFormResponse> {
    return this.http.put<TaskFormResponse>(API_URL,
      { groupId: this.groupService.group.uid, userId },
      { headers: this.authService.getBasicAuthHeaders() });
  }

  public remove(userId: string): Observable<TaskFormResponse> {
    return this.http.post<TaskFormResponse>(API_URL,
{ groupId: this.groupService.group.uid, userId },
{ headers: this.authService.getBasicAuthHeaders() });
  }

  public list(): Observable<Array<MemberModel>> {
    const groupId = this.groupService.group.uid;

    return this.http.get<Array<MemberModel>>(API_URL, {
      headers: this.authService.getBasicAuthHeaders(),
      params: new HttpParams().set('groupId', groupId)
    });
  }

}
