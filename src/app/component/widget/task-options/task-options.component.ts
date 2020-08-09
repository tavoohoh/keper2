import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ModalMethods} from '../../../_shared/modal.methods';
import {TaskModel} from '../../../_model';
import {ModalService} from '../../../service/common/modal.service';
import {ButtonTypeEnum, ModalEnum} from '../../../_enum';

@Component({
  selector: 'app-task-options',
  templateUrl: './task-options.component.html',
  styleUrls: ['./task-options.component.scss'],
})
export class TaskOptionsComponent extends ModalMethods implements OnChanges {
  @Input() public task: TaskModel;
  @Output() private clickDeleteTask = new EventEmitter<TaskModel>();
  @Output() private clickEditTask = new EventEmitter<TaskModel>();
  public buttonType = ButtonTypeEnum;

  constructor(
    public modalService: ModalService,
  ) {
    super(modalService, ModalEnum.TASK_OPTIONS);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.task.currentValue) {
      this.task = changes.task.currentValue;
    }
  }

  public onDelete(): void {
    this.clickDeleteTask.emit(this.task);
  }

  public onEdit(): void {
    this.clickEditTask.emit(this.task);
  }

}
