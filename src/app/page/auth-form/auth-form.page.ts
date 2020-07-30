import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { ButtonTypeEnum } from '../../_enum';
import { AuthService } from '../../service/auth/auth.service';
import { LoaderService } from '../../service/loader/loader.service';
import { ChangePasswordMethods } from '../../_shared/password-input.methods';

@Component({
  selector: 'app-sign-in',
  templateUrl: './auth-form.page.html',
  styleUrls: ['./auth-form.page.scss'],
})
export class AuthFormPage extends ChangePasswordMethods implements OnInit {
  public loading: boolean;
  public submitted: boolean;
  public isSignIn: boolean;
  public buttonType = ButtonTypeEnum;
  public form: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private translateService: TranslateService,
    private loader: LoaderService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.form = this.setSignUpForm();

    setTimeout(() => this.loading = false, 1000);
  }

  public toggleForm() {
    this.loading = true;
    setTimeout(() => {
      this.submitted = false;
      this.formFieldSetting.passwordType = 'password';
      this.isSignIn = !this.isSignIn;
      this.form.reset();
      this.form = this.isSignIn ? this.setSignInForm() : this.setSignUpForm();
      this.loading = false;
    }, 500);
  }

  private setSignUpForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private setSignInForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private updateUserProfile(): void {
    this.authService.updateUserProfile(this.authService.user, this.form.value.name)
      .then(() => this.loader.toggleLoading())
      .catch(async () => {
      const toast = await this.toastController.create({
        message: await this.translateService.get('TOAST.CREATE_PROFILE').toPromise(),
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      this.loader.toggleLoading();
      toast.present();
    });
  }

  private submitSignIn(): void {
    this.loader.toggleLoading(true);

    this.authService.signIn(this.form.value)
      .then(() => this.loader.toggleLoading())
      .catch(async () => {
        const toast = await this.toastController.create({
          message: await this.translateService.get('TOAST.SIGN_IN_ERROR').toPromise(),
          duration: 3000,
          position: 'top',
          color: 'danger'
        });
        this.loader.toggleLoading();
        toast.present();
      });
  }

  private submitSignUp(): void {
    this.loader.toggleLoading(true);

    this.authService.registerUser(this.form.value)
      .then(() => this.authService.signIn(this.form.value).then(() => this.updateUserProfile()))
      .catch(async () => {
        const toast = await this.toastController.create({
          message: await this.translateService.get('TOAST.SIGN_UP_ERROR').toPromise(),
          duration: 3000,
          position: 'top',
          color: 'danger'
        });
        this.loader.toggleLoading();
        toast.present();
      });
  }

  get f() { return this.form.controls; }

  public onSubmitForm(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loader.toggleLoading();

    if (this.isSignIn) {
      this.submitSignIn();
    } else {
      this.submitSignUp();
    }
  }
}
