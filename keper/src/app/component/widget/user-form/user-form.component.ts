import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalMethods} from '../../../_shared/modal.methods';
import {AuthService} from '../../../service/auth/auth.service';
import {ToastService} from '../../../service/common/toast.service';
import {ModalService} from '../../../service/common/modal.service';
import {ModalEnum} from '../../../_enum';
import {CoreUserService} from '../../../service/core/user.service';
import {CoreMemberService} from '../../../service/core/member.service';
import {UserDbModel} from "../../../_model";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent extends ModalMethods implements OnInit {
  public submitted: boolean;
  public noEdited = true;
  public form: FormGroup;
  public memberId: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    public modalService: ModalService,
    private coreUserService: CoreUserService,
    private coreMemberService: CoreMemberService
  ) {
    super(modalService, ModalEnum.USER_FORM);
  }

  ngOnInit(): void {
    this.form = this.setForm();
  }

  get f() { return this.form.controls; }

  private setForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required]
    });
  }

  public formChange(): void {
    this.noEdited = false;
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

    if (this.memberId) {
      this.addMember(toast);
    } else {
      this.coreUserService.create(this.form.value)
        .subscribe(
          async () => {
            this.coreUserService.getByEmail(this.form.value.email)
              .subscribe(
                user => {
                  this.memberId = user.uid;
                  this.addMember(toast);
                },
                async error => await this.creationError(toast, error, 'onSubmitForm.coreUserService.getByEmail'));
          },
          async error => await this.creationError(toast, error, 'onSubmitForm.coreUserService.create')
        );
    }
  }

  public checkUsersEmail(): void {
    const emailValue = this.form.value.email.toLowerCase();
    this.coreUserService.getByEmail(emailValue)
      .subscribe(
        user => this.updateUserFieldValue(user),
        () => this.updateUserFieldValue());
  }

  private updateUserFieldValue(user: UserDbModel = null): void {
    this.f.displayName.patchValue(user ? user.displayName : '');
    this.f.displayName.updateValueAndValidity();

    this.memberId = user ? user.uid : null;
  }

  private addMember(toast): void {
    this.coreMemberService.add(this.memberId)
      .subscribe(async () => {
        this.modalClose.emit({ refresh: true });
        this.noEdited = true;
        this.submitted = false;
        this.memberId = null;
        await this.form.reset();
        this.onModalClose();
        await this.toastService.show(toast.message);
      }, async error => await this.creationError(toast, error, 'addMember.coreMemberService.add', error.error.message));
  }

  private async creationError(toast, error, context, message = 'TOAST.UNABLE_TO_SAVE'): Promise<void> {
    toast.message = message;
    toast.error = {
      message: error,
      origin: `GroupFormComponent.${context}`
    };
    await this.toastService.show(toast.message, toast.error);
  }
}
