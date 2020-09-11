import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ModalMethods} from '../../../_shared/modal.methods';
import {ModalService} from '../../../service/common/modal.service';
import {ButtonTypeEnum, EntityEnum, ModalEnum} from '../../../_enum';
import {CoreGroupService} from '../../../service/core/group.service';
import {ToastService} from '../../../service/common/toast.service';
import {CoreTaskService} from '../../../service/core/task.service';
import {CoreMemberService} from '../../../service/core/member.service';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss'],
})
export class ConfirmDeleteComponent extends ModalMethods implements OnChanges {
  @Input() public entityUid: string;
  @Input() public entityType: EntityEnum;
  @Input() public afterModalCloseOpen: ModalEnum;
  public buttonType = ButtonTypeEnum;

  constructor(
    public modalService: ModalService,
    private coreGroupService: CoreGroupService,
    private coreTaskService: CoreTaskService,
    private coreMembersService: CoreMemberService,
    private toastService: ToastService,
  ) {
    super(modalService, ModalEnum.CONFIRM_DELETE);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entityUid && changes.entityUid.currentValue) {
      this.entityUid = changes.entityUid.currentValue;
    }

    if (changes.afterModalCloseOpen && changes.afterModalCloseOpen.currentValue) {
      this.afterModalCloseOpen = changes.afterModalCloseOpen.currentValue;
    }

    if (changes.afterModalCloseOpen && changes.afterModalCloseOpen.currentValue) {
      this.afterModalCloseOpen = changes.afterModalCloseOpen.currentValue;
    }
  }

  public async onDelete(): Promise<void> {
    let apiMethodService = '';
    let apiMethodName = '';

    const toast = {
      message: 'TOAST.INFO_WAS_SAVED',
      error: null
    };

    switch (this.entityType) {
      case EntityEnum.GROUP:
        apiMethodService = 'coreGroupService';
        apiMethodName = 'deleteGroup';
        break;

      case EntityEnum.TASKS:
        apiMethodService = 'coreTaskService';
        apiMethodName = 'deleteTask';
        break;

      case EntityEnum.USERS:
        apiMethodService = 'coreMembersService';
        apiMethodName = 'remove';
        break;
    }

    await this[apiMethodService][apiMethodName](this.entityUid)
      .subscribe(
        async () => {
          if (this.entityType === EntityEnum.GROUP && this.coreGroupService.group.uid === this.entityUid) {
            this.coreGroupService.setGroup(null);
          }

          this.modalClose.emit({ refresh: true });
          this.onModalClose();
          await this.toastService.show(toast.message);
        },
        async error => {
          toast.message = 'TOAST.UNABLE_TO_SAVE';
          toast.error = {
            message: error,
            origin: `ConfirmDeleteComponent.onModalDelete.${apiMethodService}.${apiMethodName}`
          };
          await this.toastService.show(toast.message, toast.error);
        }
      );
  }

  public onModalClose(): void {
    this.modalService.currentModalValue = this.afterModalCloseOpen || null;
  }

}
