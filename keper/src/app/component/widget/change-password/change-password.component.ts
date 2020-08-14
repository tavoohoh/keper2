import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {User} from 'firebase';

import {ChangePasswordAndModalMethods} from '../../../_shared/password-input.methods';
import {LoaderService} from '../../../service/loader/loader.service';
import {AuthService} from '../../../service/auth/auth.service';
import {ModalService} from '../../../service/common/modal.service';
import {ModalEnum} from '../../../_enum';
import {ToastService} from '../../../service/common/toast.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent extends ChangePasswordAndModalMethods implements OnInit {
  public submitted: boolean;
  public form: FormGroup;
  private user: User;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loaderService: LoaderService,
    public modalService: ModalService,
    private toastService: ToastService
  ) {
    super(modalService, ModalEnum.CHANGE_PASSWORD);
  }

  ngOnInit(): void {
    this.loaderService.toggleLoading(true);
    this.formFieldSetting.passwordType = 'password';
    this.authService.userDataAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(user => {
        if (user) {
          this.user = this.authService.user;
          this.form = this.setForm();
          this.loaderService.toggleLoading();
        }
    });
  }

  private setForm(): FormGroup {
    return this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public async onSubmitForm(): Promise<void> {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loaderService.toggleLoading(true);

    const toast = {
      message: 'TOAST.INFO_WAS_SAVED',
      error: null
    };

    this.authService.changeUserPassword(this.user, this.form.value.password)
      .then(async () => {
        this.submitted = false;
        this.onModalClose();
      })
      .catch(error => {
        toast.message = 'TOAST.SIGN_UP_ERROR';
        toast.error = {
          message: error,
          origin: 'ChangePasswordComponent.onSubmitForm'
        };
      }).finally(async () => {
        this.loaderService.toggleLoading();
        await this.toastService.show(toast.message, toast.error);
      });
  }

  get f() { return this.form.controls; }

  public onModalClose(): void {
    this.form.reset();
    this.modalService.currentModalValue = ModalEnum.PROFILE;
  }
}
