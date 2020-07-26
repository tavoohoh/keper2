import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (state.url === 'sign/in') {
      return this.isNotLoggedIn();
    } else {
      return this.isLoggedIn();
    }
  }

  private isLoggedIn(): boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigateByUrl('sign/in');
      return false;
    }

    return true;
  }

  private isNotLoggedIn(): boolean {
    if (this.authService.isLoggedIn) {
      this.router.navigateByUrl('today');
      return false;
    }

    return true;
  }

}
