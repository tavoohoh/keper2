import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalMethods} from '../../../_shared/modal.methods';
import {AuthService} from '../../../service/auth/auth.service';
import {ToastService} from '../../../service/common/toast.service';
import {ModalService} from '../../../service/common/modal.service';
import {ModalEnum} from '../../../_enum';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent extends ModalMethods implements OnInit {
  public submitted: boolean;
  public noEdited = true;
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    public modalService: ModalService,
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
      name: ['', Validators.required]
    });
  }

  public formChange(): void {
    this.noEdited = false;
  }

  public async onSubmitForm(): Promise<void> {
    this.submitted = true;

    console.log('form', this.form.value);

    if (this.form.invalid) {
      return;
    }

    const toast = {
      message: 'TOAST.INFO_WAS_SAVED',
      error: null
    };

    // await this.authService.updateUserProfile(this.user, this.form.value.name)
    //   .catch(error => {
    //     toast.message = 'TOAST.UNABLE_TO_SAVE_NAME';
    //     toast.error = {
    //       message: error,
    //       origin: 'ProfileComponent.onSubmitForm.updateUserProfile'
    //     };
    //   });

    await this.toastService.show(toast.message, toast.error);
    this.noEdited = true;
    this.submitted = false;
    this.form.reset();
    this.onModalClose();
  }
}
