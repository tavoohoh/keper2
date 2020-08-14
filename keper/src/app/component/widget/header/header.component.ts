import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { UserModel } from '../../../_model/user.model';
import { ModalService } from '../../../service/common/modal.service';
import { ModalEnum } from '../../../_enum/modal.enum';

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

  constructor(
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.authService.userDataAsObservable().subscribe(user => {
      if (user) {
        this.user = new UserModel(user);
      }
    });
  }

  public toggleProfile(): void {
    this.modalService.currentModalValue = ModalEnum.PROFILE;
  }
}
