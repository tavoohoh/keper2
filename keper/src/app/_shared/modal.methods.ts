import {AfterViewInit, EventEmitter, OnDestroy, Output} from '@angular/core';
import { ModalService } from '../service/common/modal.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModalEnum } from '../_enum/modal.enum';

export class ModalMethods implements OnDestroy, AfterViewInit {
  public $destroyed = new Subject();
  public show = false;

  @Output() public modalClose = new EventEmitter<{
    refresh?: boolean;
  } | null>();

  constructor(
    public modalService: ModalService,
    public modalName: ModalEnum
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.modalService.currentModalAsObservable()
        .pipe(takeUntil(this.$destroyed))
        .subscribe(modal => {
          this.show = this.modalName === modal;
        });
    });
  }

  ngOnDestroy() {
    this.modalService.currentModalValue = null;
    this.$destroyed.next();
    this.$destroyed.complete();
  }

  public onModalClose(newModalValue: ModalEnum | undefined = null): void {
    this.modalService.currentModalValue = newModalValue;
  }
}
