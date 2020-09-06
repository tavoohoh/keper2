import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LoaderService} from '../../service/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptor {

  constructor(
    private loaderService: LoaderService
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.toggleLoading(true);

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.ok) {
          this.loaderService.toggleLoading();
        }
      },
      () => this.loaderService.toggleLoading())
    );
  }
}
