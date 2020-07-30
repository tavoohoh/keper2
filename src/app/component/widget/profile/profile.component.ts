import {Component, OnInit} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {User} from 'firebase';

import {ButtonTypeEnum} from '../../../_enum';
import {LoaderService} from '../../../service/loader/loader.service';
import {AuthService} from '../../../service/auth/auth.service';
import {UserModel} from '../../../_model/user.model';
import {ModalMethods} from '../../../_shared/modal.methods';
import {ModalService} from '../../../service/common/modal.service';
import {ModalEnum} from '../../../_enum/modal.enum';
import {takeUntil} from 'rxjs/operators';

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
  private user: User;

  constructor(
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private authService: AuthService,
    private toastController: ToastController,
    private translateService: TranslateService,
    public modalService: ModalService
  ) {
    super(modalService, ModalEnum.PROFILE);
  }

  ngOnInit(): void {
    this.loader.toggleLoading(true);
    this.authService.userDataAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(user => {
        if (user) {
          this.user = this.authService.user;
          this.userInfo = new UserModel(user);
          this.form = this.setProfileForm();
          this.loader.toggleLoading();
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

    this.loader.toggleLoading(true);

    const toast = await this.toastController.create({
      message: '',
      duration: 3000,
      position: 'top',
      color: 'success'
    });

    toast.message = await this.translateService.get('TOAST.INFO_WAS_SAVED').toPromise();

    await this.authService.updateUserProfile(this.user, this.form.value.name)
      .catch(async () => {
        toast.message = await this.translateService.get('TOAST.UNABLE_TO_SAVE_NAME').toPromise();
        toast.color = 'danger';
    });

    await this.authService.changeUserEmail(this.user, this.form.value.email)
      .catch(async () => {
        toast.message = await this.translateService.get('TOAST.UNABLE_TO_SAVE_EMAIL').toPromise();
        toast.color = 'danger';
    });

    await toast.present();
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

  public signOut(): void {
    this.onModalClose();
    this.authService.signOut();
  }

  get f() { return this.form.controls; }
}
