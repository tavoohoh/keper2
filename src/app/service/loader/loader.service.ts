import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public toggleLoading(value = false): void {
    this.$loading.next(value);
  }

  public getLoadingAsObservable(): Observable<boolean> {
    return this.$loading.asObservable();
  }
}
