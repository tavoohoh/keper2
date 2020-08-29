import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../service/auth/auth.service';
import {UserModel} from '../../../_model/user.model';
import {ModalService} from '../../../service/common/modal.service';
import {ModalEnum} from '../../../_enum';
import {CoreGroupService} from '../../../service/core/group.service';
import {GroupModel} from '../../../_model/group.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() public title: string;
  @Input() public description: string;
  @Input() public showProfileBtn: boolean;

  public user: UserModel;
  public group: GroupModel;

  constructor(
    private authService: AuthService,
    private modalService: ModalService,
    private groupService: CoreGroupService
  ) { }

  ngOnInit() {
    this.authService.userDataAsObservable().subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    this.groupService.getGroupAsObservable().subscribe(group => {
      if (group) {
        this.group = group;
      }
    });
  }

  public toggleProfile(): void {
    this.modalService.currentModalValue = ModalEnum.PROFILE;
  }

  public toggleGroupSelector(): void {
    this.modalService.currentModalValue = ModalEnum.GROUP_SELECTOR;
  }
}

