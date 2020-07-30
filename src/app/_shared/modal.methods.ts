import { EventEmitter, OnDestroy, Output } from '@angular/core';
import { ModalService } from '../service/common/modal.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModalEnum } from '../_enum/modal.enum';

export class ModalMethods implements OnDestroy {
  public $destroyed = new Subject();
  public show = false;

  @Output() public modalClose = new EventEmitter<void>();

  constructor(
    public modalService: ModalService,
    public modalName: ModalEnum
  ) {
    this.modalService.currentModalAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(modal => {
        this.show = modalName === modal;
      });
  }

  ngOnDestroy() {
    this.modalService.currentModalValue = null;
    this.$destroyed.next();
    this.$destroyed.complete();
  }

  public onModalClose(): void {
    this.modalService.currentModalValue = null;
  }
}
