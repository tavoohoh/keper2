import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalMethods} from '../../../_shared/modal.methods';
import {LoaderService} from '../../../service/loader/loader.service';
import {AuthService} from '../../../service/auth/auth.service';
import {ToastService} from '../../../service/common/toast.service';
import {ModalService} from '../../../service/common/modal.service';
import {DaysEnum, ModalEnum} from '../../../_enum';
import {TaskModel} from '../../../_model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent extends ModalMethods implements OnChanges {
  @Input() private task: TaskModel;

  public submitted: boolean;
  public noEdited = true;
  public form: FormGroup;
  public formFields = {
    days: [
      DaysEnum.MON,
      DaysEnum.TUE,
      DaysEnum.WEN,
      DaysEnum.THU,
      DaysEnum.FRI,
      DaysEnum.SAT,
      DaysEnum.SUN,
    ],
    users: [
      {
        id: 'uVn3URVzCKXYd1BB84GACilUNet1',
        name: 'Gustavo',
      },
      {
        id: 'B84GACilUNet1uVn3URVzCKXYd1B',
        name: 'Rachel',
      },
      {
        id: 'B84GACKXYd1BCilUNet1uVn3URVz',
        name: 'Nestor',
      },
      {
        id: 'B84GACKXYd1B123UNet1uVn3URVz',
        name: 'Andrea',
      },
      {
        id: 'B84GACKXuu1BCilUNet1uVn3URVz',
        name: 'Yuumy',
      }
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private authService: AuthService,
    private toastService: ToastService,
    public modalService: ModalService,
  ) {
    super(modalService, ModalEnum.TASK_NEW);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task && changes.task.currentValue) {
      this.task = changes.task.currentValue;
    }

    this.form = this.setForm();
  }

  get f() { return this.form.controls; }

  private setForm(): FormGroup {
    let name = '';
    let schedule = '';
    let days = [];
    let users = [];

    if (this.task) {
      name = this.task.name || '';
      schedule = this.task.schedule[0] || '';
      days = this.task.days || [];

      users = this.task.users.map(user => {
        return user.id;
      });
    }

    return this.formBuilder.group({
      name: [name, Validators.required],
      schedule: [schedule, Validators.required],
      days: [days],
      users: [users]
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
    this.onModalClose();
  }

  /**
   * Form fields
   */
  public async onCheckboxChange(e, fieldName: string): Promise<void> {
    const checkArray: Array<string> =
      this.form.controls[fieldName] && this.form.controls[fieldName].value &&
      this.form.controls[fieldName].value.length > 0 ? this.form.controls[fieldName].value : [];

    if (e.target.checked) {
      checkArray.push(e.target.value);
    } else {
      checkArray.splice(checkArray.findIndex(item => item === e.target.value), 1);
    }

    this.form.controls[fieldName].patchValue(checkArray);
    this.form.controls[fieldName].updateValueAndValidity();
  }

  public isChecked(value: string, fieldName: string): boolean {
    const checkArray: Array<string> =
      this.form.controls[fieldName] && this.form.controls[fieldName].value &&
      this.form.controls[fieldName].value.length > 0 ? this.form.controls[fieldName].value : [];

    return checkArray.includes(value);
  }
}
