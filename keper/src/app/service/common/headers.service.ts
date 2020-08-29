import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {UserModel} from '../../_model/user.model';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {
  constructor(private authService: AuthService) {
  }

  public getBasicAuthHeaders(): HttpHeaders {
    const user: UserModel = this.authService.userValue;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`
    });
  }

}
