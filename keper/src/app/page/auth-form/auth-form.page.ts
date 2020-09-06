import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';

import {ButtonTypeEnum, ModalEnum} from '../../_enum';
import {AuthService} from '../../service/auth/auth.service';
import {ChangePasswordMethods} from '../../_shared/password-input.methods';
import {ModalService} from '../../service/common/modal.service';
import {ToastService} from '../../service/common/toast.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './auth-form.page.html',
  styleUrls: ['./auth-form.page.scss'],
})
export class AuthFormPage extends ChangePasswordMethods implements OnDestroy, OnInit {
  public loading: boolean;
  public submitted: boolean;
  public isSignIn: boolean;
  public buttonType = ButtonTypeEnum;
  public form: FormGroup;
  private destroyed$ = new Subject();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private modalService: ModalService
  ) {
    super();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
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
    this.authService.updateUserProfile(this.authService.firebaseUserValue, this.form.value.name)
      .then(() => null)
      .catch(error => this.toastService.show('TOAST.CREATE_PROFILE', { message: error, origin: 'AuthFormPage.updateUserProfile' }));
  }

  private submitSignIn(): void {
    this.authService.signIn(this.form.value)
      .then(() => null)
      .catch(error => this.toastService.show('TOAST.SIGN_IN_ERROR', { message: error, origin: 'AuthFormPage.submitSignIn' }));
  }

  private submitSignUp(): void {
    this.authService.registerUser(this.form.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        () => this.authService.signIn(this.form.value).then(() => this.updateUserProfile(),
        error => this.toastService.show('TOAST.SIGN_UP_ERROR', { message: error, origin: 'AuthFormPage.submitSignUp' })
      ));
  }

  get f() { return this.form.controls; }

  public onSubmitForm(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.isSignIn) {
      this.submitSignIn();
    } else {
      this.submitSignUp();
    }
  }

  public toggleRecoverPassword(): void {
    this.modalService.currentModalValue = ModalEnum.RESET_PASSWORD;
  }
}
