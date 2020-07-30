import {Component, OnInit} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {User} from 'firebase';

import {LoaderService} from '../../../service/loader/loader.service';
import {AuthService} from '../../../service/auth/auth.service';
import {ModalService} from '../../../service/common/modal.service';
import {ModalEnum} from '../../../_enum/modal.enum';
import {ChangePasswordAndModalMethods} from '../../../_shared/password-input.methods';

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
    private toastController: ToastController,
    private translateService: TranslateService,
    private loader: LoaderService,
    public modalService: ModalService
  ) {
    super(modalService, ModalEnum.CHANGE_PASSWORD);
  }

  ngOnInit(): void {
    this.loader.toggleLoading(true);
    this.formFieldSetting.passwordType = 'password';
    this.authService.userDataAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(user => {
        if (user) {
          this.user = this.authService.user;
          this.form = this.setForm();
          this.loader.toggleLoading();
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

    this.loader.toggleLoading(true);

    const toast = await this.toastController.create({
      message: '',
      duration: 3000,
      position: 'top',
      color: 'success'
    });

    toast.message = await this.translateService.get('TOAST.INFO_WAS_SAVED').toPromise();

    this.authService.changeUserPassword(this.user, this.form.value.password)
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

  public onModalClose(): void {
    this.form.reset();
    this.modalService.currentModalValue = ModalEnum.PROFILE;
  }
}
