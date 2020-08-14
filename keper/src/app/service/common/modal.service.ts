import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalEnum } from '../../_enum/modal.enum';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private $currentModal = new BehaviorSubject<ModalEnum>(null);

  public get currentModalValue(): ModalEnum {
    return this.$currentModal.value;
  }

  public set currentModalValue(value: ModalEnum) {
    this.$currentModal.next(value);
  }

  public currentModalAsObservable(): Observable<ModalEnum> {
    return this.$currentModal.asObservable();
  }
}
