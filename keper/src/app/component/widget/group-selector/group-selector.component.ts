import {Component, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {ButtonTypeEnum, ModalEnum} from '../../../_enum';
import {LoaderService} from '../../../service/loader/loader.service';
import {AuthService} from '../../../service/auth/auth.service';
import {UserModel} from '../../../_model/user.model';
import {ModalMethods} from '../../../_shared/modal.methods';
import {ModalService} from '../../../service/common/modal.service';
import {ToastService} from '../../../service/common/toast.service';
import {CoreGroupService} from '../../../service/core/group.service';
import {GroupModel} from '../../../_model/group.model';
import {CardDesignEnum} from '../../../_enum/card-design.enum';

@Component({
  selector: 'app-group-selector',
  templateUrl: './group-selector.component.html',
  styleUrls: ['./group-selector.component.scss'],
})
export class GroupSelectorComponent extends ModalMethods implements OnInit {
  public buttonType = ButtonTypeEnum;
  public cardDesignType = CardDesignEnum;
  public userInfo: UserModel;
  public groups: Array<GroupModel>;

  constructor(
    private groupService: CoreGroupService,
    private loaderService: LoaderService,
    private authService: AuthService,
    private toastService: ToastService,
    public modalService: ModalService,
  ) {
    super(modalService, ModalEnum.GROUP_SELECTOR);
  }

  ngOnInit(): void {
    this.loaderService.toggleLoading(true);
    this.authService.userDataAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(user => {
        if (user) {
          this.userInfo = this.authService.userValue;
          this.getGroups();
        }
    });
  }

  private getGroups(): void {
    this.groupService.getGroups().subscribe(
      (groups: Array<GroupModel>) => this.groups = groups,
      async error => {
        await this.toastService.show('TOAST.LIST_GROUPS_ERROR', { message: error, origin: 'GroupSelector.getGroups' });
        this.loaderService.toggleLoading();
      });
  }

  public selectGroup(group): void {
    this.groupService.setGroup(group);
    this.onModalClose();
  }

  public openAddGroupModal(): void {
    console.log('create group');
  }
}
