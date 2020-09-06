import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../service/auth/auth.service';
import {ModalService} from '../../../service/common/modal.service';
import {ModalEnum} from '../../../_enum';
import {ChangePasswordAndModalMethods} from '../../../_shared/password-input.methods';
import {ToastService} from '../../../service/common/toast.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent extends ChangePasswordAndModalMethods implements OnInit {
  public submitted: boolean;
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public modalService: ModalService,
    private toastService: ToastService
  ) {
    super(modalService, ModalEnum.RESET_PASSWORD);
  }

  ngOnInit(): void {
    this.formFieldSetting.passwordType = 'password';
    this.form = this.setForm();
  }

  private setForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public async onSubmitForm(): Promise<void> {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const toast = {
      message: 'TOAST.PASSWORD_RECOVER_EMAIL',
      error: null
    };

    this.authService.passwordRecover(this.form.value.email)
      .then(async () => {
        this.submitted = false;
        this.onModalClose();
      })
      .catch(error => {
        toast.message = 'TOAST.SIGN_UP_ERROR';
        toast.error = {
          message: error,
          origin: 'RecoverPasswordComponent.onSubmitForm'
        };
      }).finally(async () => {
        await this.toastService.show(toast.message, toast.error);
      });
  }

  get f() { return this.form.controls; }

}
