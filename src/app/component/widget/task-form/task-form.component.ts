import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalMethods} from '../../../_shared/modal.methods';
import {LoaderService} from '../../../service/loader/loader.service';
import {AuthService} from '../../../service/auth/auth.service';
import {ToastService} from '../../../service/common/toast.service';
import {ModalService} from '../../../service/common/modal.service';
import {ModalEnum} from '../../../_enum';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent extends ModalMethods implements OnInit {
  public submitted: boolean;
  public noEdited = true;
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private authService: AuthService,
    private toastService: ToastService,
    public modalService: ModalService,
  ) {
    super(modalService, ModalEnum.TASK_NEW);
  }

  ngOnInit() {
    this.form = this.setForm();
  }

  get f() { return this.form.controls; }

  private setForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      schedule: ['', Validators.required],
      days: [[], Validators.required],
      users: [[], Validators.required]
    });
  }

  private formChange(): void {
    this.noEdited = false;
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

    // await this.authService.updateUserProfile(this.user, this.form.value.name)
    //   .catch(error => {
    //     toast.message = 'TOAST.UNABLE_TO_SAVE_NAME';
    //     toast.error = {
    //       message: error,
    //       origin: 'ProfileComponent.onSubmitForm.updateUserProfile'
    //     };
    //   });

    await this.toastService.show(toast.message, toast.error);
    this.loaderService.toggleLoading();
    this.noEdited = true;
    this.submitted = false;
    this.form.reset();
    this.ngOnInit();
  }

}
