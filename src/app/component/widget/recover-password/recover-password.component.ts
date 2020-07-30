import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoaderService} from '../../../service/loader/loader.service';
import {AuthService} from '../../../service/auth/auth.service';
import {ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {ModalService} from '../../../service/common/modal.service';
import {ModalEnum} from '../../../_enum/modal.enum';
import {ChangePasswordAndModalMethods} from '../../../_shared/password-input.methods';

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
    private loader: LoaderService,
    private authService: AuthService,
    private toastController: ToastController,
    private translateService: TranslateService,
    public modalService: ModalService
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

    this.loader.toggleLoading(true);

    const toast = await this.toastController.create({
      message: '',
      duration: 3000,
      position: 'top',
      color: 'success'
    });

    toast.message = await this.translateService.get('TOAST.PASSWORD_RECOVER_EMAIL').toPromise();

    this.authService.passwordRecover(this.form.value.email)
      .then(async () => {
        await toast.present();
        this.submitted = false;
        this.loader.toggleLoading();
        this.onModalClose();
      })
      .catch(async () => {
        toast.message = await this.translateService.get('TOAST.SIGN_UP_ERROR').toPromise();
        toast.color = 'danger';
        await toast.present();
        this.loader.toggleLoading();
      });
  }

  get f() { return this.form.controls; }

}
