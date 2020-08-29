import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

import {HeadersService} from '../common/headers.service';
import {GroupModel} from '../../_model/group.model';
import {environment} from '../../../environments/environment';

const URL_CONTEXT = `${environment.api}groups`;

@Injectable({
  providedIn: 'root'
})
export class CoreGroupService {
  public $group: BehaviorSubject<GroupModel> = new BehaviorSubject<GroupModel>(null);

  constructor(
    private headersService: HeadersService,
    private http: HttpClient
  ) {
    if (this.group) {
      this.$group.next(this.group);
    }
  }

  public setGroup(group: GroupModel): void {
    this.$group.next(group);
    localStorage.setItem('keper-group', JSON.stringify(group));
  }

  public get group(): GroupModel {
    return JSON.parse(localStorage.getItem('keper-group'));
  }

  public getGroupAsObservable(): Observable<GroupModel> {
    return this.$group.asObservable();
  }

  public createGroup(group: GroupModel): Observable<{ message: string, groupUid: string }> {
    return this.http.post<any>(
      URL_CONTEXT,
      group,
      { headers: this.headersService.getBasicAuthHeaders() }
    );
  }

  public getGroup(groupUid: string): Observable<GroupModel> {
    return this.http.get<GroupModel>(
      URL_CONTEXT,
      {
        headers: this.headersService.getBasicAuthHeaders(),
        params: new HttpParams().set('uid', groupUid)
      }
    );
  }

  public getGroups(): Observable<Array<GroupModel>> {
    return this.http.get<Array<GroupModel>>(
      URL_CONTEXT,
      { headers: this.headersService.getBasicAuthHeaders() }
    );
  }

  public updateGroup(group: GroupModel, groupUid: string): Observable<{ message: string }> {
    return this.http.put<any>(
      URL_CONTEXT,
      group,
      {
        headers: this.headersService.getBasicAuthHeaders(),
        params: new HttpParams().set('uid', groupUid)
      }
    );
  }

  public deleteGroup(groupUid: string): Observable<{ message: string }> {
    return this.http.delete<any>(
      URL_CONTEXT,
      {
        headers: this.headersService.getBasicAuthHeaders(),
        params: new HttpParams().set('uid', groupUid)
      }
    );
  }

}
