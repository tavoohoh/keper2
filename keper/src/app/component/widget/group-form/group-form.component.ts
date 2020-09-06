import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalMethods} from '../../../_shared/modal.methods';
import {AuthService} from '../../../service/auth/auth.service';
import {ToastService} from '../../../service/common/toast.service';
import {ModalService} from '../../../service/common/modal.service';
import {ModalEnum} from '../../../_enum';
import {GroupModel} from '../../../_model';
import {CoreGroupService} from '../../../service/core/group.service';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss'],
})
export class GroupFormComponent extends ModalMethods implements OnChanges {
  @Input() private group: GroupModel;

  public submitted: boolean;
  public noEdited = true;
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private coreGroupService: CoreGroupService,
    public modalService: ModalService,
  ) {
    super(modalService, ModalEnum.GROUP_FORM);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.group && changes.group.currentValue) {
      this.group = changes.group.currentValue;
    }

    this.form = this.setForm();
  }

  get f() { return this.form.controls; }

  private setForm(): FormGroup {
    let name = '';

    if (this.group) {
      name = this.group.name || '';
    }

    return this.formBuilder.group({
      name: [name, Validators.required]
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

    const apiMethodName = this.group ? 'updateGroup' : 'createGroup';

    await this.coreGroupService[apiMethodName](this.form.value, this.group ? this.group.uid : null)
      .subscribe(
        async () => {
          if (this.group && this.coreGroupService.group.uid === this.group.uid) {
            this.group.name = this.form.value.name;
            this.coreGroupService.setGroup(this.group);
          }

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

  public onModalClose(): void {
    this.modalService.currentModalValue = ModalEnum.GROUP_SELECTOR;
  }
}
