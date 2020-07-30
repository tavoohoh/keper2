import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ButtonTypeEnum } from '../../../_enum';
import { LoaderService } from '../../../service/loader/loader.service';
import { AuthService } from '../../../service/auth/auth.service';
import { UserModel} from '../../../_model/user.model';
import { User } from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() public show: boolean;
  @Output() private closeProfile = new EventEmitter<void>();

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
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.authService.userDataAsObservable().subscribe(user => {
      if (user) {
        this.user = this.authService.user;
        this.userInfo = new UserModel(user);
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
    this.submitted = false;
    this.loader.toggleLoading();
  }

  public close(): void {
    this.closeProfile.emit();
    this.ngOnInit();
  }

  public fieldChanged(): void {
    this.noEdited = !(this.userInfo.name !== this.form.value.name || this.userInfo.email !== this.form.value.email);
  }

  public signOut(): void {
    this.closeProfile.emit();
    this.authService.signOut();
  }

  get f() { return this.form.controls; }
}
