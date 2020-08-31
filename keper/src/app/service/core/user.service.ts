import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

import {TaskModel, TaskFormResponse, TasksByDateModel} from '../../_model';
import {AuthService} from '../auth/auth.service';
import {CoreGroupService} from './group.service';
import {environment} from '../../../environments/environment';

const API_URL = `${environment.api}users`;

@Injectable({
  providedIn: 'root'
})
export class CoreUserService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

}
