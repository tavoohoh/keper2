import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

import {TaskModel, TaskFormResponse, TasksByDateModel} from '../../_model';
import {AuthService} from '../auth/auth.service';
import {CoreGroupService} from './group.service';
import {environment} from '../../../environments/environment';

const API_URL = `${environment.api}tasks`;

@Injectable({
  providedIn: 'root'
})
export class CoreTaskService {

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private groupService: CoreGroupService,
    private http: HttpClient
  ) {}

  public updateTask(task: TaskModel, taskUid: string): Observable<TaskFormResponse> {
    return this.http.put<TaskFormResponse>(API_URL, task, {
      headers: this.authService.getBasicAuthHeaders(),
      params: new HttpParams().set('id', taskUid)
    });
  }

  public createTask(task: TaskModel, taskUid = null): Observable<TaskFormResponse> {
    task.group = this.groupService.group.uid;

    return this.http.post<TaskFormResponse>(API_URL, task, {
      headers: this.authService.getBasicAuthHeaders()
    });
  }

  public getTask(taskUid: string): Observable<TaskModel> {
    return this.http.get<TaskModel>(API_URL, {
      headers: this.authService.getBasicAuthHeaders(),
      params: new HttpParams().set('id', taskUid)
    });
  }

  public deleteTask(taskUid: string): Observable<TaskModel> {
    return this.http.delete<TaskModel>(API_URL, {
      headers: this.authService.getBasicAuthHeaders(),
      params: new HttpParams().set('id', taskUid)
    });
  }

  public listTask(): Observable<Array<TaskModel>> {
    const groupUid = this.groupService.group.uid;

    return this.http.get<Array<TaskModel>>(API_URL, {
      headers: this.authService.getBasicAuthHeaders(),
      params: new HttpParams().set('groupId', groupUid)
    });
  }

  public listTaskByDate(date: string): Observable<TasksByDateModel> {
    const groupUid = this.groupService.group.uid;

    return this.http.get<TasksByDateModel>(API_URL, {
      headers: this.authService.getBasicAuthHeaders(),
      params: new HttpParams().set('groupId', groupUid).set('date', date)
    });
  }

}
