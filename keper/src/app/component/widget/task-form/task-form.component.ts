import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ModalMethods} from '../../../_shared/modal.methods';
import {AuthService} from '../../../service/auth/auth.service';
import {ToastService} from '../../../service/common/toast.service';
import {ModalService} from '../../../service/common/modal.service';
import {DaysEnum, ModalEnum} from '../../../_enum';
import {EntityModel, MemberModel, TaskModel} from '../../../_model';
import {CoreTaskService} from '../../../service/core/task.service';
import {CoreMemberService} from '../../../service/core/member.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent extends ModalMethods implements OnChanges {
  @Input() private entity: EntityModel = null;
  private task: TaskModel = null;

  public submitted: boolean;
  public noEdited = true;
  public form: FormGroup;

  public formFields: {
    days: Array<DaysEnum>;
    users: Array<MemberModel>;
  } = {
    days: [
      DaysEnum.MON,
      DaysEnum.TUE,
      DaysEnum.WEN,
      DaysEnum.THU,
      DaysEnum.FRI,
      DaysEnum.SAT,
      DaysEnum.SUN,
    ],
    users: []
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    public modalService: ModalService,
    private coreTaskService: CoreTaskService,
    private coreMemberService: CoreMemberService
  ) {
    super(modalService, ModalEnum.TASK_FORM);
  }

  get f() { return this.form.controls; }

  ngOnChanges(changes: SimpleChanges): void {
    this.task = null;

    if (changes && changes.entity && changes.entity.currentValue) {
      this.task = changes.entity.currentValue.value;
    }

    this.getGroupUsers();
  }

  private getGroupUsers(): void {
    this.coreMemberService.list().subscribe(members => {
      this.formFields.users = members;
      this.setForm();
    });
  }

  private setForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      schedule: ['', Validators.required],
      days: [[]],
      users: [[]]
    });

    if (this.task) {
      this.form.patchValue({
        name: this.task.name || '',
        schedule: this.task.schedule || '',
        days: this.task.days || [],
        users: this.task.users?.map(user => {
          return user;
        }) || []
      });
      this.form.updateValueAndValidity();
    } else {
      this.form.reset();
    }
  }

  public formChange(): void {
    this.noEdited = false;
  }

  public onSubmitForm(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const toast = {
      message: 'TOAST.INFO_WAS_SAVED',
      error: null
    };

    const apiMethodName = this.task ? 'updateTask' : 'createTask';

    this.coreTaskService[apiMethodName](this.form.value, this.task ? this.task.uid : null)
      .subscribe(
        async () => {
          this.modalClose.emit({ refresh: true });
          this.noEdited = true;
          this.submitted = false;
          await this.form.reset();
          this.onModalClose();
          await this.toastService.show(toast.message);
        },
        async error => {
          toast.message = 'TOAST.UNABLE_TO_SAVE';
          toast.error = {
            message: error,
            origin: `GroupFormComponent.onSubmitForm.${apiMethodName}`
          };
          await this.toastService.show(toast.message, toast.error);
        }
      );
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

  public onModalClose(newModalValue: ModalEnum | undefined = null): void {
    this.modalService.currentModalValue = newModalValue;
    this.form.reset();
  }
}
