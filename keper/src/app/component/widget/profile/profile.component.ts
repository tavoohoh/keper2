import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User as FirebaseUser} from 'firebase';
import {takeUntil} from 'rxjs/operators';

import {ButtonTypeEnum, ModalEnum} from '../../../_enum';
import {AuthService} from '../../../service/auth/auth.service';
import {UserModel} from '../../../_model';
import {ModalMethods} from '../../../_shared/modal.methods';
import {ModalService} from '../../../service/common/modal.service';
import {ToastService} from '../../../service/common/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends ModalMethods implements OnInit {
  public submitted: boolean;
  public noEdited = true;
  public form: FormGroup;
  public buttonType = ButtonTypeEnum;
  public userInfo: UserModel;
  private firebaseUser: FirebaseUser;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    public modalService: ModalService,
  ) {
    super(modalService, ModalEnum.PROFILE);
  }

  ngOnInit(): void {
    this.authService.userDataAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(user => {
        if (user) {
          this.firebaseUser = this.authService.firebaseUserValue;
          this.userInfo = this.authService.userValue;
          this.form = this.setProfileForm();
        }
    });
  }

  private setProfileForm(): FormGroup {
    return this.formBuilder.group({
      email: [this.userInfo.email || '', [Validators.required, Validators.email]],
      name: [this.userInfo.name || '', Validators.required]
    });
  }

  public async onSubmitForm(): Promise<void> {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const toast = {
      message: 'TOAST.INFO_WAS_SAVED',
      error: null
    };

    await this.authService.updateUserProfile(this.firebaseUser, this.form.value.name)
      .catch(error => {
        toast.message = 'TOAST.UNABLE_TO_SAVE_NAME';
        toast.error = {
          message: error,
          origin: 'ProfileComponent.onSubmitForm.updateUserProfile'
        };
    });

    await this.authService.changeUserEmail(this.firebaseUser, this.form.value.email)
      .catch(error => {
        toast.message = 'TOAST.UNABLE_TO_SAVE_EMAIL';
        toast.error = {
          message: error,
          origin: 'ProfileComponent.onSubmitForm.changeUserEmail'
        };
    });

    await this.toastService.show(toast.message, toast.error);
    this.noEdited = true;
    this.submitted = false;
    this.ngOnInit();
  }

  public fieldChanged(): void {
    this.noEdited = !(this.userInfo.name !== this.form.value.name || this.userInfo.email !== this.form.value.email);
  }

  public toggleChangePassword(): void {
    this.modalService.currentModalValue = ModalEnum.CHANGE_PASSWORD;
  }

  public async signOut(): Promise<void> {
    this.onModalClose();
    await this.authService.signOut();
  }

  get f() { return this.form.controls; }
}
