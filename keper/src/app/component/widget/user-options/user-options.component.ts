import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ModalMethods} from '../../../_shared/modal.methods';
import {ModalService} from '../../../service/common/modal.service';
import {ButtonTypeEnum, ModalEnum} from '../../../_enum';
import {UserModel} from '../../../_model/user.model';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss'],
})
export class UserOptionsComponent extends ModalMethods implements OnChanges {
  @Input() public user: UserModel;
  @Output() private clickRemoveUser = new EventEmitter<UserModel>();
  public buttonType = ButtonTypeEnum;

  constructor(
    public modalService: ModalService,
  ) {
    super(modalService, ModalEnum.USER_OPTIONS);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.user.currentValue) {
      this.user = changes.user.currentValue;
    }
  }

  public onRemove(): void {
    this.clickRemoveUser.emit(this.user);
  }

}
